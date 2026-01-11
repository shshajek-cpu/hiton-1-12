# 가계부(Ledger) 기능 구현 설계도

## 1. 개요
현재 UI만 구현된 가계부 페이지(`ledger/page.tsx`)를 실제 데이터베이스(`supabase`)와 연동하여 작동하도록 만듭니다.
사용자 식별은 별도의 로그인 없이 `device_id` (LocalStorage 저장)를 기반으로 처리합니다.

## 2. 데이터 모델링 (Frontend <-> Backend)

### 2.1 사용자 식별 (Auth)
- **방식**: `ledger_users` 테이블에 `device_id`로 사용자 등록.
- **Client**: 최초 접속 시 UUID 생성하여 `localStorage`에 `ledger_device_id`로 저장.
- **Server**: API 요청 시 Header(`x-device-id`)로 식별.

### 2.2 캐릭터 (Character)
- **Table**: `ledger_characters`
- **Frontend Type**:
```typescript
type Character = {
    id: string
    name: string
    class_name: string // 직업 (수호성, 살성 등)
    server_name: string // 서버 (현재 UI에는 없으나 DB에 존재, 기본값 설정 필요)
    is_main: boolean
    income?: number // 일일 총 수입 계산값
}
```

### 2.3 일일 기록 (Daily Record)
- **Table**: `ledger_daily_records`
- **구조**: 날짜(`date`)와 캐릭터(`character_id`)의 조합으로 유니크.
- **Fields**:
    - `kina_income`: 기타/직접 입력 수입 (RevenueInputForm의 '기타' 또는 별도 필드)
    - `count_expedition`: 원정대 수입 (현재 UI는 횟수 기록이 아니라 금액 기록임. DB 컬럼은 count지만, UI는 금액 위주. **설계 변경 필요** 또는 **매핑 전략 필요**)
    - **이슈**: 현재 DB는 `count_expedition`, `count_transcend` 등으로 "횟수"를 저장하는 것처럼 보이나, UI는 "원정대 수입", "초월 콘텐츠" 등 카테고리별 "금액"을 누적함.
    - **해결 방안**:
        1. DB의 `count_` 컬럼을 사용하지 않고 `ledger_record_items`에 "원정대 정산", "초월 보상" 등의 아이템으로 저장하여 합산? -> 복잡함.
        2. **DB 스키마 수정 제안**: `ledger_daily_records`에 JSONB 컬럼 `details`를 추가하여 섹션별 상세 기록을 저장하거나, `ledger_revenue_logs` 같은 별도 테이블로 1:N 관계를 맺는 것이 나음.
        3. **현실적 대안 (MVP)**: `ledger_record_items` 테이블을 활용.
            - `category`: 'expedition' | 'transcend' | 'etc' | 'item_sale'
            - `item_name`: '1회차', '균열 수호', '전설의 수정검' 등
            - `price`: 금액
            - `count`: 1
            - 이렇게 하면 `ledger_daily_records`는 날짜별 앵커 역할만 하고, 실제 수입 내역은 모두 `ledger_record_items` (또는 이름을 `ledger_entries`로 생각)에 저장.

### 2.4 아이템 판매 (Item Sales)
- **Table**: `ledger_record_items`
- **활용**: 위 해결 방안에 따라 통합 관리.
    - `item_name`: 아이템 이름
    - `count`: 수량 (기본 1)
    - `price`: 판매 금액 (DB에 컬럼 추가 필요할 수 있음. 현재 `ledger_record_items`에는 `count`만 있고 `price`가 없음. **DB 마이그레이션 필수**)

## 3. DB 스키마 수정 계획 (Migration)

기존 `ledger_daily_records`의 `kina_income` 등 고정 컬럼 방식은 유연성이 떨어지므로, `ledger_entries` (구 `ledger_record_items` 확장) 방식으로 변경합니다.

### 변경 사항
1. **`ledger_record_items` 테이블 수정**
    - `price` (bigint) 컬럼 추가 (필수)
    - `category` (text) 컬럼 추가 (필수 - 'expedition', 'transcend', 'etc', 'item_sale')
    - 기존 `ledger_daily_records`의 `count_...` 컬럼들은 사용하지 않거나 요약용으로만 사용.

## 4. API 설계

### 4.1 Base Path: `/api/ledger`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/init` | 사용자 등록 및 `device_id` 확인/발급 |
| **GET** | `/characters` | 내 캐릭터 목록 및 금일 요약 조회 |
| **POST** | `/characters` | 캐릭터 추가 |
| **DELETE**| `/characters/:id` | 캐릭터 삭제 |
| **GET** | `/records` | 특정 캐릭터/날짜의 상세 내역 조회 |
| **POST** | `/records/entry` | 수입 내역(원정대, 아이템 등) 추가 |
| **DELETE**| `/records/entry/:id` | 수입 내역 삭제 |

## 5. 컴포넌트 수정 계획

### 5.1 `LedgerPage.tsx`
- `useEffect`로 초기 데이터 로드 (`/api/ledger/init` -> `/api/ledger/characters`).
- 캐릭터 선택 시 해당 캐릭터의 오늘 날짜 기록 로드.
- `CharacterSummary` 타입 실제 데이터로 교체.

### 5.2 `RevenueInputForm.tsx`
- `sections` props를 통해 데이터를 받지만, `onAddRecord`가 API 호출을 트리거하도록 변경.
- 입력된 데이터를 `category` ('expedition', 'transcend', 'etc')와 함께 전송.

### 5.3 `ItemSalesSection.tsx`
- 검색바 입력 시:
    1. DB `ledger_items` (마스터 데이터) 검색.
    2. 없으면 그냥 텍스트로 입력 가능하도록 처리.
- 선택/엔터 시: 가격 입력 모달 또는 인라인 확장 -> 저장 (`category: 'item_sale'`).
- 현재 UI에는 "가격 입력" 부분이 명시적으로 없으므로, 검색 후 가격을 입력하는 UX 추가 필요.

## 6. 구현 단계 (Step-by-Step)

1.  **DB Migration**: `ledger_record_items`에 `price`, `category` 컬럼 추가.
2.  **API 개발**:
    - `route.ts` 파일들 생성 (`app/api/ledger/...`)
    - Supabase Client 활용.
3.  **Frontend Hook 개발**: `hooks/useLedger.ts` (데이터 fetching 및 상태 관리).
4.  **UI 연동**:
    - `LedgerPage`에 Hook 연결.
    - 하위 컴포넌트 이벤트 핸들러 연결.
5.  **테스트**: 데이터 저장/삭제/조회 확인.


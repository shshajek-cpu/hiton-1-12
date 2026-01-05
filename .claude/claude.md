# AION2 Project Guidelines for Claude Code

> Next.js 14 + TypeScript + Supabase 기반 AION2 캐릭터 정보 시스템

---

## 🎯 핵심 원칙

### 1. TypeScript 엄격 사용
- `any` 타입 **절대 금지**
- 모든 함수/컴포넌트에 명시적 타입 정의
- 제네릭 활용으로 타입 안정성 확보
- strict mode 필수 (`tsconfig.json`)

### 2. 컴포넌트 분리
- **서버 컴포넌트**: 데이터 페칭만 담당
- **클라이언트 컴포넌트**: 상태/이벤트 처리 (`'use client'` 명시)
- Props 인터페이스 반드시 정의

### 3. 네이밍 컨벤션
- 컴포넌트 파일: `PascalCase.tsx`
- 유틸리티/데이터: `camelCase.ts`
- 상수: `UPPER_SNAKE_CASE`
- 인터페이스/타입: `PascalCase`

---

## 🔌 API 패턴

### 공식 API 호출
```typescript
// 항상 프록시 사용 (CORS 방지)
fetch(`/api/proxy?endpoint=${encodeURIComponent(path)}`)
```

### Supabase 쿼리
- 타입 정의 후 `as Type` 캐스팅 사용
- 에러 체크 필수: `if (error) throw error`

### 에러 처리
- 재시도 로직 구현 (최대 3회)
- 일관된 에러 응답 형식: `{ success: false, error: {...} }`

---

## 🎨 UI/UX 가이드라인

### 색상 팔레트
- Primary: `#2563eb` (파란색)
- 등급별 색상:
  - Legend: `#F59E0B`
  - Unique: `#8B5CF6`
  - Rare: `#3B82F6`
  - Common: `#374151`

### 필수 UI 요소
- 모든 비동기 작업에 로딩 상태 표시
- 스켈레톤 UI 제공
- 에러 발생 시 사용자 친화적 메시지 표시
- 반응형 디자인 (모바일 우선)

---

## ⚡ 성능 최적화

- Next.js `Image` 컴포넌트 사용
- 큰 컴포넌트는 `dynamic` import 활용
- `useMemo`/`useCallback`로 불필요한 재렌더링 방지
- API 응답 캐싱 (revalidate 설정)

---

## 🎯 특수 케이스: 대바니온 보드

### Board ID 매핑 규칙

**천족 (Elyos)**:
- Warriors: 11-16
- Mages: 21-26
- Priests: 31-36
- Scouts: 41-46

**마족 (Asmodian)**:
- Mages: 51-56
- Scouts: 61-66
- Warriors: 71-76
- Priests: 81-86

**계산 공식**: `boardId = getBoardIdBase(race, class) + godIndex`

---

## ✅ 커밋 전 체크리스트

코드 변경 후 다음 사항을 반드시 확인:

- [ ] `npm run build` 성공
- [ ] TypeScript 에러 없음
- [ ] 콘솔 에러/경고 없음
- [ ] `any` 타입 미사용
- [ ] 로딩/에러 상태 UI 존재
- [ ] 타입 정의 작성 (`types/`)

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/              # API Routes
│   ├── c/[server]/[name]/ # 동적 라우팅
│   └── components/       # 페이지별 컴포넌트
├── components/           # 공통 컴포넌트
├── data/                # 정적 데이터
├── types/               # 타입 정의
├── lib/                 # 유틸리티 함수
└── context/             # React Context
```

---

## 🤖 Claude Code 작업 시 주의사항

### 파일 수정 전
- 반드시 해당 파일을 먼저 읽고 이해
- 기존 코드 패턴 유지
- 불필요한 리팩토링 지양

### 코드 작성 시
- 보안 취약점 주의 (XSS, SQL injection 등)
- 과도한 엔지니어링 지양 - 요청된 기능만 구현
- 사용되지 않는 코드는 완전히 삭제

### 변경 범위
- 요청받지 않은 기능 추가 금지
- 변경하지 않은 코드에 주석/타입 주석 추가 금지
- 역호환성 해킹 금지 (사용하지 않으면 삭제)

---

**Tech Stack**: Next.js 14 | TypeScript | Supabase | React 18 | TailwindCSS

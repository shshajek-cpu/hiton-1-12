# UI 컴포넌트 라이브러리

dak.gg 테마 기반의 재사용 가능한 React 컴포넌트 라이브러리입니다.

## 📦 컴포넌트 목록

- **Button** - 다양한 스타일의 버튼 컴포넌트
- **Card** - 카드 레이아웃 컴포넌트
- **Badge** - 배지/태그 컴포넌트
- **Input** - 폼 입력 컴포넌트
- **SearchInput** - 검색 입력 컴포넌트
- **SearchBar** - 자동완성 검색바 컴포넌트
- **Container** - 레이아웃 컨테이너
- **Grid** - 그리드 레이아웃

## 🚀 사용법

### 기본 Import

```tsx
import { Button, Card, Badge, Input, Container, Grid } from '@/components/ui';
```

### Button

```tsx
// Primary 버튼
<Button variant="primary" onClick={() => console.log('clicked')}>
  클릭하세요
</Button>

// Secondary 버튼
<Button variant="secondary" size="lg">
  큰 버튼
</Button>

// Filter 버튼 (토글 가능)
<Button variant="filter" active={isActive}>
  필터
</Button>

// 비활성화
<Button disabled>
  비활성화
</Button>

// 전체 너비
<Button fullWidth>
  전체 너비 버튼
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline' | 'filter' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `active`: boolean (filter variant에서 사용)
- `disabled`: boolean

### Card

```tsx
// 기본 카드
<Card variant="default">
  <h3>제목</h3>
  <p>내용</p>
</Card>

// 강조된 카드
<Card variant="elevated" padding="6">
  <h3>중요한 내용</h3>
</Card>

// 호버 효과가 있는 카드
<Card hoverable>
  마우스를 올려보세요
</Card>

// 클릭 가능한 카드
<Card onClick={() => navigate('/detail')}>
  클릭하세요
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'flat'
- `padding`: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10'
- `hoverable`: boolean
- `onClick`: () => void

### Badge

```tsx
// 기본 배지
<Badge variant="default">기본</Badge>

// 상태 배지
<Badge variant="success">성공</Badge>
<Badge variant="error">에러</Badge>
<Badge variant="warning">경고</Badge>
<Badge variant="info">정보</Badge>

// 크기
<Badge size="sm">작음</Badge>
<Badge size="md">중간</Badge>
<Badge size="lg">큼</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'error' | 'warning' | 'info'
- `size`: 'sm' | 'md' | 'lg'

### Input

```tsx
// 기본 입력
<Input placeholder="입력하세요" />

// 라벨이 있는 입력
<Input label="이름" placeholder="이름을 입력하세요" />

// 도움말 텍스트
<Input
  label="이메일"
  helperText="이메일 형식으로 입력해주세요"
/>

// 에러 상태
<Input
  label="비밀번호"
  type="password"
  error="비밀번호가 너무 짧습니다"
/>

// 전체 너비
<Input fullWidth />
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `fullWidth`: boolean
- + 모든 HTML input props

### Container

```tsx
// 기본 컨테이너
<Container>
  내용
</Container>

// 최대 너비 지정
<Container maxWidth="xl">
  넓은 컨테이너
</Container>

// 패딩 없음
<Container padding={false}>
  패딩 없는 컨테이너
</Container>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: boolean

### SearchInput

```tsx
// 기본 검색
<SearchInput
  placeholder="검색..."
  onSearch={(value) => console.log(value)}
/>

// 로딩 상태
<SearchInput
  loading={true}
  placeholder="검색 중..."
/>

// 크기
<SearchInput size="sm" />
<SearchInput size="md" />
<SearchInput size="lg" />

// 전체 너비
<SearchInput fullWidth />

// Clear 버튼 없이
<SearchInput showClearButton={false} />

// 제어 컴포넌트
<SearchInput
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  onSearch={handleSearch}
/>
```

**Props:**
- `onSearch`: (value: string) => void
- `onClear`: () => void
- `loading`: boolean
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `showClearButton`: boolean
- + 모든 HTML input props

### SearchBar

```tsx
// 기본 사용
<SearchBar
  placeholder="검색하세요..."
  onSearch={(value) => handleSearch(value)}
/>

// 자동완성 제안
const suggestions = [
  { id: '1', text: 'Siel서버', type: 'trending', metadata: '인기' },
  { id: '2', text: 'TestChar', type: 'suggestion', metadata: '캐릭터' },
];

<SearchBar
  suggestions={suggestions}
  onSearch={handleSearch}
  onSuggestionClick={(suggestion) => console.log(suggestion)}
/>

// 최근 검색어
<SearchBar
  showRecentSearches
  maxRecentSearches={5}
  onSearch={handleSearch}
/>

// 외부 최근 검색어 관리
<SearchBar
  recentSearches={myRecentSearches}
  onSearch={handleSearch}
/>

// 로딩 상태
<SearchBar
  loading={true}
  onSearch={handleSearch}
/>

// 전체 너비
<SearchBar fullWidth />
```

**Props:**
- `placeholder`: string
- `suggestions`: SearchSuggestion[]
- `recentSearches`: string[]
- `onSearch`: (value: string) => void
- `onSuggestionClick`: (suggestion: SearchSuggestion) => void
- `loading`: boolean
- `showRecentSearches`: boolean
- `maxRecentSearches`: number
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `autoFocus`: boolean

**SearchSuggestion Type:**
```tsx
interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'trending' | 'suggestion';
  metadata?: string;
}
```

### Grid

```tsx
// 3열 그리드
<Grid columns={3} gap="4">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</Grid>

// 자동 배치
<Grid columns="auto" gap="6">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</Grid>

// 반응형 (모바일에서는 자동으로 1열)
<Grid columns={4} gap="4">
  {/* 데스크탑: 4열, 모바일: 1열 */}
</Grid>
```

**Props:**
- `columns`: 1 | 2 | 3 | 4 | 'auto'
- `gap`: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10'

## 🎨 테마 사용

테마 값을 직접 사용하려면:

```tsx
import { theme } from '@/lib/theme';

const MyComponent = () => (
  <div style={{ color: theme.colors.brand.primary }}>
    커스텀 스타일
  </div>
);
```

## 📱 데모 페이지

모든 컴포넌트의 실제 예제를 보려면 `/components-demo` 페이지를 방문하세요.

```bash
npm run dev
# http://localhost:3000/components-demo
```

## 🔧 개발 가이드

### 새 컴포넌트 추가하기

1. `/src/components/ui/`에 새 컴포넌트 파일 생성
2. 테마를 import하고 styled-jsx 사용
3. TypeScript 타입 정의
4. `/src/components/ui/index.ts`에 export 추가
5. `/src/app/components-demo/page.tsx`에 데모 추가

### 컴포넌트 작성 예시

```tsx
import React from 'react';
import { theme } from '@/lib/theme';

export interface MyComponentProps {
  variant?: 'default' | 'custom';
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'default',
  children,
}) => {
  return (
    <div className={`my-component ${variant}`}>
      {children}
      <style jsx>{`
        .my-component {
          font-family: ${theme.typography.fontFamily.primary};
          color: ${theme.colors.text.primary};
        }

        .default {
          background: ${theme.colors.background.primary};
        }

        .custom {
          background: ${theme.colors.background.secondary};
        }
      `}</style>
    </div>
  );
};
```

## 🎯 디자인 원칙

1. **일관성**: 모든 컴포넌트는 테마 시스템을 사용
2. **재사용성**: Props를 통한 유연한 커스터마이징
3. **접근성**: 시맨틱 HTML과 적절한 ARIA 속성
4. **반응형**: 모바일 우선 디자인
5. **타입 안전성**: TypeScript로 완전한 타입 정의

## 📝 라이선스

이 컴포넌트 라이브러리는 dak.gg의 디자인을 기반으로 합니다.

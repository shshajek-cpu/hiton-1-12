# Supabase 백엔드 사용 가이드 (배포 완료)

**프로젝트 URL**: `https://mnbngmdjiszyowfvnzhk.supabase.co`  
**Anon Key (공개 키)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U`

## 1. 배포된 엣지 함수 (Edge Functions)
현재 다음 함수들이 배포되어 즉시 사용 가능합니다:

- **캐릭터 검색 (Search)**: `https://mnbngmdjiszyowfvnzhk.supabase.co/functions/v1/search-character`
- **상세 정보 조회 (Get Detail)**: `https://mnbngmdjiszyowfvnzhk.supabase.co/functions/v1/get-character`
- **강제 갱신 (Refresh)**: `https://mnbngmdjiszyowfvnzhk.supabase.co/functions/v1/refresh-character`

## 2. 클라이언트 사용 예시

아래 코드 스니펫을 프론트엔드 코드에 바로 복사하여 사용하거나 `curl`로 테스트해볼 수 있습니다.

### 캐릭터 검색
```typescript
const response = await fetch('https://mnbngmdjiszyowfvnzhk.supabase.co/functions/v1/search-character', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '츠렌',
    serverId: 1004 // 선택 사항
  })
})
const data = await response.json()
console.log(data);
```

### 캐릭터 상세 정보 조회 (캐싱 적용)
```typescript
const response = await fetch('https://mnbngmdjiszyowfvnzhk.supabase.co/functions/v1/get-character', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    characterId: 'eGhkY4tjR371y1Wzc1UXfBDcsAk64CDViVt-0EtjHGk=', // 예시 ID (검색 결과의 실제 ID 사용 필요)
    serverId: 1004
  })
})
const characterData = await response.json()
console.log(characterData);
```

### 캐릭터 정보 강제 갱신 (Refresh)
```typescript
const response = await fetch('https://mnbngmdjiszyowfvnzhk.supabase.co/functions/v1/refresh-character', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    characterId: 'eGhkY4tjR371y1Wzc1UXfBDcsAk64CDViVt-0EtjHGk=',
    serverId: 1004
  })
})
const freshData = await response.json()
console.log(freshData);
```

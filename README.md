# NETWORK — 업무 소통 플랫폼

## 기술 스택
- Vite + React 18 + React Router 6
- Supabase (PostgreSQL + Auth + RLS)
- Vercel 배포
- GitHub 소스 관리

## 구조
```
src/
├── main.jsx              ← 라우팅
├── lib/supabase.js       ← Supabase 클라이언트
├── contexts/AuthContext   ← 세션/프로필/권한
├── components/ProtectedRoute ← 접근 제어
├── pages/
│   ├── HomePage           ← / (랜딩)
│   ├── LoginPage          ← /login
│   ├── AppLayout          ← /app (사이드바)
│   ├── AppHome            ← /app (대시보드)
│   └── ChannelPage        ← /app/* (채널별)
└── styles/global.css
```

## 세팅 순서

### 1. Supabase
1. https://supabase.com → 새 프로젝트
2. SQL Editor → `supabase/001_initial_setup.sql` 실행
3. Authentication → Email 로그인 활성화
4. Users에서 관리자 계정 생성
5. profiles에 INSERT:
```sql
INSERT INTO public.profiles (user_id, org_id, role, name, phone)
VALUES (
  'auth-user-uuid',
  (SELECT id FROM public.orgs WHERE name = '본사' LIMIT 1),
  'hq_admin', '관리자', '010-xxxx-xxxx'
);
```

### 2. 로컬 개발
```bash
git clone https://github.com/your-repo/network-hub.git
cd network-hub
npm install
cp .env.example .env  # URL, KEY 입력
npm run dev
```

### 3. Vercel 배포
1. GitHub push
2. Vercel → Import → repo 선택
3. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## 라우팅
| 경로 | 접근 | 설명 |
|------|------|------|
| `/` | Public | 랜딩 |
| `/login` | Public | 로그인 |
| `/app` | Protected | 홈 |
| `/app/contracts` | Protected | 계약관리 |
| `/app/inventory` | Protected | 차량재고 |
| `/app/dispatch` | Protected | 출고현황 |
| `/app/incidents` | Protected | 사고접수 |
| `/app/claims` | Protected | 클레임 |
| `/app/notices` | Protected | 공지 |
| `/app/requests` | Protected | 요청/건의 |
| `/app/schedule` | Protected | 일정 |
| `/app/files` | Protected | 파일 |
| `/app/meetings` | Protected | 회의록 |

## 권한
| 역할 | 데이터 |
|------|--------|
| hq_admin | 전체 CRUD |
| hq_staff | 전체 읽기/수정 |
| agency | 자기 org만 |

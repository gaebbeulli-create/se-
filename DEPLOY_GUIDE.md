# 🚀 NETWORK 배포 가이드 (PC 없이, 웹에서만)

모든 작업을 **모바일/태블릿 브라우저**에서도 할 수 있습니다.

---

## STEP 1. GitHub 리포지토리 생성 + 파일 업로드

### 1-1. 리포 만들기
1. https://github.com 로그인
2. 우측 상단 **+** → **New repository**
3. Repository name: `network-hub` (원하는 이름)
4. **Private** 선택 (내부용이니까)
5. **Create repository** 클릭

### 1-2. 파일 업로드
1. 생성된 리포에서 **"uploading an existing file"** 링크 클릭
2. `network-project.zip` 압축 풀기
3. **teambro 폴더 안의 모든 파일/폴더**를 드래그&드롭:
   ```
   📂 드래그할 것들:
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── vercel.json
   ├── .env.example
   ├── .gitignore
   ├── README.md
   ├── src/          ← 폴더째로
   └── supabase/     ← 폴더째로
   ```
4. **⚠️ 주의**: `teambro/` 폴더 자체가 아니라, **그 안의 내용물**을 업로드
5. Commit message: "initial commit" → **Commit changes**

### 1-3. 폴더 업로드 안 될 때
GitHub 웹에서 폴더 드래그가 안 되면:
1. 리포 메인에서 **Add file** → **Upload files**
2. 파일을 하나씩 올림 (폴더 구조는 자동 생성됨)
3. 또는 **각 폴더별로 나눠서** 업로드:
   - `src/main.jsx` → **Add file** → **Create new file** → 경로에 `src/main.jsx` 입력 → 내용 붙여넣기

---

## STEP 2. Supabase 프로젝트 세팅

### 2-1. 프로젝트 생성
1. https://supabase.com 가입/로그인
2. **New Project** 클릭
3. 이름: `network` / 비밀번호 설정 / Region: `Northeast Asia (Seoul)` 선택
4. **Create new project** → 약 2분 대기

### 2-2. DB 테이블 생성
1. 좌측 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. `supabase/001_initial_setup.sql` 내용을 **전체 복사 → 붙여넣기**
4. **Run** 클릭 → ✅ Success 확인
5. 다시 **New query** → `supabase/002_storage_and_meetings.sql` 붙여넣기 → **Run**

### 2-3. Storage 버킷 확인
1. 좌측 메뉴 **Storage** 클릭
2. `attachments` 버킷이 생성되었는지 확인
3. 없으면: **New bucket** → 이름: `attachments` → **Public bucket** 체크 → Create

### 2-4. Auth 설정
1. 좌측 **Authentication** → **Providers**
2. **Email** 활성화 확인 (기본 ON)
3. **"Confirm email"** 을 **OFF**로 변경 (테스트 편의)

### 2-5. 첫 관리자 계정 생성
1. **Authentication** → **Users** → **Add user**
2. Email: `admin@your-domain.com` / Password 설정
3. **Create user** 클릭
4. 생성된 유저의 **UUID 복사** (User UID 열)
5. **SQL Editor**에서:
```sql
INSERT INTO public.profiles (user_id, org_id, role, name, phone)
VALUES (
  '여기에-UUID-붙여넣기',
  (SELECT id FROM public.orgs WHERE name = '본사' LIMIT 1),
  'hq_admin',
  '관리자',
  '010-xxxx-xxxx'
);
```
6. **Run** 클릭

### 2-6. API 키 확인
1. 좌측 **Settings** → **API**
2. 복사할 것:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGci...`

---

## STEP 3. Vercel 배포

### 3-1. Vercel 연결
1. https://vercel.com 가입 (GitHub 계정으로)
2. **Add New...** → **Project**
3. GitHub repo 목록에서 `network-hub` 선택 → **Import**

### 3-2. 설정
1. **Framework Preset**: `Vite` 자동 감지됨
2. **Environment Variables** 추가:
   - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGci...`
3. **Deploy** 클릭 → 약 1~2분

### 3-3. 완료!
- 배포된 URL: `https://network-hub.vercel.app` (자동 생성)
- 커스텀 도메인도 Vercel에서 설정 가능

---

## STEP 4. 추가 계정 생성 (SE글로벌 등)

1. Supabase → **Authentication** → **Users** → **Add user**
2. SQL Editor에서 profiles INSERT:
```sql
INSERT INTO public.profiles (user_id, org_id, role, name, phone)
VALUES (
  '새-유저-UUID',
  (SELECT id FROM public.orgs WHERE name = 'SE글로벌' LIMIT 1),
  'agency',
  '박매니저',
  '010-xxxx-xxxx'
);
```

---

## 이후 코드 수정할 때

1. GitHub 리포 → 수정할 파일 클릭
2. ✏️ (연필 아이콘) 클릭 → 수정
3. **Commit changes** → Vercel이 자동 재배포 (1~2분)

---

## 파일 구조 요약

```
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
├── supabase/
│   ├── 001_initial_setup.sql        ← DB 테이블 + RLS
│   └── 002_storage_and_meetings.sql ← Storage + 회의록
└── src/
    ├── main.jsx                     ← 라우팅
    ├── lib/
    │   ├── supabase.js              ← Supabase 클라이언트
    │   └── storage.js               ← 파일 업로드 유틸
    ├── contexts/
    │   └── AuthContext.jsx           ← 인증/권한
    ├── components/
    │   ├── ProtectedRoute.jsx       ← 접근 제어
    │   └── FileUploader.jsx         ← 이미지/파일 업로드 UI
    └── pages/
        ├── HomePage.jsx             ← / (랜딩)
        ├── LoginPage.jsx            ← /login
        ├── AppLayout.jsx            ← /app (사이드바)
        ├── AppHome.jsx              ← /app (대시보드)
        ├── ChannelPage.jsx          ← 9개 채널
        └── MeetingsPage.jsx         ← /app/meetings (회의록)
```

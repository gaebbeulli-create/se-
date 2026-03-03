-- ========================================
-- NETWORK 전체 테이블 생성 SQL
-- Supabase SQL Editor에서 실행하세요
-- ========================================

-- 1. 사용자
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  pw TEXT DEFAULT '1234',
  name TEXT NOT NULL,
  role TEXT DEFAULT '유저' CHECK (role IN ('관리자','유저')),
  org TEXT DEFAULT '본사',
  phone TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 계약관리
CREATE TABLE IF NOT EXISTS contracts (
  id BIGSERIAL PRIMARY KEY,
  no TEXT UNIQUE,
  nm TEXT NOT NULL,
  ph TEXT DEFAULT '',
  md TEXT DEFAULT '',
  vn TEXT DEFAULT '',
  s TEXT DEFAULT '',
  e TEXT DEFAULT '',
  fee BIGINT DEFAULT 0,
  dep BIGINT DEFAULT 0,
  up BIGINT DEFAULT 0,
  st TEXT DEFAULT '진행',
  loc TEXT DEFAULT '',
  memo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 차량재고
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGSERIAL PRIMARY KEY,
  vn TEXT UNIQUE,
  md TEXT DEFAULT '',
  st TEXT DEFAULT '가용',
  loc TEXT DEFAULT '',
  ck TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 출고현황
CREATE TABLE IF NOT EXISTS dispatches (
  id BIGSERIAL PRIMARY KEY,
  no TEXT UNIQUE,
  dt TEXT DEFAULT '',
  tg TEXT DEFAULT '',
  vh TEXT DEFAULT '',
  st TEXT DEFAULT '준비',
  memo TEXT DEFAULT '',
  imgs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 사고접수
CREATE TABLE IF NOT EXISTS incidents (
  id BIGSERIAL PRIMARY KEY,
  no TEXT UNIQUE,
  dt TEXT DEFAULT '',
  vn TEXT DEFAULT '',
  tp TEXT DEFAULT '',
  sv TEXT DEFAULT '보통',
  st TEXT DEFAULT '접수',
  co BIGINT DEFAULT 0,
  ins TEXT DEFAULT '',
  ds TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 클레임
CREATE TABLE IF NOT EXISTS claims (
  id BIGSERIAL PRIMARY KEY,
  no TEXT UNIQUE,
  ct TEXT DEFAULT '기타',
  cu TEXT DEFAULT '',
  pr TEXT DEFAULT '보통',
  st TEXT DEFAULT '접수',
  ds TEXT DEFAULT '',
  dt TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 공지사항
CREATE TABLE IF NOT EXISTS notices (
  id BIGSERIAL PRIMARY KEY,
  tt TEXT NOT NULL,
  bd TEXT DEFAULT '',
  au TEXT DEFAULT '',
  dt TEXT DEFAULT '',
  pn BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 요청/건의
CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  tt TEXT NOT NULL,
  bd TEXT DEFAULT '',
  au TEXT DEFAULT '',
  dt TEXT DEFAULT '',
  st TEXT DEFAULT '검토중',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. 회의록
CREATE TABLE IF NOT EXISTS meetings (
  id BIGSERIAL PRIMARY KEY,
  tt TEXT NOT NULL,
  dt TEXT DEFAULT '',
  lc TEXT DEFAULT '',
  at TEXT DEFAULT '',
  dc TEXT DEFAULT '',
  st TEXT DEFAULT '작성중',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. 일정
CREATE TABLE IF NOT EXISTS schedule (
  id BIGSERIAL PRIMARY KEY,
  tt TEXT NOT NULL,
  dt TEXT DEFAULT '',
  tp TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. 파일공유
CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  nm TEXT NOT NULL,
  tp TEXT DEFAULT '',
  sz TEXT DEFAULT '',
  au TEXT DEFAULT '',
  dt TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. 댓글
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  item_key TEXT NOT NULL,
  au TEXT DEFAULT '',
  txt TEXT DEFAULT '',
  dt TEXT DEFAULT '',
  ts TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. 이모지 리액션
CREATE TABLE IF NOT EXISTS reactions (
  id BIGSERIAL PRIMARY KEY,
  item_key TEXT NOT NULL,
  emoji TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(item_key, emoji, user_name)
);

-- ========================================
-- RLS (Row Level Security) 비활성화
-- 공개 접근 허용 (anon key 사용)
-- ========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 모든 테이블에 anon 접근 허용 정책
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON dispatches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON claims FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON notices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON reactions FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- 초기 데이터 삽입
-- ========================================

-- 기본 사용자
INSERT INTO users (email, pw, name, role, org, phone) VALUES
('admin@teambro.kr', '1234', '김대표', '관리자', '본사', '010-0000-0000'),
('se@seglobal.kr', '1234', '박매니저', '유저', 'SE글로벌', '010-1234-5678')
ON CONFLICT (email) DO NOTHING;

-- 샘플 계약
INSERT INTO contracts (no, nm, ph, md, vn, s, e, fee, dep, up, st, loc) VALUES
('CT-0001','홍길동','010-1111-2222','OK1 KS','대구1-1234','2026-01-15','2027-01-14',180000,200000,0,'진행','성서'),
('CT-0002','김철수','010-3333-4444','OK1 PRO','대구2-5678','2025-12-01','2026-11-30',220000,200000,660000,'연체','달서'),
('CT-0003','이영희','010-5555-6666','OK1 KS','대구3-9012','2026-02-01','2027-01-31',180000,200000,0,'진행','북구'),
('CT-0004','박민수','010-7777-8888','OK1 PRO','대구4-3456','2025-06-01','2026-05-31',220000,200000,0,'만료','수성'),
('CT-0005','정수연','010-9999-0000','OK1 KS','대구5-7890','2026-03-01','2027-02-28',180000,200000,0,'진행','성서')
ON CONFLICT (no) DO NOTHING;

-- 샘플 차량
INSERT INTO vehicles (vn, md, st, loc, ck) VALUES
('대구1-1234','OK1 KS','대여중','성서','2026-02-15'),
('대구2-5678','OK1 PRO','대여중','달서','2026-01-20'),
('대구3-9012','OK1 KS','대여중','북구','2026-02-28'),
('대구4-3456','OK1 PRO','가용','본사','2026-03-01'),
('대구5-7890','OK1 KS','대여중','성서','2026-02-20'),
('대구6-1111','OK1 KS','정비중','본사','2026-02-10'),
('대구7-2222','OK1 PRO','가용','본사','2026-03-02')
ON CONFLICT (vn) DO NOTHING;

-- 샘플 출고
INSERT INTO dispatches (no, dt, tg, vh, st, memo) VALUES
('DP-001','2026-03-03','SE글로벌 성서','OK1 KS 1대','출고완료','출고 시 외관 상태 양호, 배터리 100%'),
('DP-002','2026-03-05','SE글로벌 달서','OK1 PRO 2대','준비',''),
('DP-003','2026-02-28','SE글로벌 북구','OK1 KS 1대','출고완료','주행거리 확인 완료 (1,240km)')
ON CONFLICT (no) DO NOTHING;

-- 샘플 사고
INSERT INTO incidents (no, dt, vn, tp, sv, st, co, ins, ds) VALUES
('IC-001','2026-03-02','대구1-1234','대물','보통','보험진행',350000,'삼성화재','주차 중 접촉사고'),
('IC-002','2026-02-20','대구2-5678','단독','긴급','종결',1200000,'현대해상','빗길 전도 사고')
ON CONFLICT (no) DO NOTHING;

-- 샘플 클레임
INSERT INTO claims (no, ct, cu, pr, st, ds, dt) VALUES
('CL-001','정비','홍길동','보통','처리중','브레이크 소음','2026-03-01'),
('CL-002','요금','김철수','긴급','접수','연체 요금 이의','2026-03-02'),
('CL-003','CS','이영희','보통','해결','앱 로그인 문제','2026-02-25')
ON CONFLICT (no) DO NOTHING;

-- 샘플 공지
INSERT INTO notices (tt, bd, au, dt, pn) VALUES
('3월 입고 일정 안내','3월 10일 OK1 KS 5대, 3월 15일 OK1 PRO 3대 입고 예정입니다.','김대표','2026-03-03',true),
('OK1 KS 배터리 관련 협의','최근 배터리 이슈가 보고되고 있어 SE글로벌과 협의 진행 중입니다.','김대표','2026-03-02',false),
('2월 정산 완료 안내','2월 정산이 완료되었습니다.','김대표','2026-03-01',false);

-- 샘플 요청
INSERT INTO requests (tt, bd, au, dt, st) VALUES
('성서지점 추가 차량 요청','3월 중 OK1 KS 2대 추가 배정 요청드립니다.','박매니저','2026-03-02','검토중'),
('정비 일정 조율 건의','월 2회 정기 점검으로 변경 건의합니다.','박매니저','2026-02-28','승인');

-- 샘플 회의록
INSERT INTO meetings (tt, dt, lc, at, dc, st) VALUES
('3월 정기 운영 회의','2026-03-03','본사 회의실','김대표, 박매니저, 이과장','OK1 KS 추가 입고 5대 확정\n연체 회수 절차 강화','확정'),
('차량 정비 일정 협의','2026-02-28','온라인','김대표, 정비팀장','매월 1회 전 차량 점검\n체크리스트 표준화','공유완료');

-- 샘플 일정
INSERT INTO schedule (tt, dt, tp) VALUES
('OK1 KS 5대 입고','2026-03-10','입고'),
('OK1 PRO 3대 입고','2026-03-15','입고'),
('전 차량 정기점검','2026-03-20','정비'),
('4월 정기 운영 회의','2026-04-01','회의');

-- 샘플 파일
INSERT INTO files (nm, tp, sz, au, dt) VALUES
('2월_정산서_성서.xlsx','xlsx','245KB','김대표','2026-03-01'),
('OK1_KS_점검체크리스트.pdf','pdf','128KB','박매니저','2026-02-28'),
('렌탈계약서_양식_v3.docx','docx','89KB','김대표','2026-02-15');

-- ========================================
-- 완료! 
-- ========================================
SELECT 'Setup complete!' AS result;

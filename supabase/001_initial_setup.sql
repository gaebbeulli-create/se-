-- ═══════════════════════════════════════════════════════════
-- NETWORK — Supabase 초기 DB 세팅
-- Supabase SQL Editor에서 실행하세요.
-- ═══════════════════════════════════════════════════════════

-- 1. 조직
CREATE TABLE IF NOT EXISTS public.orgs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hq', 'agency')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 프로필
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  role TEXT NOT NULL CHECK (role IN ('hq_admin', 'hq_staff', 'agency')),
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "HQ admin can read all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'hq_admin'));
CREATE POLICY "Same org members can read each other" ON public.profiles FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Authenticated users can read orgs" ON public.orgs FOR SELECT USING (auth.uid() IS NOT NULL);

-- 4. 초기 org 데이터
INSERT INTO public.orgs (name, type) VALUES
  ('본사', 'hq'),
  ('SE글로벌', 'agency');

-- ═══════════════════════════════════════════════════════════
-- 유저 생성 후 profiles INSERT 예시:
-- ═══════════════════════════════════════════════════════════
/*
INSERT INTO public.profiles (user_id, org_id, role, name, phone) VALUES (
  'auth-user-uuid-here',
  (SELECT id FROM public.orgs WHERE name = '본사' LIMIT 1),
  'hq_admin', '관리자', '010-xxxx-xxxx'
);
*/

-- ═══════════════════════════════════════════════════════════
-- 업무 데이터 테이블
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  contract_no TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  vehicle_model TEXT NOT NULL,
  vehicle_no TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  rental_fee INTEGER NOT NULL DEFAULT 0,
  cost_price INTEGER DEFAULT 0,
  billing_amount INTEGER DEFAULT 0,
  deposit INTEGER DEFAULT 0,
  unpaid INTEGER DEFAULT 0,
  insurance BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT '진행' CHECK (status IN ('진행','만료','해지','연체','회수중','사고정지')),
  manager TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  vehicle_no TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '가용' CHECK (status IN ('가용','대여중','정비중','연체회수','폐기')),
  location TEXT,
  contract_id UUID REFERENCES public.contracts(id),
  last_check DATE,
  badge TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dispatches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  dispatch_no TEXT NOT NULL UNIQUE,
  dispatch_date DATE NOT NULL,
  target_org_id UUID REFERENCES public.orgs(id),
  vehicles_desc TEXT,
  status TEXT NOT NULL DEFAULT '준비' CHECK (status IN ('준비','출고완료','취소','회수')),
  manager TEXT,
  checklist JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  incident_no TEXT NOT NULL UNIQUE,
  incident_at TIMESTAMPTZ NOT NULL,
  vehicle_no TEXT,
  contract_id UUID REFERENCES public.contracts(id),
  type TEXT CHECK (type IN ('대물','대인','단독','도난','파손')),
  severity TEXT DEFAULT '보통' CHECK (severity IN ('긴급','보통')),
  status TEXT NOT NULL DEFAULT '접수' CHECK (status IN ('접수','조사','보험진행','종결')),
  estimated_cost INTEGER DEFAULT 0,
  confirmed_cost INTEGER DEFAULT 0,
  insurance_company TEXT,
  insurance_no TEXT,
  manager TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  claim_no TEXT NOT NULL UNIQUE,
  category TEXT CHECK (category IN ('요금','정비','CS','환불','응대','기타')),
  customer TEXT,
  priority TEXT DEFAULT '보통' CHECK (priority IN ('긴급','보통')),
  status TEXT NOT NULL DEFAULT '접수' CHECK (status IN ('접수','처리중','해결','반려')),
  sla_hours INTEGER DEFAULT 0,
  description TEXT,
  internal_memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  channel TEXT NOT NULL,
  parent_id UUID REFERENCES public.messages(id),
  ref_id UUID,
  sender_id UUID REFERENCES auth.users(id),
  title TEXT,
  body TEXT,
  status TEXT,
  priority TEXT,
  pinned BOOLEAN DEFAULT false,
  files JSONB DEFAULT '[]',
  reactions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for all tables
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Agency: own org only
CREATE POLICY "agency_contracts" ON public.contracts FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "agency_vehicles" ON public.vehicles FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "agency_dispatches" ON public.dispatches FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()) OR target_org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "agency_incidents" ON public.incidents FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "agency_claims" ON public.claims FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "agency_messages" ON public.messages FOR SELECT USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()) OR channel = 'notices');

-- HQ: all
CREATE POLICY "hq_contracts" ON public.contracts FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));
CREATE POLICY "hq_vehicles" ON public.vehicles FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));
CREATE POLICY "hq_dispatches" ON public.dispatches FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));
CREATE POLICY "hq_incidents" ON public.incidents FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));
CREATE POLICY "hq_claims" ON public.claims FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));
CREATE POLICY "hq_messages" ON public.messages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));

-- Users can insert messages
CREATE POLICY "users_insert_messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

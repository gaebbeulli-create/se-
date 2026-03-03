-- ═══════════════════════════════════════════════════════════
-- NETWORK — Supabase Storage 설정
-- SQL Editor에서 001 다음에 실행하세요.
-- ═══════════════════════════════════════════════════════════

-- 1. Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);

-- 2. 업로드 정책 — 로그인한 유저만 업로드
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments'
    AND auth.uid() IS NOT NULL
  );

-- 3. 읽기 정책 — public 버킷이므로 누구나 읽기
CREATE POLICY "Anyone can read attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'attachments');

-- 4. 삭제 정책 — 본인이 올린 파일 또는 HQ만
CREATE POLICY "Owner or HQ can delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'attachments'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('hq_admin', 'hq_staff')
      )
    )
  );

-- ═══════════════════════════════════════════════════════════
-- 회의록(meetings) 테이블
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id),
  title TEXT NOT NULL,                        -- 회의 제목
  meeting_date TIMESTAMPTZ NOT NULL,          -- 회의 일시
  location TEXT,                              -- 장소/온라인
  attendees TEXT[],                           -- 참석자 목록
  agenda TEXT,                                -- 안건
  content TEXT,                               -- 회의 내용
  decisions TEXT,                             -- 결정 사항
  action_items JSONB DEFAULT '[]',            -- [{task, assignee, deadline}]
  next_meeting TIMESTAMPTZ,                   -- 다음 회의
  files JSONB DEFAULT '[]',                   -- [{name, url, type, size}]
  status TEXT DEFAULT '작성중' CHECK (status IN ('작성중', '확정', '공유완료')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_meetings"
  ON public.meetings FOR SELECT
  USING (org_id = (SELECT org_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "hq_meetings"
  ON public.meetings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role IN ('hq_admin','hq_staff')));

CREATE POLICY "users_insert_meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- ============================================
-- pg_cron 확장 활성화
-- 이용권 자동 충전 시스템을 위한 Cron Job 기능
-- ============================================

-- pg_cron 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- postgres 역할에 cron 스키마 사용 권한 부여
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Settings 테이블 생성
-- 자동 재계산 설정 등 시스템 설정 저장용

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 설정값 삽입
INSERT INTO settings (key, value, updated_at) VALUES
    ('auto_recalc_enabled', 'false', NOW()),
    ('auto_recalc_interval', '"daily"', NOW()),
    ('auto_recalc_batch_size', '50', NOW()),
    ('auto_recalc_time', '"03:00"', NOW()),
    ('last_auto_recalc', 'null', NOW()),
    ('last_auto_recalc_count', '0', NOW()),
    ('cron_secret', '""', NOW())
ON CONFLICT (key) DO NOTHING;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);

-- RLS 정책 (선택적)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Settings are readable by all" ON settings
    FOR SELECT USING (true);

-- 서비스 역할만 쓰기 가능
CREATE POLICY "Settings are writable by service role" ON settings
    FOR ALL USING (auth.role() = 'service_role');

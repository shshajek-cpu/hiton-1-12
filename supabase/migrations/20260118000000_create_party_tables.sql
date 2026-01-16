-- =============================================
-- 파티찾기 시스템 테이블 생성
-- =============================================

-- 1. 파티 모집글 테이블 (party_posts)
CREATE TABLE IF NOT EXISTS party_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 작성자 정보
  user_id UUID NOT NULL REFERENCES ledger_users(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  character_class TEXT NOT NULL,
  character_server_id INTEGER NOT NULL,
  character_level INTEGER,
  character_item_level INTEGER,
  character_breakthrough INTEGER,
  character_combat_power INTEGER,

  -- 모집 정보
  title TEXT NOT NULL,
  description TEXT,
  dungeon_type TEXT NOT NULL CHECK (dungeon_type IN ('transcend', 'expedition', 'sanctuary', 'subjugation', 'pvp')),
  dungeon_id TEXT NOT NULL,
  dungeon_name TEXT NOT NULL,
  dungeon_tier INTEGER,

  -- 진행 방식
  is_immediate BOOLEAN DEFAULT false,
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  run_count INTEGER DEFAULT 1,

  -- 파티 설정
  max_members INTEGER DEFAULT 4 CHECK (max_members >= 2 AND max_members <= 12),
  join_type TEXT DEFAULT 'approval' CHECK (join_type IN ('approval', 'first_come')),

  -- 최소 스펙 조건
  min_item_level INTEGER,
  min_breakthrough INTEGER,
  min_combat_power INTEGER,

  -- 알림 설정
  notification_enabled BOOLEAN DEFAULT true,

  -- 상태
  status TEXT DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'full', 'in_progress', 'completed', 'cancelled')),

  -- 메타데이터
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_party_posts_status ON party_posts(status);
CREATE INDEX idx_party_posts_dungeon_type ON party_posts(dungeon_type);
CREATE INDEX idx_party_posts_is_immediate ON party_posts(is_immediate);
CREATE INDEX idx_party_posts_scheduled_date ON party_posts(scheduled_date);
CREATE INDEX idx_party_posts_user ON party_posts(user_id);
CREATE INDEX idx_party_posts_created ON party_posts(created_at DESC);

-- 2. 파티 슬롯 테이블 (party_slots)
CREATE TABLE IF NOT EXISTS party_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  party_id UUID NOT NULL REFERENCES party_posts(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 8),
  party_number INTEGER DEFAULT 1 CHECK (party_number IN (1, 2)),
  required_class TEXT,
  member_id UUID,
  status TEXT DEFAULT 'empty' CHECK (status IN ('empty', 'filled')),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(party_id, party_number, slot_number)
);

CREATE INDEX idx_party_slots_party ON party_slots(party_id);
CREATE INDEX idx_party_slots_status ON party_slots(status);

-- 3. 파티원 테이블 (party_members)
CREATE TABLE IF NOT EXISTS party_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  party_id UUID NOT NULL REFERENCES party_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ledger_users(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES party_slots(id) ON DELETE SET NULL,

  -- 캐릭터 정보
  character_name TEXT NOT NULL,
  character_class TEXT NOT NULL,
  character_server_id INTEGER NOT NULL,
  character_level INTEGER,
  character_item_level INTEGER,
  character_breakthrough INTEGER,
  character_combat_power INTEGER,
  character_equipment JSONB,
  character_stats JSONB,

  -- 역할
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),

  -- 신청 상태
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'kicked')),

  -- 신청 메시지
  apply_message TEXT,
  reject_reason TEXT,

  -- 메타데이터
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  UNIQUE(party_id, user_id)
);

CREATE INDEX idx_party_members_party ON party_members(party_id);
CREATE INDEX idx_party_members_user ON party_members(user_id);
CREATE INDEX idx_party_members_status ON party_members(status);

-- 4. 파티 댓글 테이블 (party_comments)
CREATE TABLE IF NOT EXISTS party_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  party_id UUID NOT NULL REFERENCES party_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ledger_users(id) ON DELETE CASCADE,

  -- 댓글 정보
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  character_name TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_party_comments_party ON party_comments(party_id);
CREATE INDEX idx_party_comments_created ON party_comments(created_at);

-- 5. 파티 알림 테이블 (party_notifications)
CREATE TABLE IF NOT EXISTS party_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  user_id UUID NOT NULL REFERENCES ledger_users(id) ON DELETE CASCADE,
  party_id UUID REFERENCES party_posts(id) ON DELETE CASCADE,

  -- 알림 정보
  type TEXT NOT NULL CHECK (type IN (
    'apply_received',
    'apply_approved',
    'apply_rejected',
    'party_full',
    'party_starting',
    'party_cancelled',
    'party_completed',
    'new_comment',
    'member_left',
    'member_kicked'
  )),

  -- 알림 내용
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,

  -- 상태
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_party_notifications_user ON party_notifications(user_id);
CREATE INDEX idx_party_notifications_unread ON party_notifications(user_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_party_notifications_created ON party_notifications(created_at DESC);

-- 6. 내 모집 캐릭터 테이블 (party_user_characters)
CREATE TABLE IF NOT EXISTS party_user_characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  user_id UUID NOT NULL REFERENCES ledger_users(id) ON DELETE CASCADE,

  -- 캐릭터 정보
  character_id TEXT,
  character_name TEXT NOT NULL,
  character_class TEXT NOT NULL,
  character_server_id INTEGER NOT NULL,
  character_level INTEGER,
  character_item_level INTEGER,
  character_breakthrough INTEGER,
  character_combat_power INTEGER,
  profile_image TEXT,

  -- 정렬 순서
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_party_user_characters_user ON party_user_characters(user_id);

-- 7. RLS 정책
ALTER TABLE party_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_user_characters ENABLE ROW LEVEL SECURITY;

-- Public access (device_id 기반 인증은 API 레벨에서 처리)
CREATE POLICY "Public access" ON party_posts FOR ALL USING (true);
CREATE POLICY "Public access" ON party_slots FOR ALL USING (true);
CREATE POLICY "Public access" ON party_members FOR ALL USING (true);
CREATE POLICY "Public access" ON party_comments FOR ALL USING (true);
CREATE POLICY "Public access" ON party_notifications FOR ALL USING (true);
CREATE POLICY "Public access" ON party_user_characters FOR ALL USING (true);

-- 8. Updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_party_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_party_posts_updated_at
  BEFORE UPDATE ON party_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_party_updated_at();

CREATE TRIGGER trigger_party_user_characters_updated_at
  BEFORE UPDATE ON party_user_characters
  FOR EACH ROW
  EXECUTE FUNCTION update_party_updated_at();

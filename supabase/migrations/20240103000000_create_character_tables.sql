-- 캐릭터 테이블
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id TEXT UNIQUE NOT NULL,
  server_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  level INTEGER,
  class_name TEXT,
  race_name TEXT,
  guild_name TEXT,
  combat_power INTEGER,
  profile_image TEXT,
  
  -- JSON 데이터
  profile JSONB,
  stats JSONB,
  titles JSONB,
  rankings JSONB,
  daevanion JSONB,
  equipment JSONB,
  skills JSONB,
  pet_wing JSONB,
  
  -- 메타데이터
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);
CREATE INDEX IF NOT EXISTS idx_characters_server ON characters(server_id);
CREATE INDEX IF NOT EXISTS idx_characters_combat_power ON characters(combat_power DESC);

-- 서버 목록 캐시 테이블
CREATE TABLE IF NOT EXISTS servers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  race_id INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 설정 (옵션)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능하도록 정책 설정 (필요시 수정)
CREATE POLICY "Public read access" ON characters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON servers FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON characters USING (true);
CREATE POLICY "Service role full access" ON servers USING (true);

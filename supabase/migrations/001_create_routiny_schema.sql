-- =============================================
-- Routiny Database Schema
-- =============================================

-- 1. users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  nickname TEXT DEFAULT '루티니 사용자',
  profile_image_url TEXT,
  toss_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. routine_templates
CREATE TABLE routine_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('care', 'health', 'daily')),
  sub_category TEXT CHECK (sub_category IN ('baby', 'pet', 'senior')),
  type TEXT NOT NULL CHECK (type IN ('individual', 'team')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  default_duration INTEGER NOT NULL DEFAULT 14,
  verification_type TEXT NOT NULL,
  verification_config JSONB NOT NULL DEFAULT '{}',
  emoji TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. rewards
CREATE TABLE rewards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  template_id TEXT REFERENCES routine_templates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. user_routines
CREATE TABLE user_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES routine_templates(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_days INTEGER NOT NULL,
  completed_days INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  notification_enabled BOOLEAN DEFAULT TRUE,
  notification_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. check_ins
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_routine_id UUID NOT NULL REFERENCES user_routines(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  verification_type TEXT NOT NULL,
  verification_data JSONB NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_routine_id, date)
);

-- 6. user_rewards
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_routine_id UUID NOT NULL REFERENCES user_routines(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL REFERENCES rewards(id),
  status TEXT NOT NULL DEFAULT 'LOCK',
  progress INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  shipping_info JSONB,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_routine_id)
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_routine_templates_category ON routine_templates(category);
CREATE INDEX idx_routine_templates_type ON routine_templates(type);
CREATE INDEX idx_user_routines_user_id ON user_routines(user_id);
CREATE INDEX idx_user_routines_status ON user_routines(status);
CREATE INDEX idx_check_ins_user_routine_id ON check_ins(user_routine_id);
CREATE INDEX idx_check_ins_date ON check_ins(date);
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);

-- =============================================
-- Updated_at trigger function
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_routine_templates_updated_at
  BEFORE UPDATE ON routine_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_routines_updated_at
  BEFORE UPDATE ON user_routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_rewards_updated_at
  BEFORE UPDATE ON user_rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Auto-update completed_days on check_in insert
-- =============================================
CREATE OR REPLACE FUNCTION update_completed_days()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_routines
  SET completed_days = (
    SELECT COUNT(*) FROM check_ins WHERE user_routine_id = NEW.user_routine_id
  )
  WHERE id = NEW.user_routine_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_in_update_completed_days
  AFTER INSERT ON check_ins
  FOR EACH ROW EXECUTE FUNCTION update_completed_days();

-- =============================================
-- RLS Policies
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- routine_templates: 모든 사용자 읽기 허용
CREATE POLICY "routine_templates_select_all" ON routine_templates
  FOR SELECT USING (true);

-- rewards: 모든 사용자 읽기 허용
CREATE POLICY "rewards_select_all" ON rewards
  FOR SELECT USING (true);

-- users: anon key로 접근 허용 (디바이스 ID 기반 MVP 인증)
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);

-- user_routines
CREATE POLICY "user_routines_select" ON user_routines FOR SELECT USING (true);
CREATE POLICY "user_routines_insert" ON user_routines FOR INSERT WITH CHECK (true);
CREATE POLICY "user_routines_update" ON user_routines FOR UPDATE USING (true);

-- check_ins
CREATE POLICY "check_ins_select" ON check_ins FOR SELECT USING (true);
CREATE POLICY "check_ins_insert" ON check_ins FOR INSERT WITH CHECK (true);

-- user_rewards
CREATE POLICY "user_rewards_select" ON user_rewards FOR SELECT USING (true);
CREATE POLICY "user_rewards_insert" ON user_rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "user_rewards_update" ON user_rewards FOR UPDATE USING (true);

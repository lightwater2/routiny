-- =============================================
-- 003: 루틴 템플릿 → 캠페인 모델 전환
-- =============================================

-- 1. campaigns 테이블 생성
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 불변 필드 (발행 후 수정 불가)
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_days INTEGER NOT NULL CHECK (target_days > 0),
  verification_type TEXT NOT NULL,
  verification_config JSONB NOT NULL DEFAULT '{}',
  achievement_rate INTEGER NOT NULL DEFAULT 90 CHECK (achievement_rate BETWEEN 1 AND 100),
  reward_name TEXT NOT NULL,
  reward_description TEXT NOT NULL DEFAULT '',
  reward_image_url TEXT,
  reward_category TEXT NOT NULL DEFAULT '',
  reward_brand TEXT,
  type TEXT NOT NULL CHECK (type IN ('individual', 'team')),

  -- 수정 가능 필드
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('care', 'health', 'daily')),
  sub_category TEXT CHECK (sub_category IN ('baby', 'pet', 'senior', NULL)),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  emoji TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,

  -- 메타
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'ended')),
  max_participants INTEGER,
  current_participants INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- 2. campaign_participations 테이블 생성 (user_routines 대체)
CREATE TABLE IF NOT EXISTS campaign_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  completed_days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'force_ended')),
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  notification_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, campaign_id)
);

-- 3. check_ins 테이블에 participation_id 컬럼 추가 (새 참조)
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS participation_id UUID REFERENCES campaign_participations(id) ON DELETE CASCADE;

-- 4. user_rewards 테이블에 participation_id 컬럼 추가
ALTER TABLE user_rewards ADD COLUMN IF NOT EXISTS participation_id UUID REFERENCES campaign_participations(id) ON DELETE CASCADE;

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_participations_user ON campaign_participations(user_id);
CREATE INDEX IF NOT EXISTS idx_participations_campaign ON campaign_participations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_participations_status ON campaign_participations(status);
CREATE INDEX IF NOT EXISTS idx_checkins_participation ON check_ins(participation_id);
CREATE INDEX IF NOT EXISTS idx_rewards_participation ON user_rewards(participation_id);

-- 6. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS participations_updated_at ON campaign_participations;
CREATE TRIGGER participations_updated_at
  BEFORE UPDATE ON campaign_participations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. 불변성 보장 트리거 (발행 후 핵심 필드 변경 차단)
CREATE OR REPLACE FUNCTION prevent_immutable_campaign_update()
RETURNS TRIGGER AS $$
BEGIN
  -- draft 상태에서는 모든 필드 수정 가능
  IF OLD.status = 'draft' THEN
    RETURN NEW;
  END IF;

  -- 발행 이후: 불변 필드 변경 차단
  IF NEW.start_date IS DISTINCT FROM OLD.start_date OR
     NEW.end_date IS DISTINCT FROM OLD.end_date OR
     NEW.target_days IS DISTINCT FROM OLD.target_days OR
     NEW.verification_type IS DISTINCT FROM OLD.verification_type OR
     NEW.verification_config::TEXT IS DISTINCT FROM OLD.verification_config::TEXT OR
     NEW.achievement_rate IS DISTINCT FROM OLD.achievement_rate OR
     NEW.reward_name IS DISTINCT FROM OLD.reward_name OR
     NEW.reward_description IS DISTINCT FROM OLD.reward_description OR
     NEW.reward_image_url IS DISTINCT FROM OLD.reward_image_url OR
     NEW.reward_category IS DISTINCT FROM OLD.reward_category OR
     NEW.reward_brand IS DISTINCT FROM OLD.reward_brand OR
     NEW.type IS DISTINCT FROM OLD.type THEN
    RAISE EXCEPTION 'Cannot modify immutable fields after campaign is published';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_immutable_campaign ON campaigns;
CREATE TRIGGER check_immutable_campaign
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION prevent_immutable_campaign_update();

-- 8. 캠페인 종료 시 참여자 강제 종료 트리거
CREATE OR REPLACE FUNCTION force_end_participations()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'ended' AND OLD.status != 'ended' THEN
    UPDATE campaign_participations
    SET status = 'force_ended', updated_at = now()
    WHERE campaign_id = NEW.id AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS campaign_end_participations ON campaigns;
CREATE TRIGGER campaign_end_participations
  AFTER UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION force_end_participations();

-- 9. 체크인 시 completed_days 자동 증가 트리거
CREATE OR REPLACE FUNCTION increment_completed_days()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE campaign_participations
  SET completed_days = completed_days + 1
  WHERE id = NEW.participation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS checkin_increment_days ON check_ins;
CREATE TRIGGER checkin_increment_days
  AFTER INSERT ON check_ins
  FOR EACH ROW
  WHEN (NEW.participation_id IS NOT NULL)
  EXECUTE FUNCTION increment_completed_days();

-- 10. 참여 시 current_participants 증가 트리거
CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE campaigns
    SET current_participants = current_participants + 1
    WHERE id = NEW.campaign_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE campaigns
    SET current_participants = current_participants - 1
    WHERE id = OLD.campaign_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS participation_count ON campaign_participations;
CREATE TRIGGER participation_count
  AFTER INSERT OR DELETE ON campaign_participations
  FOR EACH ROW EXECUTE FUNCTION update_participant_count();

-- 11. RLS 정책
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participations ENABLE ROW LEVEL SECURITY;

-- campaigns: 누구나 published/active 캠페인 조회 가능
CREATE POLICY campaigns_select ON campaigns FOR SELECT
  USING (status IN ('published', 'active') OR status = 'draft');

-- campaign_participations: 본인 참여만 조회/생성
CREATE POLICY participations_select ON campaign_participations FOR SELECT
  USING (user_id = auth.uid() OR true);

CREATE POLICY participations_insert ON campaign_participations FOR INSERT
  WITH CHECK (user_id = auth.uid() OR true);

CREATE POLICY participations_update ON campaign_participations FOR UPDATE
  USING (user_id = auth.uid() OR true);

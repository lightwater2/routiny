-- =============================================
-- Seed Data: 22 Routine Templates + 22 Rewards
-- =============================================

-- Individual Routines (11)
INSERT INTO routine_templates (id, title, description, category, sub_category, type, difficulty, default_duration, verification_type, verification_config, emoji) VALUES
('ind-care-baby-1', '아기 분유 텀 체크', '정해진 시간에 분유를 챙기고 텀을 기록해요', 'care', 'baby', 'individual', 'easy', 14, 'time_record', '{"placeholder":"분유 시간 기록","unit":"분"}', '🍼'),
('ind-care-baby-2', '아기 기저귀 텀 체크', '기저귀 교체 시간을 기록하고 규칙적인 케어를 해요', 'care', 'baby', 'individual', 'easy', 14, 'time_record', '{"placeholder":"기저귀 교체 시간","unit":"분"}', '👶'),
('ind-care-pet-1', '반려동물 산책하기', '반려동물과 함께 건강한 산책을 해요', 'care', 'pet', 'individual', 'medium', 14, 'counter_input', '{"placeholder":"산책 시간 입력","unit":"분","minValue":10,"maxValue":180}', '🐕'),
('ind-care-senior-1', '약 챙겨먹기', '매일 정해진 시간에 약을 챙겨 드세요', 'care', 'senior', 'individual', 'easy', 14, 'simple_check', '{}', '💊'),
('ind-health-1', '하루 5천보 걷기', '가벼운 산책으로 건강을 챙겨요', 'health', NULL, 'individual', 'easy', 14, 'counter_input', '{"placeholder":"걸음수 입력","unit":"보","minValue":5000,"maxValue":100000}', '🚶'),
('ind-health-2', '러닝하기 (주 3회)', '주 3회 러닝으로 심폐지구력을 키워요', 'health', NULL, 'individual', 'medium', 14, 'photo_upload', '{"placeholder":"러닝 기록 스크린샷 업로드","frequency":"weekly","weeklyTarget":3}', '🏃'),
('ind-health-3', '다이어트 (식단 관리)', '건강한 식단을 기록하고 관리해요', 'health', NULL, 'individual', 'hard', 14, 'photo_upload', '{"placeholder":"오늘의 식단 사진 업로드"}', '🥗'),
('ind-health-4', '하루 10분 스트레칭', '뭉친 근육을 풀고 유연성을 키워요', 'health', NULL, 'individual', 'easy', 14, 'simple_check', '{}', '🧘'),
('ind-daily-1', '하루에 한 번 칭찬하기', '매일 나 또는 주변 사람을 칭찬해요', 'daily', NULL, 'individual', 'easy', 14, 'text_input', '{"placeholder":"오늘의 칭찬을 적어주세요"}', '👏'),
('ind-daily-2', '하루 10분 일기 쓰기', '하루를 정리하며 마음을 다스려요', 'daily', NULL, 'individual', 'easy', 14, 'text_input', '{"placeholder":"오늘의 일기를 적어주세요"}', '📝'),
('ind-daily-3', '하루 1만원 이하로 쓰기', '절약 습관으로 저축을 늘려요', 'daily', NULL, 'individual', 'medium', 14, 'receipt_record', '{"placeholder":"오늘 사용한 금액","unit":"원","maxValue":10000}', '💰');

-- Team Routines (11)
INSERT INTO routine_templates (id, title, description, category, sub_category, type, difficulty, default_duration, verification_type, verification_config, emoji) VALUES
('team-care-pet-1', '반려동물 산책 함께하기', '함께 반려동물 산책을 하며 책임감을 나눠요', 'care', 'pet', 'team', 'medium', 14, 'photo_upload', '{"placeholder":"산책 인증 사진 업로드"}', '🐕‍🦺'),
('team-care-baby-1', '아기 수면 텀 기록', '함께 아기 수면 패턴을 기록하고 관리해요', 'care', 'baby', 'team', 'easy', 14, 'time_record', '{"placeholder":"수면 시작/종료 시간","unit":"분"}', '😴'),
('team-care-senior-1', '부모님과 통화하기', '매일 부모님께 안부 전화를 드려요', 'care', 'senior', 'team', 'easy', 14, 'simple_check', '{}', '📞'),
('team-health-1', '함께 러닝하기 (주 3회)', '팀원들과 함께 러닝하며 건강을 챙겨요', 'health', NULL, 'team', 'medium', 14, 'photo_upload', '{"placeholder":"러닝 인증 사진 업로드","frequency":"weekly","weeklyTarget":3}', '🏃‍♂️'),
('team-health-2', '홈트 같이 하기', '팀원들과 홈트레이닝을 함께해요', 'health', NULL, 'team', 'medium', 14, 'photo_upload', '{"placeholder":"홈트 인증 사진/영상 업로드"}', '💪'),
('team-health-3', '다이어트 식단 나누기', '서로의 식단을 공유하며 건강한 식습관을 만들어요', 'health', NULL, 'team', 'hard', 14, 'photo_upload', '{"placeholder":"오늘의 식단 사진 업로드"}', '🥗'),
('team-health-4', '아침 기상 인증하기', '팀원들과 함께 아침 기상을 인증해요', 'health', NULL, 'team', 'medium', 14, 'simple_check', '{}', '⏰'),
('team-daily-1', '칭찬 나누기', '매일 팀원을 칭찬하며 긍정 에너지를 나눠요', 'daily', NULL, 'team', 'easy', 14, 'text_input', '{"placeholder":"팀원에게 전하는 칭찬"}', '🌟'),
('team-daily-2', '함께 절약하기', '팀원들과 절약 목표를 공유하고 달성해요', 'daily', NULL, 'team', 'medium', 14, 'receipt_record', '{"placeholder":"오늘 사용한 금액","unit":"원","maxValue":10000}', '💵'),
('team-daily-3', '하루 한 문장 공유하기', '매일 인상 깊은 문장을 팀원들과 공유해요', 'daily', NULL, 'team', 'easy', 14, 'text_input', '{"placeholder":"오늘의 문장을 공유해주세요"}', '📖'),
('team-daily-4', '오늘 하루 목표 나누기', '매일 하루 목표를 팀원들과 공유하고 응원해요', 'daily', NULL, 'team', 'easy', 14, 'text_input', '{"placeholder":"오늘의 목표를 적어주세요"}', '🎯');

-- Rewards (22)
INSERT INTO rewards (id, name, description, image_url, category, brand, template_id) VALUES
('reward-baby-wipes', '프리미엄 아기 물티슈 세트', '민감한 아기 피부를 위한 저자극 프리미엄 물티슈', '/rewards/baby-wipes.jpg', '육아용품', '베이비케어', 'ind-care-baby-1'),
('reward-diapers', '프리미엄 기저귀 1박스', '부드럽고 흡수력 좋은 프리미엄 기저귀', '/rewards/diapers.jpg', '육아용품', '베이비케어', 'ind-care-baby-2'),
('reward-pet-snack', '프리미엄 반려동물 간식', '건강한 재료로 만든 수제 간식', '/rewards/pet-snack.jpg', '반려동물용품', '펫프렌즈', 'ind-care-pet-1'),
('reward-pill-case', '스마트 약 케이스', '요일별 칸막이가 있는 스마트 약 케이스', '/rewards/pill-case.jpg', '건강용품', '헬스케어', 'ind-care-senior-1'),
('reward-socks', '기능성 스포츠 양말', '통기성 좋은 프리미엄 스포츠 양말', '/rewards/socks.jpg', '스포츠용품', '공방 S', 'ind-health-1'),
('reward-towel', '프리미엄 스포츠 타월', '땀 흡수가 뛰어난 고급 스포츠 타월', '/rewards/towel.jpg', '스포츠용품', '스포티', 'ind-health-2'),
('reward-scale', '스마트 체중계', '체지방률까지 측정 가능한 스마트 체중계', '/rewards/scale.jpg', '건강용품', '헬스테크', 'ind-health-3'),
('reward-massage-ball', '마사지볼 세트', '근육 이완을 위한 프리미엄 마사지볼', '/rewards/massage-ball.jpg', '피트니스용품', '핏케어', 'ind-health-4'),
('reward-diary', '감사 다이어리', '매일 감사를 기록할 수 있는 프리미엄 다이어리', '/rewards/diary.jpg', '문구용품', '페이퍼랩', 'ind-daily-1'),
('reward-pen', '프리미엄 만년필', '부드러운 필기감의 고급 만년필', '/rewards/pen.jpg', '문구용품', '펜마스터', 'ind-daily-2'),
('reward-wallet', '미니 지갑', '심플한 디자인의 프리미엄 미니 지갑', '/rewards/wallet.jpg', '패션소품', '레더웍스', 'ind-daily-3'),
('reward-pet-leash', '프리미엄 반려동물 리드줄', '편안하고 안전한 고급 리드줄', '/rewards/pet-leash.jpg', '반려동물용품', '펫프렌즈', 'team-care-pet-1'),
('reward-baby-blanket', '오가닉 아기 담요', '순면 100% 유기농 아기 담요', '/rewards/baby-blanket.jpg', '육아용품', '베이비케어', 'team-care-baby-1'),
('reward-phone-stand', '프리미엄 폰 스탠드', '영상통화에 편리한 고급 폰 스탠드', '/rewards/phone-stand.jpg', '생활용품', '테크라이프', 'team-care-senior-1'),
('reward-running-belt', '러닝 벨트', '스마트폰 수납 가능한 러닝 벨트', '/rewards/running-belt.jpg', '스포츠용품', '스포티', 'team-health-1'),
('reward-yoga-mat', '프리미엄 요가 매트', '미끄럼 방지 프리미엄 요가 매트', '/rewards/yoga-mat.jpg', '피트니스용품', '핏케어', 'team-health-2'),
('reward-meal-container', '밀프렙 용기 세트', '전자레인지 사용 가능한 고급 밀프렙 용기', '/rewards/meal-container.jpg', '주방용품', '키친웨어', 'team-health-3'),
('reward-alarm-clock', '무드등 알람시계', '자연 기상을 도와주는 무드등 알람시계', '/rewards/alarm-clock.jpg', '생활용품', '라이프스타일', 'team-health-4'),
('reward-card-set', '감사 카드 세트', '마음을 전하는 프리미엄 감사 카드', '/rewards/card-set.jpg', '문구용품', '페이퍼랩', 'team-daily-1'),
('reward-piggy-bank', '스마트 저금통', '적립 금액을 자동 계산하는 스마트 저금통', '/rewards/piggy-bank.jpg', '생활용품', '핀테크', 'team-daily-2'),
('reward-bookmark', '가죽 북마크 세트', '고급 가죽으로 만든 프리미엄 북마크', '/rewards/bookmark.jpg', '문구용품', '레더웍스', 'team-daily-3'),
('reward-planner', '위클리 플래너', '목표 달성을 도와주는 위클리 플래너', '/rewards/planner.jpg', '문구용품', '페이퍼랩', 'team-daily-4');

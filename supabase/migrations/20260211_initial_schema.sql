-- ============================================================
-- GLOBAL TECH SUITE — Full Database Schema
-- ============================================================

-- ─── SHARED: User Profiles ───
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── SHARED: App Settings ───
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, app_name)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own settings" ON app_settings FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 1. MINDSWIPE
-- ============================================================
CREATE TABLE IF NOT EXISTS mindswipe_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT,
  city TEXT,
  job TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  values TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  compatibility_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mindswipe_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_profile_id UUID REFERENCES mindswipe_profiles(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('like', 'dislike', 'super')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mindswipe_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unmatched'))
);

CREATE TABLE IF NOT EXISTS mindswipe_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES mindswipe_matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE mindswipe_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindswipe_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindswipe_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindswipe_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mindswipe_profiles_public" ON mindswipe_profiles FOR SELECT USING (true);
CREATE POLICY "mindswipe_profiles_own" ON mindswipe_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "mindswipe_swipes_own" ON mindswipe_swipes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "mindswipe_matches_own" ON mindswipe_matches FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "mindswipe_messages_own" ON mindswipe_messages FOR ALL USING (auth.uid() = sender_id);

-- ============================================================
-- 2. TAPME!
-- ============================================================
CREATE TABLE IF NOT EXISTS tapme_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  mode TEXT DEFAULT 'classica' CHECK (mode IN ('classica', 'tempo', 'precisione', 'zen')),
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tapme_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenger_score INT DEFAULT 0,
  opponent_score INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tapme_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE tapme_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tapme_scores_public" ON tapme_scores FOR SELECT USING (true);
CREATE POLICY "tapme_scores_own" ON tapme_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tapme_challenges_own" ON tapme_challenges FOR ALL USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- ============================================================
-- 3. REAFACE
-- ============================================================
CREATE TABLE IF NOT EXISTS reaface_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  emotions JSONB DEFAULT '{}',
  dominant_emotion TEXT,
  confidence FLOAT DEFAULT 0,
  ai_insights TEXT[] DEFAULT '{}',
  privacy_mode TEXT DEFAULT 'standard' CHECK (privacy_mode IN ('standard', 'anonimo', 'ricerca')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reaface_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reaface_scans_own" ON reaface_scans FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 4. SHH
-- ============================================================
CREATE TABLE IF NOT EXISTS shh_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  encryption_type TEXT DEFAULT 'AES-256',
  destruct_timer TEXT DEFAULT '24 ore',
  screenshot_blocked BOOLEAN DEFAULT true,
  read_receipts BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS shh_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES shh_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS shh_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES shh_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  self_destruct_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shh_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shh_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE shh_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shh_conv_own" ON shh_conversations FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "shh_part_own" ON shh_participants FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "shh_msg_own" ON shh_messages FOR ALL USING (auth.uid() = sender_id);

-- ============================================================
-- 5. GLITCHLIFE
-- ============================================================
CREATE TABLE IF NOT EXISTS glitchlife_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  style TEXT,
  emoji TEXT,
  tags TEXT[] DEFAULT '{}',
  likes INT DEFAULT 0,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pubblicata' CHECK (status IN ('pubblicata', 'bozza', 'in_revisione', 'rimossa')),
  filter_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS glitchlife_creations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES glitchlife_experiences(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  filter_name TEXT,
  status TEXT DEFAULT 'bozza' CHECK (status IN ('pubblicata', 'bozza', 'in_revisione')),
  downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE glitchlife_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE glitchlife_creations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "glitchlife_exp_public" ON glitchlife_experiences FOR SELECT USING (true);
CREATE POLICY "glitchlife_exp_own" ON glitchlife_experiences FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "glitchlife_cre_own" ON glitchlife_creations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 6. WHOAREU
-- ============================================================
CREATE TABLE IF NOT EXISTS whoareu_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS whoareu_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES whoareu_quizzes(id) ON DELETE CASCADE,
  personality_type TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  traits JSONB DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  growth_areas TEXT[] DEFAULT '{}',
  compatibility JSONB DEFAULT '{}',
  rarity_percent FLOAT DEFAULT 0,
  insights JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE whoareu_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE whoareu_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "whoareu_quizzes_own" ON whoareu_quizzes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "whoareu_results_own" ON whoareu_results FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 7. LIFELINK
-- ============================================================
CREATE TABLE IF NOT EXISTS lifelink_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  rating FLOAT DEFAULT 0,
  reviews_count INT DEFAULT 0,
  price_per_hour NUMERIC(10,2),
  city TEXT,
  verified BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lifelink_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES lifelink_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  duration_minutes INT DEFAULT 60,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lifelink_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES lifelink_providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES lifelink_services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'confermato' CHECK (status IN ('confermato', 'in_attesa', 'completato', 'cancellato')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lifelink_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES lifelink_providers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES lifelink_bookings(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lifelink_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES lifelink_bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lifelink_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifelink_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifelink_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifelink_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifelink_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lifelink_providers_public" ON lifelink_providers FOR SELECT USING (true);
CREATE POLICY "lifelink_services_public" ON lifelink_services FOR SELECT USING (true);
CREATE POLICY "lifelink_bookings_own" ON lifelink_bookings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "lifelink_reviews_public" ON lifelink_reviews FOR SELECT USING (true);
CREATE POLICY "lifelink_reviews_own" ON lifelink_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lifelink_chat_own" ON lifelink_chat_messages FOR ALL USING (auth.uid() = sender_id);

-- ============================================================
-- 8. MENTE SERENA
-- ============================================================
CREATE TABLE IF NOT EXISTS menteserena_mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_value INT CHECK (mood_value BETWEEN 1 AND 5),
  note TEXT,
  tags TEXT[] DEFAULT '{}',
  energy INT CHECK (energy BETWEEN 1 AND 10),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menteserena_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menteserena_breathing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  duration_seconds INT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE menteserena_mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE menteserena_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menteserena_breathing_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menteserena_mood_own" ON menteserena_mood_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "menteserena_chat_own" ON menteserena_chat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "menteserena_breath_own" ON menteserena_breathing_sessions FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 9. COMUNITÀ ATTIVA
-- ============================================================
CREATE TABLE IF NOT EXISTS comunita_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('aiuto', 'evento', 'iniziativa', 'raccolta', 'scambio')),
  title TEXT NOT NULL,
  description TEXT,
  zone TEXT,
  image_url TEXT,
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares INT DEFAULT 0,
  urgent BOOLEAN DEFAULT false,
  saved BOOLEAN DEFAULT false,
  joined_count INT DEFAULT 0,
  needed_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comunita_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES comunita_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comunita_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date DATE,
  time TEXT,
  category TEXT,
  participants_count INT DEFAULT 0,
  max_participants INT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comunita_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  members_count INT DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comunita_volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hours NUMERIC(5,1) DEFAULT 0,
  activity TEXT,
  date DATE DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comunita_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunita_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunita_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunita_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunita_volunteer_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comunita_posts_public" ON comunita_posts FOR SELECT USING (true);
CREATE POLICY "comunita_posts_own" ON comunita_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "comunita_comments_public" ON comunita_comments FOR SELECT USING (true);
CREATE POLICY "comunita_comments_own" ON comunita_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comunita_events_public" ON comunita_events FOR SELECT USING (true);
CREATE POLICY "comunita_events_own" ON comunita_events FOR ALL USING (auth.uid() = organizer_id);
CREATE POLICY "comunita_groups_public" ON comunita_groups FOR SELECT USING (true);
CREATE POLICY "comunita_volunteer_own" ON comunita_volunteer_hours FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 10. PA.ONE
-- ============================================================
CREATE TABLE IF NOT EXISTS paone_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT,
  category TEXT,
  status TEXT DEFAULT 'ricevuta' CHECK (status IN ('ricevuta', 'in_lavorazione', 'approvata', 'respinta', 'completata', 'sospesa')),
  priority TEXT DEFAULT 'normale' CHECK (priority IN ('urgente', 'alta', 'normale', 'bassa')),
  assigned_to TEXT,
  description TEXT,
  attachments_count INT DEFAULT 0,
  progress INT DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS paone_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES paone_practices(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS paone_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES paone_practices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE paone_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE paone_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE paone_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "paone_practices_own" ON paone_practices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "paone_history_public" ON paone_status_history FOR SELECT USING (true);
CREATE POLICY "paone_docs_own" ON paone_documents FOR ALL USING (auth.uid() = uploaded_by);

-- ============================================================
-- 11. DOCFACILE
-- ============================================================
CREATE TABLE IF NOT EXISTS docfacile_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  fields_count INT DEFAULT 0,
  uses_count INT DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  content_schema JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS docfacile_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES docfacile_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'bozza' CHECK (status IN ('bozza', 'completato', 'firmato', 'inviato', 'archiviato')),
  content JSONB DEFAULT '{}',
  file_url TEXT,
  pages INT DEFAULT 1,
  last_edit TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS docfacile_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES docfacile_documents(id) ON DELETE CASCADE,
  signer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  signature_url TEXT,
  signed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'rejected'))
);

ALTER TABLE docfacile_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE docfacile_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE docfacile_signatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docfacile_templates_public" ON docfacile_templates FOR SELECT USING (true);
CREATE POLICY "docfacile_docs_own" ON docfacile_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "docfacile_sigs_own" ON docfacile_signatures FOR ALL USING (auth.uid() = signer_id);

-- ============================================================
-- 12. INCLUSIONE BRIDGE
-- ============================================================
CREATE TABLE IF NOT EXISTS inclusione_delegates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  accessibility_score INT DEFAULT 0,
  active_cases INT DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inclusione_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  provider TEXT,
  accessibility_features TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  wait_time TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inclusione_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('visivo', 'uditivo', 'motorio', 'cognitivo', 'comunicazione')),
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inclusione_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT,
  score INT DEFAULT 0,
  findings JSONB DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inclusione_delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inclusione_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE inclusione_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE inclusione_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inclusione_delegates_public" ON inclusione_delegates FOR SELECT USING (true);
CREATE POLICY "inclusione_services_public" ON inclusione_services FOR SELECT USING (true);
CREATE POLICY "inclusione_tools_public" ON inclusione_tools FOR SELECT USING (true);
CREATE POLICY "inclusione_reports_own" ON inclusione_reports FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 13. CITTÀ VIVA
-- ============================================================
CREATE TABLE IF NOT EXISTS cittaviva_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Strade', 'Illuminazione', 'Rifiuti', 'Verde', 'Degrado', 'Traffico', 'Rumore', 'Altro')),
  status TEXT DEFAULT 'segnalato' CHECK (status IN ('segnalato', 'in_corso', 'risolto', 'respinto')),
  priority TEXT DEFAULT 'media' CHECK (priority IN ('urgente', 'alta', 'media', 'bassa')),
  zone TEXT,
  address TEXT,
  latitude FLOAT,
  longitude FLOAT,
  photos TEXT[] DEFAULT '{}',
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cittaviva_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES cittaviva_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cittaviva_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES cittaviva_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(report_id, user_id)
);

ALTER TABLE cittaviva_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE cittaviva_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cittaviva_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cittaviva_reports_public" ON cittaviva_reports FOR SELECT USING (true);
CREATE POLICY "cittaviva_reports_own" ON cittaviva_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "cittaviva_comments_public" ON cittaviva_comments FOR SELECT USING (true);
CREATE POLICY "cittaviva_comments_own" ON cittaviva_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cittaviva_votes_own" ON cittaviva_votes FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 14. ECOVITA
-- ============================================================
CREATE TABLE IF NOT EXISTS ecovita_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  points INT DEFAULT 0,
  xp INT DEFAULT 0,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('Facile', 'Media', 'Difficile', 'Estrema')),
  deadline DATE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecovita_user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES ecovita_missions(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, mission_id)
);

CREATE TABLE IF NOT EXISTS ecovita_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  category TEXT,
  requirement TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecovita_user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES ecovita_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS ecovita_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INT DEFAULT 0,
  level INT DEFAULT 1,
  trees_saved NUMERIC(5,1) DEFAULT 0,
  co2_saved NUMERIC(7,1) DEFAULT 0,
  streak_days INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ecovita_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecovita_user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecovita_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecovita_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecovita_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ecovita_missions_public" ON ecovita_missions FOR SELECT USING (true);
CREATE POLICY "ecovita_user_missions_own" ON ecovita_user_missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "ecovita_badges_public" ON ecovita_badges FOR SELECT USING (true);
CREATE POLICY "ecovita_user_badges_own" ON ecovita_user_badges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "ecovita_leaderboard_public" ON ecovita_leaderboard FOR SELECT USING (true);
CREATE POLICY "ecovita_leaderboard_own" ON ecovita_leaderboard FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 15. AI DEVSTUDIO
-- ============================================================
CREATE TABLE IF NOT EXISTS devstudio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT DEFAULT 'typescript',
  framework TEXT,
  description TEXT,
  file_tree JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devstudio_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES devstudio_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  generated_code TEXT,
  language TEXT,
  model TEXT DEFAULT 'gpt-4',
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE devstudio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE devstudio_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devstudio_projects_own" ON devstudio_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devstudio_generations_own" ON devstudio_generations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 16. SKYWORK
-- ============================================================
CREATE TABLE IF NOT EXISTS skywork_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  model TEXT DEFAULT 'GPT-4',
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'paused', 'error', 'completed')),
  tasks_completed INT DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  cost_total NUMERIC(10,2) DEFAULT 0,
  avatar TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skywork_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skywork_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES skywork_agents(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES skywork_workflows(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS skywork_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES skywork_agents(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'agent')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE skywork_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE skywork_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE skywork_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE skywork_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skywork_agents_own" ON skywork_agents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "skywork_workflows_own" ON skywork_workflows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "skywork_tasks_own" ON skywork_tasks FOR SELECT USING (
  agent_id IN (SELECT id FROM skywork_agents WHERE user_id = auth.uid())
);
CREATE POLICY "skywork_conversations_own" ON skywork_conversations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 17. AI MARKETING ENGINE
-- ============================================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pianificata' CHECK (status IN ('attiva', 'pianificata', 'completata', 'in_pausa')),
  channels TEXT[] DEFAULT '{}',
  budget NUMERIC(10,2) DEFAULT 0,
  spent NUMERIC(10,2) DEFAULT 0,
  conversions INT DEFAULT 0,
  ctr TEXT,
  roi TEXT,
  impressions TEXT,
  clicks TEXT,
  start_date DATE,
  end_date DATE,
  audience TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketing_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('email', 'social', 'ad', 'landing_page', 'blog')),
  title TEXT NOT NULL,
  content TEXT,
  ai_generated BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'bozza',
  performance JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketing_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend NUMERIC(10,2) DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "marketing_campaigns_own" ON marketing_campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "marketing_content_own" ON marketing_content FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "marketing_analytics_public" ON marketing_analytics FOR SELECT USING (
  campaign_id IN (SELECT id FROM marketing_campaigns WHERE user_id = auth.uid())
);

-- ============================================================
-- 18. CASA SMART
-- ============================================================
CREATE TABLE IF NOT EXISTS casasmart_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  temperature NUMERIC(4,1),
  humidity NUMERIC(4,1),
  lights_on BOOLEAN DEFAULT false,
  consumption_kwh NUMERIC(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS casasmart_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES casasmart_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('light', 'thermostat', 'camera', 'lock', 'speaker', 'sensor', 'appliance', 'fan')),
  status TEXT DEFAULT 'off' CHECK (status IN ('on', 'off', 'standby', 'error')),
  value JSONB DEFAULT '{}',
  brand TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS casasmart_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  actions JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT false,
  schedule TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS casasmart_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('time', 'sensor', 'geofence', 'device', 'manual')),
  trigger_config JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS casasmart_energy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES casasmart_rooms(id) ON DELETE SET NULL,
  kwh NUMERIC(6,2) DEFAULT 0,
  cost NUMERIC(6,2) DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  hour INT CHECK (hour BETWEEN 0 AND 23),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE casasmart_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE casasmart_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE casasmart_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE casasmart_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE casasmart_energy_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "casasmart_rooms_own" ON casasmart_rooms FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "casasmart_devices_own" ON casasmart_devices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "casasmart_scenes_own" ON casasmart_scenes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "casasmart_automations_own" ON casasmart_automations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "casasmart_energy_own" ON casasmart_energy_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 19. MOBILITÀ PLUS
-- ============================================================
CREATE TABLE IF NOT EXISTS mobilita_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Metro', 'Tram', 'Bus', 'Treno')),
  color TEXT,
  direction TEXT,
  frequency TEXT,
  status TEXT DEFAULT 'regolare' CHECK (status IN ('regolare', 'alto', 'critico', 'sospeso')),
  passengers_daily INT DEFAULT 0,
  avg_delay_min INT DEFAULT 0,
  load_percent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mobilita_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID REFERENCES mobilita_lines(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('ritardo', 'soppressione', 'deviazione', 'emergenza', 'manutenzione')),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS mobilita_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID REFERENCES mobilita_lines(id) ON DELETE CASCADE,
  predicted_load INT,
  predicted_delay INT,
  confidence FLOAT DEFAULT 0,
  prediction_for TIMESTAMPTZ,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE mobilita_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobilita_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobilita_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mobilita_lines_public" ON mobilita_lines FOR SELECT USING (true);
CREATE POLICY "mobilita_alerts_public" ON mobilita_alerts FOR SELECT USING (true);
CREATE POLICY "mobilita_predictions_public" ON mobilita_predictions FOR SELECT USING (true);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_mindswipe_swipes_user ON mindswipe_swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_tapme_scores_user ON tapme_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_reaface_scans_user ON reaface_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_shh_messages_conv ON shh_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_glitchlife_exp_creator ON glitchlife_experiences(creator_id);
CREATE INDEX IF NOT EXISTS idx_whoareu_results_user ON whoareu_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lifelink_bookings_user ON lifelink_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_menteserena_mood_user ON menteserena_mood_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_comunita_posts_type ON comunita_posts(type);
CREATE INDEX IF NOT EXISTS idx_paone_practices_user ON paone_practices(user_id);
CREATE INDEX IF NOT EXISTS idx_paone_practices_status ON paone_practices(status);
CREATE INDEX IF NOT EXISTS idx_docfacile_docs_user ON docfacile_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_cittaviva_reports_status ON cittaviva_reports(status);
CREATE INDEX IF NOT EXISTS idx_cittaviva_reports_zone ON cittaviva_reports(zone);
CREATE INDEX IF NOT EXISTS idx_ecovita_user_missions_user ON ecovita_user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_ecovita_leaderboard_points ON ecovita_leaderboard(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_devstudio_projects_user ON devstudio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_skywork_agents_user ON skywork_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_user ON marketing_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_casasmart_rooms_user ON casasmart_rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_casasmart_devices_room ON casasmart_devices(room_id);
CREATE INDEX IF NOT EXISTS idx_mobilita_alerts_line ON mobilita_alerts(line_id, active);

-- ============================================================
-- FUNCTIONS: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER paone_practices_updated_at BEFORE UPDATE ON paone_practices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER devstudio_projects_updated_at BEFORE UPDATE ON devstudio_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

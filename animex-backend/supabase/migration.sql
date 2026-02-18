-- AnimeX Database Schema (Idempotent - safe to re-run)
-- Run this in your Supabase SQL editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(20) UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  country VARCHAR(5) DEFAULT 'LK',
  language VARCHAR(5) DEFAULT 'en',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================
-- ANIME
-- =====================
CREATE TABLE IF NOT EXISTS anime (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en VARCHAR(255) NOT NULL,
  title_si VARCHAR(255) DEFAULT '',
  title_ta VARCHAR(255) DEFAULT '',
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  poster_url TEXT DEFAULT '',
  banner_url TEXT DEFAULT '',
  trailer_url TEXT DEFAULT '',
  genre TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  age_rating VARCHAR(10) DEFAULT 'PG',
  release_year INT,
  total_episodes INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'upcoming')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE anime ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anime is viewable by everyone" ON anime;
CREATE POLICY "Anime is viewable by everyone" ON anime FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage anime" ON anime;
CREATE POLICY "Only admins can manage anime" ON anime FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- =====================
-- EPISODES
-- =====================
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  episode_number INT NOT NULL,
  season_number INT DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  duration_seconds INT DEFAULT 0,
  subtitle_en_url TEXT DEFAULT '',
  subtitle_si_url TEXT DEFAULT '',
  subtitle_ta_url TEXT DEFAULT '',
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(anime_id, season_number, episode_number)
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Episodes are viewable by everyone" ON episodes;
CREATE POLICY "Episodes are viewable by everyone" ON episodes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage episodes" ON episodes;
CREATE POLICY "Only admins can manage episodes" ON episodes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- =====================
-- LIKES
-- =====================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes viewable by everyone" ON likes;
CREATE POLICY "Likes viewable by everyone" ON likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own likes" ON likes;
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- =====================
-- COMMENTS
-- =====================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 3 AND char_length(content) <= 500),
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comments viewable by everyone" ON comments;
CREATE POLICY "Comments viewable by everyone" ON comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can create comments" ON comments;
CREATE POLICY "Auth users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- =====================
-- WATCHLIST
-- =====================
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own watchlist" ON watchlist;
CREATE POLICY "Users can view own watchlist" ON watchlist FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own watchlist" ON watchlist;
CREATE POLICY "Users can manage own watchlist" ON watchlist FOR ALL USING (auth.uid() = user_id);

-- =====================
-- WATCH HISTORY
-- =====================
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  progress_seconds INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own history" ON watch_history;
CREATE POLICY "Users can view own history" ON watch_history FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own history" ON watch_history;
CREATE POLICY "Users can manage own history" ON watch_history FOR ALL USING (auth.uid() = user_id);

-- =====================
-- DOWNLOADS
-- =====================
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  quality VARCHAR(10) DEFAULT '720p',
  file_size_mb FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own downloads" ON downloads;
CREATE POLICY "Users can view own downloads" ON downloads FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own downloads" ON downloads;
CREATE POLICY "Users can manage own downloads" ON downloads FOR ALL USING (auth.uid() = user_id);

-- =====================
-- FEEDBACK
-- =====================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(100) DEFAULT 'Anonymous',
  email VARCHAR(255) DEFAULT '',
  subject VARCHAR(255) DEFAULT '',
  message TEXT NOT NULL CHECK (char_length(message) >= 20),
  type VARCHAR(20) DEFAULT 'general' CHECK (type IN ('general', 'bug', 'feature', 'compliment', 'content', 'other')),
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  screenshot_url TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'dismissed')),
  admin_reply TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can submit feedback" ON feedback;
CREATE POLICY "Users can submit feedback" ON feedback FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only admins can view feedback" ON feedback;
CREATE POLICY "Only admins can view feedback" ON feedback FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT DEFAULT '',
  type VARCHAR(20) DEFAULT 'system',
  link TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_anime_slug ON anime(slug);
CREATE INDEX IF NOT EXISTS idx_anime_genre ON anime USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_anime_status ON anime(status);
CREATE INDEX IF NOT EXISTS idx_anime_is_trending ON anime(is_trending);
CREATE INDEX IF NOT EXISTS idx_anime_is_featured ON anime(is_featured);
CREATE INDEX IF NOT EXISTS idx_episodes_anime_id ON episodes(anime_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_anime_id ON likes(anime_id);
CREATE INDEX IF NOT EXISTS idx_comments_anime_id ON comments(anime_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- =====================
-- FULL TEXT SEARCH
-- =====================
ALTER TABLE anime ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title_en, '') || ' ' || coalesce(description, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS idx_anime_fts ON anime USING GIN(fts);

-- =====================
-- AUTO-UPDATE TIMESTAMPS
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS anime_updated_at ON anime;
CREATE TRIGGER anime_updated_at BEFORE UPDATE ON anime FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS watch_history_updated_at ON watch_history;
CREATE TRIGGER watch_history_updated_at BEFORE UPDATE ON watch_history FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- PROFILE AUTO-CREATE ON SIGNUP
-- =====================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

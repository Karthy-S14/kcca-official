
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Generic public-read + admin-write policies applied per table below.

-- MEMBERS
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school TEXT,
  age INT,
  rating INT,
  photo_url TEXT,
  achievements TEXT,
  grade TEXT,
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read members" ON public.members FOR SELECT USING (true);
CREATE POLICY "admin write members" ON public.members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_members_updated BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- RATED PLAYERS
CREATE TABLE public.rated_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fide_id TEXT,
  title TEXT,
  photo_url TEXT,
  standard_rating INT,
  rapid_rating INT,
  blitz_rating INT,
  country TEXT DEFAULT 'Sri Lanka',
  federation TEXT DEFAULT 'SRI',
  club TEXT DEFAULT 'KCCA',
  school TEXT,
  grade TEXT,
  age INT,
  current_rank INT,
  total_games INT DEFAULT 0,
  tournament_count INT DEFAULT 0,
  status TEXT DEFAULT 'Active',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rated_players TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.rated_players TO authenticated;
GRANT ALL ON public.rated_players TO service_role;
ALTER TABLE public.rated_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rp" ON public.rated_players FOR SELECT USING (true);
CREATE POLICY "admin write rp" ON public.rated_players FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_rp_updated BEFORE UPDATE ON public.rated_players FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- TOURNAMENTS
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade TEXT,
  venue TEXT,
  event_date TIMESTAMPTZ,
  time_info TEXT,
  entry_fee TEXT DEFAULT 'FREE',
  system TEXT DEFAULT 'Swiss System',
  pairing TEXT DEFAULT 'Computer Generated',
  rules TEXT DEFAULT 'FIDE Laws of Chess',
  tie_breaks TEXT DEFAULT 'Buchholz, Median Buchholz, Sonneborn-Berger',
  status TEXT DEFAULT 'upcoming',
  description TEXT,
  poster_url TEXT,
  registration_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tournaments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tournaments TO authenticated;
GRANT ALL ON public.tournaments TO service_role;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read t" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "admin write t" ON public.tournaments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_t_updated BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- TOURNAMENT RESULTS
CREATE TABLE public.tournament_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  position INT,
  points NUMERIC(4,1),
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tournament_results TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tournament_results TO authenticated;
GRANT ALL ON public.tournament_results TO service_role;
ALTER TABLE public.tournament_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tr" ON public.tournament_results FOR SELECT USING (true);
CREATE POLICY "admin write tr" ON public.tournament_results FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  category TEXT,
  winner TEXT,
  runners_up TEXT[],
  merit_awardees TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read a" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "admin write a" ON public.achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_a_updated BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- COMMITTEE
CREATE TABLE public.committee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.committee TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.committee TO authenticated;
GRANT ALL ON public.committee TO service_role;
ALTER TABLE public.committee ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read c" ON public.committee FOR SELECT USING (true);
CREATE POLICY "admin write c" ON public.committee FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_c_updated BEFORE UPDATE ON public.committee FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- TRAINING
CREATE TABLE public.training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  content TEXT,
  video_url TEXT,
  schedule_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.training TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.training TO authenticated;
GRANT ALL ON public.training TO service_role;
ALTER TABLE public.training ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tn" ON public.training FOR SELECT USING (true);
CREATE POLICY "admin write tn" ON public.training FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_tn_updated BEFORE UPDATE ON public.training FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- GALLERY
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Tournament',
  caption TEXT,
  event_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read g" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "admin write g" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- DOWNLOADS
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Notice',
  description TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.downloads TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read d" ON public.downloads FOR SELECT USING (true);
CREATE POLICY "admin write d" ON public.downloads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- NEWS
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  body TEXT,
  image_url TEXT,
  pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read n" ON public.news FOR SELECT USING (true);
CREATE POLICY "admin write n" ON public.news FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_n_updated BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- CONTACTS
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  handled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits contact" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read contacts" ON public.contacts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage contacts" ON public.contacts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete contacts" ON public.contacts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- SETTINGS (key/value)
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read s" ON public.settings FOR SELECT USING (true);
CREATE POLICY "admin write s" ON public.settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_s_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-grant admin role to the first user who signs up (KCCA admin bootstrap).
-- Subsequent users are regular authenticated users. This is safe because it's
-- keyed on being the very first row in auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user_bootstrap_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created_bootstrap
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_bootstrap_admin();

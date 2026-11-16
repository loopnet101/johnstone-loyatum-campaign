CREATE TYPE public.app_role AS ENUM ('super_admin', 'editor');
CREATE TYPE public.activity_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_campaign_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_campaign_profile_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_campaign_profile();

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  caption text,
  is_published boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.wards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wards TO authenticated;
GRANT ALL ON public.wards TO service_role;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL DEFAULT 'Johnstone Loyatum',
  candidate_bio text NOT NULL DEFAULT '',
  campaign_slogan text NOT NULL DEFAULT 'Sauti ya wananchi. Kazi ya ukweli. Pokot South ni yetu!',
  candidate_photo_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  logo_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  contact_email text,
  whatsapp_number text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  election_date date,
  announcement_banner text,
  footer_text text NOT NULL DEFAULT '',
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'announcement',
  author_name text NOT NULL DEFAULT 'Campaign team',
  cover_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  seo_title text,
  seo_description text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_at timestamptz,
  location text NOT NULL DEFAULT '',
  ward_id uuid REFERENCES public.wards(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'community',
  status public.activity_status NOT NULL DEFAULT 'scheduled',
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified')),
  publication_status public.content_status NOT NULL DEFAULT 'draft',
  media_ids uuid[] NOT NULL DEFAULT '{}',
  source_notes text,
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT completed_activity_must_be_verified CHECK (status <> 'completed' OR verification_status = 'verified')
);
GRANT SELECT ON public.activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.agenda_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  proposed_actions text NOT NULL DEFAULT '',
  item_type text NOT NULL DEFAULT 'proposal' CHECK (item_type IN ('proposal', 'achievement')),
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified')),
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  source_notes text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT achievement_must_be_verified CHECK (item_type <> 'achievement' OR verification_status = 'verified')
);
GRANT SELECT ON public.agenda_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agenda_items TO authenticated;
GRANT ALL ON public.agenda_items TO service_role;
ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  contact text NOT NULL CHECK (char_length(contact) BETWEEN 5 AND 254),
  ward_id uuid REFERENCES public.wards(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('general', 'campaign_information', 'public_agenda', 'media', 'other')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
  consented_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX articles_status_published_at_idx ON public.articles (status, published_at DESC);
CREATE INDEX activities_publication_event_at_idx ON public.activities (publication_status, event_at DESC);
CREATE INDEX activities_ward_idx ON public.activities (ward_id);
CREATE INDEX agenda_items_publication_sort_idx ON public.agenda_items (is_published, sort_order);
CREATE INDEX enquiries_status_created_at_idx ON public.enquiries (status, created_at DESC);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

CREATE POLICY "Users can read own profile or super admins can read all" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can update own profile or super admins can update all" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can create profiles" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can read own role or super admins can read all" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Published media is public" ON public.media
  FOR SELECT TO anon, authenticated
  USING (is_published OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Editors manage media" ON public.media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Wards are public" ON public.wards
  FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Editors manage wards" ON public.wards
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Settings are public to read" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Super admins manage settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Published articles are public" ON public.articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Editors manage articles" ON public.articles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Verified published activities are public" ON public.activities
  FOR SELECT TO anon, authenticated
  USING (
    (publication_status = 'published' AND verification_status = 'verified')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'super_admin')
  );
CREATE POLICY "Editors manage activities" ON public.activities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Published agenda items are public" ON public.agenda_items
  FOR SELECT TO anon, authenticated
  USING (
    (is_published AND (item_type = 'proposal' OR verification_status = 'verified'))
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'super_admin')
  );
CREATE POLICY "Editors manage agenda items" ON public.agenda_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins manage enquiries" ON public.enquiries
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can read audit history" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE OR REPLACE FUNCTION public.log_campaign_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  before_row jsonb;
  after_row jsonb;
  record_id uuid;
  action_name text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    before_row := to_jsonb(OLD);
    record_id := OLD.id;
    action_name := 'delete';
  ELSIF TG_OP = 'UPDATE' THEN
    before_row := to_jsonb(OLD);
    after_row := to_jsonb(NEW);
    record_id := NEW.id;
    action_name := 'update';
  ELSE
    after_row := to_jsonb(NEW);
    record_id := NEW.id;
    action_name := 'create';
  END IF;

  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), action_name, TG_TABLE_NAME, record_id,
    jsonb_build_object('before', before_row, 'after', after_row));

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.log_campaign_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER audit_articles_changes AFTER INSERT OR UPDATE OR DELETE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
CREATE TRIGGER audit_activities_changes AFTER INSERT OR UPDATE OR DELETE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
CREATE TRIGGER audit_agenda_changes AFTER INSERT OR UPDATE OR DELETE ON public.agenda_items
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
CREATE TRIGGER audit_media_changes AFTER INSERT OR UPDATE OR DELETE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
CREATE TRIGGER audit_settings_changes AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
CREATE TRIGGER audit_enquiries_changes AFTER UPDATE OR DELETE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
CREATE TRIGGER audit_user_roles_changes AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_campaign_change();
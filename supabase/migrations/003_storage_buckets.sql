-- ============================================================================
-- Gym56 — Sprint 2B: Storage Buckets & Policies
--
-- Run this in the Supabase Dashboard SQL Editor after the tables migration.
-- ============================================================================

-- ── Helper: insert a bucket if it doesn't exist ─────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', FALSE, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('equipment-images', 'equipment-images', TRUE, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('exercise-media', 'exercise-media', TRUE, 524288000, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── avatars (Private — owner only) ─────────────────────────────────────────

CREATE POLICY "Users can view own avatar"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admin can manage all avatars
CREATE POLICY "Admins can manage avatars"
  ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND public.is_admin())
  WITH CHECK (bucket_id = 'avatars' AND public.is_admin());

-- ── equipment-images (Public read, admin write) ─────────────────────────────

CREATE POLICY "Anyone can view equipment images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'equipment-images');

CREATE POLICY "Admins can upload equipment images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'equipment-images' AND public.is_admin());

CREATE POLICY "Admins can update equipment images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'equipment-images' AND public.is_admin());

CREATE POLICY "Admins can delete equipment images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'equipment-images' AND public.is_admin());

-- ── exercise-media (Public read, admin write) ───────────────────────────────

CREATE POLICY "Anyone can view exercise media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exercise-media');

CREATE POLICY "Admins can upload exercise media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'exercise-media' AND public.is_admin());

CREATE POLICY "Admins can update exercise media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'exercise-media' AND public.is_admin());

CREATE POLICY "Admins can delete exercise media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'exercise-media' AND public.is_admin());

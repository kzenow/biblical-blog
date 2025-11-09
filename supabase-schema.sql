-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  featured_image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  featured_start TIMESTAMP WITH TIME ZONE,
  featured_end TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'archived')) DEFAULT 'draft',
  slug TEXT UNIQUE NOT NULL
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured_start ON blog_posts(featured_start);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured_end ON blog_posts(featured_end);
CREATE INDEX IF NOT EXISTS idx_media_files_blog_post ON media_files(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
-- Anyone can read published posts
CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR status = 'archived');

-- Authenticated users can view all posts (for admin)
CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Media files policies
-- Authenticated users can view all media
CREATE POLICY "Authenticated users can view media"
  ON media_files FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can delete their own media
CREATE POLICY "Users can delete own media"
  ON media_files FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Create storage bucket for blog media
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-media bucket
CREATE POLICY "Public can view blog media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-media');

CREATE POLICY "Users can update their own media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);

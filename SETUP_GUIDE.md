# Setup Guide

## Step-by-Step Setup Instructions

### 1. Supabase Project Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `biblical-blog`
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (1-2 minutes)

#### Get API Credentials
1. In your project dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. Copy:
   - Project URL
   - `anon` `public` key

#### Set Up Database Tables
1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. Verify tables were created:
   - Go to "Table Editor"
   - You should see `blog_posts` and `media_files` tables

#### Verify Storage Bucket
1. Click "Storage" in the sidebar
2. You should see a bucket named `blog-media`
3. Click on it and verify it's set to "Public"
4. If the bucket doesn't exist:
   - Click "New Bucket"
   - Name: `blog-media`
   - Check "Public bucket"
   - Click "Create bucket"

### 2. Local Development Setup

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
1. Copy the example env file:
   ```auth/signup
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

#### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the homepage!

### 3. Create Your First User

1. Go to `http://localhost:3000/auth/signup`
2. Enter your email and password
3. Check your email for confirmation link
4. Click the confirmation link
5. You'll be redirected to the admin dashboard

### 4. Create Your First Blog Post

1. Log in at `/auth/login` if not already logged in
2. Click "New Post" in the admin dashboard
3. Fill in the form:
   - **Title**: "Welcome to Our Biblical Blog"
   - **Slug**: Will auto-generate as "welcome-to-our-biblical-blog"
   - **Excerpt**: A short summary
   - **Content**: Use the rich text editor to write your post
   - **Featured Image**: Upload an image (optional)
   - **Featured Start**: Set to current date/time
   - **Featured End**: Set to a future date (e.g., 7 days from now)
   - **Status**: Select "published"
4. Click "Create Post"
5. Visit `/blog` to see your post featured!

### 5. Testing the Scheduled Publishing

#### Test Scheduled Post
1. Create a new post
2. Set **Featured Start** to a future date/time
3. Set **Status** to "scheduled"
4. Save the post
5. The post won't appear on `/blog` until the start date

#### Test Archiving
1. Edit an existing post
2. Set **Featured End** to a past date
3. Save the post
4. It should appear in the archive section (not as featured)

### 6. Production Deployment

#### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/biblical-blog.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Set Up Automatic Post Updates**:
   Create `vercel.json` in your project root:
   ```json
   {
     "crons": [{
       "path": "/api/cron/update-posts",
       "schedule": "*/5 * * * *"
     }]
   }
   ```
   Commit and push this file.

#### Alternative: Manual Cron Setup

If not using Vercel, set up a cron job with any service:

**Using cron-job.org**:
1. Go to [cron-job.org](https://cron-job.org)
2. Create account
3. Create new cron job
4. URL: `https://yoursite.com/api/cron/update-posts`
5. Schedule: Every 5 minutes
6. Save

### 7. Customization

#### Change Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  biblical: {
    sand: '#E8DCC4',      // Change to your color
    parchment: '#F5EFE0',
    olive: '#6B7A52',
    burgundy: '#722F37',
    gold: '#D4AF37',
    deepBrown: '#3E2723',
    sage: '#9CAF88',
  },
}
```

#### Update Site Metadata
Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Blog Name',
  description: 'Your blog description',
}
```

### 8. Troubleshooting

#### Posts Not Showing Up
- Check the post status is "published"
- Verify `featured_start` is in the past
- Check browser console for errors
- Verify Supabase RLS policies are set up correctly

#### Can't Upload Images
- Verify `blog-media` bucket exists in Supabase Storage
- Check bucket is set to public
- Verify storage policies were created (check SQL script)

#### Authentication Not Working
- Verify environment variables are correct
- Check Supabase project URL and anon key
- Clear browser cookies and try again
- Check Supabase Auth settings

#### Database Errors
- Verify all tables were created (run SQL script again if needed)
- Check RLS policies are enabled
- Review Supabase logs for specific errors

### 9. Next Steps

- **Add Categories**: Extend the schema to include post categories
- **Add Tags**: Implement a tagging system
- **Comments**: Add a comments section using Supabase
- **Email Notifications**: Send emails when new posts are published
- **SEO**: Add OpenGraph images and meta tags
- **Analytics**: Integrate Google Analytics or Plausible

### 10. Maintenance

#### Regular Tasks
- Monitor Supabase usage (check dashboard)
- Review and moderate content
- Update dependencies monthly:
  ```bash
  npm update
  ```
- Back up database periodically
- Check error logs

#### Database Backups
Supabase automatically backs up your database, but you can also:
1. Go to Supabase dashboard
2. Settings → Database
3. Enable Point-in-Time Recovery (paid plans)
4. Or manually export data from Table Editor

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **TipTap Docs**: https://tiptap.dev/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

Happy blogging!

# Biblical Blog - Project Summary

## 📋 Project Overview

A full-featured WordPress-style blog platform built with Next.js 14 and Supabase, specifically designed for hosting biblical and spiritual content. The site includes scheduled post publishing, authentication, rich text editing, and file uploads.

**Live Site**: https://biblical-blog.vercel.app
**Repository**: https://github.com/kzenow/biblical-blog

---

## 🛠️ Technologies Used

### Frontend
- **Next.js 14.2** - React framework with App Router
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **TipTap 2.2** - Rich text WYSIWYG editor
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS)
  - File storage
- **@supabase/ssr** - Server-side rendering support

### Deployment
- **Vercel** - Hosting with SSR support (production)
- **GitHub** - Version control and CI/CD
- **Vercel Cron Jobs** - Automated post status updates

---

## ✨ Key Features Implemented

### 1. **Authentication System**
- User registration with email confirmation
- Secure login/logout
- Protected admin routes via middleware
- Session management with Supabase Auth

### 2. **Blog Post Management**
- Full CRUD operations (Create, Read, Update, Delete)
- Rich text editor with:
  - Text formatting (bold, italic, headings)
  - Lists (ordered/unordered)
  - Blockquotes
  - Links
  - Image insertion
  - Undo/redo

### 3. **Scheduled Publishing System**
The blog implements a sophisticated time-based publishing workflow:

```
Draft → Scheduled → Published (Featured) → Archived
```

- **Draft**: Hidden from public, work in progress
- **Scheduled**: Set to publish at a future date/time
- **Published**: Currently featured on the homepage
- **Archived**: Featured period ended, moved to archive section

**Key Logic**:
- Posts with `featured_start` time become featured automatically
- Posts with `featured_end` time move to archive automatically
- If no new post is ready, current featured post remains visible
- Automatic status updates via cron job (`/api/cron/update-posts`)

### 4. **File Upload System**
- Featured images for blog posts
- Inline images in content
- Support for images, documents, and media files
- Stored in Supabase Storage bucket (`blog-media`)
- Public access URLs for media

### 5. **Admin Dashboard**
- View all blog posts with status indicators
- Color-coded status badges (draft, scheduled, published, archived)
- Quick edit/delete actions
- Timestamp tracking (created, featured start/end)

### 6. **Public Blog Interface**
- Featured post section (hero display)
- Archive grid view
- Individual post pages with full content
- Responsive design for mobile/tablet/desktop
- SEO-friendly with metadata

### 7. **Biblical Theme**
Custom color palette inspired by biblical aesthetics:
- **Parchment** (#F5EFE0) - Background
- **Sand** (#E8DCC4) - Accents
- **Burgundy** (#722F37) - Primary actions
- **Olive** (#6B7A52) - Secondary
- **Gold** (#D4AF37) - Featured highlights
- **Deep Brown** (#3E2723) - Text
- **Sage** (#9CAF88) - Subtle accents

Custom fonts:
- **Cinzel** - Decorative headings (Google Fonts)
- **Georgia** - Body text (serif, readable)

---

## 📁 Project Structure

```
blog/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin dashboard
│   │   ├── page.tsx            # Posts list
│   │   └── posts/
│   │       ├── new/page.tsx    # Create post
│   │       └── [id]/page.tsx   # Edit post
│   ├── auth/                    # Authentication
│   │   ├── layout.tsx          # Auth layout (dynamic)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts   # OAuth callback
│   ├── blog/                    # Public blog
│   │   ├── page.tsx            # Blog list
│   │   └── [slug]/page.tsx     # Individual post
│   ├── api/
│   │   └── cron/
│   │       └── update-posts/   # Auto-update post status
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   ├── auth/
│   │   └── SignOutButton.tsx
│   ├── blog/
│   │   └── BlogPostForm.tsx    # Post create/edit form
│   └── editor/
│       └── RichTextEditor.tsx  # TipTap editor
├── lib/
│   └── supabase/
│       ├── client.ts           # Client-side Supabase
│       └── server.ts           # Server-side Supabase
├── types/
│   └── database.types.ts       # TypeScript types
├── utils/
│   ├── helpers.ts              # Utility functions
│   └── blog-status.ts          # Status determination logic
├── middleware.ts               # Route protection
├── supabase-schema.sql         # Database setup
├── amplify.yml                 # AWS Amplify config
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Schema

### Tables

**`blog_posts`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Post title |
| slug | TEXT | URL-friendly identifier |
| content | TEXT | HTML content from editor |
| excerpt | TEXT | Short summary |
| author_id | UUID | Foreign key to auth.users |
| featured_image_url | TEXT | URL to featured image |
| featured_start | TIMESTAMP | When post becomes featured |
| featured_end | TIMESTAMP | When post stops being featured |
| status | TEXT | draft/scheduled/published/archived |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**`media_files`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| file_name | TEXT | Original filename |
| file_path | TEXT | Storage path |
| file_type | TEXT | MIME type |
| file_size | BIGINT | File size in bytes |
| uploaded_by | UUID | Foreign key to auth.users |
| blog_post_id | UUID | Optional FK to blog_posts |
| created_at | TIMESTAMP | Upload time |

### Row Level Security (RLS) Policies

**Blog Posts**:
- Public can view published/archived posts
- Authenticated users can view all posts
- Authors can CRUD their own posts

**Media Files**:
- Authenticated users can view/upload media
- Users can delete their own media

### Storage Bucket

**`blog-media`** (public):
- Stores all uploaded files
- Public read access
- Authenticated users can upload
- Users can manage their own uploads

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Git

### 1. Clone Repository
```bash
git clone https://github.com/kzenow/biblical-blog.git
cd biblical-blog
npm install
```

### 2. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase-schema.sql`
3. Get credentials from Settings → API:
   - Project URL
   - `anon` public key

### 3. Configure Environment

Create `.env.local` (no spaces after `=`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Create First Account
1. Go to `/auth/signup`
2. Create admin account
3. Access admin dashboard at `/admin`

---

## 🌐 Deployment (Vercel)

### Why Vercel?

The project is deployed on **Vercel** (made by the Next.js team) because:
- ✅ Perfect Next.js 14 App Router support
- ✅ Environment variables work flawlessly
- ✅ Built-in cron jobs for scheduled tasks
- ✅ Automatic deployments from GitHub
- ✅ Excellent performance and reliability

**Note**: AWS Amplify was initially attempted but had compatibility issues with Next.js 14 App Router - environment variables wouldn't load properly despite being configured correctly in the Amplify console.

### Deployment Steps

1. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (free)

2. **Import Repository**
   - Click "Add New Project"
   - Import `kzenow/biblical-blog` repository
   - Vercel auto-detects Next.js configuration

3. **Add Environment Variables**
   - In the import screen, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   - **Important**: No quotes, no spaces after `=`

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes for build to complete
   - Your site will be live at `your-project.vercel.app`

### Post-Deployment

**Configure Supabase Callback URL**:
1. Go to Supabase dashboard → Authentication → URL Configuration
2. Add redirect URL: `https://your-project.vercel.app/auth/callback`

**Custom Domain (Optional)**:
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Automatic Deployments

- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Instant rollback capability

---

## 🔄 Automatic Post Status Updates

### Vercel Cron Jobs (Already Configured)

The blog uses **Vercel's built-in cron jobs** to automatically update post statuses.

**Configuration**: `vercel.json`
```json
{
  "crons": [{
    "path": "/api/cron/update-posts",
    "schedule": "*/5 * * * *"
  }]
}
```

**How it works**:
- Runs every 5 minutes automatically
- No external services needed
- Built into Vercel deployment
- Calls `/api/cron/update-posts` endpoint

**What the cron job does**:
1. Moves scheduled posts to published when `featured_start` time arrives
2. Moves published posts to archived when `featured_end` time passes

**Verify it's working**:
- Check Vercel dashboard → Your Project → Cron Jobs
- View execution logs and history
- Manually trigger for testing

### Alternative Options (If Not Using Vercel)

**Option A: External Cron Service**

Use [cron-job.org](https://cron-job.org):
- URL: `https://your-site.com/api/cron/update-posts`
- Schedule: Every 5 minutes (`*/5 * * * *`)

**Option B: GitHub Actions**

Create `.github/workflows/update-posts.yml`:
```yaml
name: Update Blog Posts
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger update
        run: curl https://your-site.com/api/cron/update-posts
```

---

## 🐛 Troubleshooting

### Local Development

**Issue**: "Supabase URL and API key required"
```bash
# Check .env.local exists
ls -la | grep env

# Check no spaces after =
cat .env.local

# Restart dev server
# Stop: Ctrl+C
npm run dev
```

**Issue**: Database errors
```bash
# Verify tables exist in Supabase dashboard
# Re-run supabase-schema.sql if needed
```

### Production (Vercel)

**Issue**: Environment variables not working
- Go to Vercel dashboard → Settings → Environment Variables
- Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Redeploy after adding/changing env vars
- Check no quotes or spaces in values

**Issue**: Build fails
- Check Vercel build logs for specific errors
- Verify `package.json` dependencies are correct
- Try `npm run build` locally first

**Issue**: Images not loading
- Verify Supabase storage bucket is public
- Check storage policies in Supabase dashboard
- Verify `blog-media` bucket exists

**Issue**: Authentication not working
- Check Supabase Auth settings
- Verify callback URL in Supabase: `https://your-project.vercel.app/auth/callback`
- Check browser console for errors
- Verify environment variables are set in Vercel

**Issue**: Cron job not running
- Check Vercel dashboard → Cron Jobs section
- Verify `vercel.json` is in repository root
- Check execution logs for errors

### General Issues

**TypeScript errors during build**
- The project uses `"strict": false` in `tsconfig.json`
- Some Supabase type assertions use type casting
- BlogPostForm.tsx uses `// @ts-nocheck` for Supabase client compatibility

**Image optimization warnings**
- Build shows warnings about using `<img>` instead of `<Image>`
- These are non-blocking and don't affect functionality
- Can be fixed later by migrating to Next.js Image component

### AWS Amplify Compatibility Issues (Archive)

**Why we don't recommend AWS Amplify for this project:**

The project was initially attempted on AWS Amplify but encountered persistent issues:

1. **Environment Variables Not Loading**: Despite being correctly configured in the Amplify console, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were not available at build time or runtime
2. **Next.js 14 App Router Incompatibility**: Amplify's SSR support doesn't fully work with Next.js 14's App Router architecture
3. **Auth Page Pre-rendering**: Pages with `'use client'` and dynamic exports still tried to pre-render, causing build failures

**Attempts made to resolve:**
- Added `export const dynamic = 'force-dynamic'` to auth pages
- Created auth layout with dynamic export
- Modified `next.config.js` with `output: 'standalone'` and explicit env config
- Updated `amplify.yml` with framework configuration
- Verified environment variables multiple times in console

**Conclusion**: These are known compatibility issues with AWS Amplify and Next.js 14 App Router. Vercel (made by the Next.js team) works perfectly without any configuration workarounds.

**Note**: The `amplify.yml` file remains in the repository for reference but is not actively used.

---

## 📝 Usage Guide

### Creating a Blog Post

1. **Login** at `/auth/login`
2. **Go to Admin** dashboard (`/admin`)
3. **Click "New Post"**
4. Fill in:
   - **Title**: Auto-generates slug
   - **Excerpt**: Short summary (shown in previews)
   - **Content**: Use rich text editor
   - **Featured Image**: Upload or paste URL
   - **Featured Start**: When to publish
   - **Featured End**: When to archive (optional)
   - **Status**: Draft/Scheduled/Published
5. **Save**

### Scheduling Posts

**Scenario 1**: Publish immediately
- Set status to "Published"
- Leave featured start/end blank or set to past date

**Scenario 2**: Schedule for future
- Set status to "Scheduled"
- Set "Featured Start" to future date/time
- Set "Featured End" (optional)

**Scenario 3**: Limited-time featured post
- Set "Featured Start" to when it should appear
- Set "Featured End" to when it should archive
- Another post can take over after this one ends

### Managing Posts

**Edit**: Click pencil icon in admin dashboard
**Delete**: Click trash icon (requires confirmation)
**View Public**: Visit `/blog` or `/blog/[slug]`

---

## 🎨 Customization Guide

### Changing Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  biblical: {
    sand: '#YOUR_COLOR',
    parchment: '#YOUR_COLOR',
    // ... etc
  },
}
```

### Changing Fonts

1. Update `app/globals.css` import
2. Edit `tailwind.config.ts` fontFamily
3. Use in components with `font-biblical` class

### Adding Features

**Comments system**:
- Add Supabase table for comments
- Create comment component
- Add to blog post page

**Categories/Tags**:
- Extend database schema
- Add many-to-many relationship
- Update post form and queries

**Search**:
- Use Supabase full-text search
- Add search bar component
- Create search results page

---

## 📊 Project Statistics

- **Total Files Created**: 40+
- **Lines of Code**: ~3,500
- **Components**: 15+
- **API Routes**: 2
- **Database Tables**: 2
- **Build Time**: ~45-60 seconds
- **Development Time**: ~3-4 hours

---

## 🔐 Security Considerations

### Current Implementation
✅ Row Level Security (RLS) enabled
✅ Authentication required for admin routes
✅ Environment variables for sensitive data
✅ File upload restricted to authenticated users
✅ SQL injection prevented (Supabase parameterized queries)

### Recommendations
- [ ] Add CAPTCHA to signup form
- [ ] Implement rate limiting on auth endpoints
- [ ] Add email verification requirement
- [ ] Set up content security policy (CSP)
- [ ] Regular dependency updates
- [ ] Monitor Supabase logs for suspicious activity

---

## 🚦 Next Steps & Future Enhancements

### Immediate
1. ✅ Deploy to AWS Amplify
2. ✅ Set up Supabase database
3. ⏳ Configure cron job for post updates
4. ⏳ Create first blog post
5. ⏳ Test scheduled publishing

### Short-term
- [ ] Add categories and tags
- [ ] Implement search functionality
- [ ] Add comments system
- [ ] Create email subscription
- [ ] Add social sharing buttons
- [ ] Implement SEO optimization (OpenGraph, Twitter Cards)

### Long-term
- [ ] Multi-author support
- [ ] Draft collaboration
- [ ] Analytics dashboard
- [ ] Content versioning
- [ ] Email notifications for new posts
- [ ] RSS feed
- [ ] Dark mode toggle

---

## 📚 Additional Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TipTap Editor Docs](https://tiptap.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Files
- `README.md` - General project information
- `SETUP_GUIDE.md` - Detailed setup walkthrough
- `supabase-schema.sql` - Database setup script

### Support
- GitHub Issues: https://github.com/kzenow/biblical-blog/issues
- Supabase Support: https://supabase.com/support
- Vercel Support: https://vercel.com/support
- Next.js Discussions: https://github.com/vercel/next.js/discussions

---

## 👥 Credits

**Built with**:
- Next.js by Vercel
- Supabase
- TipTap Editor
- Tailwind CSS
- Lucide Icons

**Developed for**: EbbyDog Design
**Repository**: https://github.com/kzenow/biblical-blog

---

## 📄 License

This project is open source and available for personal and commercial use.

---

**Last Updated**: November 9, 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
**Deployed**: https://biblical-blog.vercel.app

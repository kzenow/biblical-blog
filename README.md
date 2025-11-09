# Biblical Blog - Next.js & Supabase

A full-featured blog website built with Next.js 14 (App Router), Supabase, and Tailwind CSS. This blog platform is designed for biblical and spiritual content with scheduled post management, rich text editing, and authentication.

**🌐 Live Demo**: [https://biblical-blog.vercel.app](https://biblical-blog.vercel.app)

## Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Rich Text Editor**: WYSIWYG editor using TipTap with formatting, images, and links
- **Scheduled Publishing**: Set start and end times for featured posts
- **Featured Posts**: Automatically display featured posts and archive them when expired
- **Admin Dashboard**: Full CRUD operations for managing blog posts
- **File Uploads**: Support for images, documents, and media files
- **Biblical Theme**: Custom Tailwind CSS theme with biblical-inspired colors
- **Responsive Design**: Mobile-friendly layout

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up database**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL commands from `supabase-schema.sql`

5. **Create storage bucket**:
   - In Supabase dashboard, go to Storage
   - The `blog-media` bucket should be created automatically by the SQL script
   - If not, create it manually and make it public

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Database Schema

### Tables

**blog_posts**
- `id` (UUID): Primary key
- `title` (TEXT): Post title
- `slug` (TEXT): URL-friendly slug
- `content` (TEXT): HTML content from rich text editor
- `excerpt` (TEXT): Short summary
- `author_id` (UUID): Reference to auth.users
- `featured_image_url` (TEXT): URL to featured image
- `featured_start` (TIMESTAMP): When post becomes featured
- `featured_end` (TIMESTAMP): When post stops being featured
- `status` (TEXT): draft, scheduled, published, or archived
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**media_files**
- `id` (UUID): Primary key
- `file_name` (TEXT): Original file name
- `file_path` (TEXT): Storage path
- `file_type` (TEXT): MIME type
- `file_size` (BIGINT): File size in bytes
- `uploaded_by` (UUID): Reference to auth.users
- `blog_post_id` (UUID): Optional reference to blog_posts
- `created_at` (TIMESTAMP): Upload timestamp

## How It Works

### Scheduled Publishing System

The blog uses a time-based system for managing post visibility:

1. **Draft**: Posts are hidden from the public
2. **Scheduled**: Posts with a future `featured_start` date
3. **Published**: Posts that are currently featured (between `featured_start` and `featured_end`)
4. **Archived**: Posts where `featured_end` has passed

### Automatic Status Updates

To automatically update post statuses, set up a cron job to call:
```
GET /api/cron/update-posts
```

You can use services like:
- Vercel Cron Jobs
- GitHub Actions
- External cron services (cron-job.org)

Example cron configuration (every 5 minutes):
```
*/5 * * * * curl https://yoursite.com/api/cron/update-posts
```

### Featured Post Logic

- Only one post is featured at a time (the most recent with valid dates)
- If a featured post's `featured_end` passes and no new post is scheduled, it remains visible
- Archived posts are shown in the archive section

## Admin Dashboard

Access the admin dashboard at `/admin` (requires authentication).

### Creating a Post

1. Log in at `/auth/login`
2. Go to Admin Dashboard
3. Click "New Post"
4. Fill in:
   - Title (auto-generates slug)
   - Excerpt (summary)
   - Content (rich text editor)
   - Featured Image (optional)
   - Featured Start/End times
   - Status

### Managing Posts

- **Edit**: Click the edit icon on any post
- **Delete**: Click the trash icon (confirm deletion)
- **View Status**: Color-coded badges show post status

## Deployment

### Deploy to Vercel (Recommended)

**Vercel is the recommended platform** for this Next.js 14 App Router project.

1. **Sign up** at [vercel.com](https://vercel.com) with GitHub
2. **Import repository**: Click "New Project" → Select `biblical-blog` repo
3. **Add environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Deploy** - Automatic!

### Automatic Cron Job

The project includes `vercel.json` with cron configuration:
```json
{
  "crons": [{
    "path": "/api/cron/update-posts",
    "schedule": "*/5 * * * *"
  }]
}
```

This automatically runs every 5 minutes on Vercel to update post statuses.

**Note**: AWS Amplify has compatibility issues with Next.js 14 App Router. See `PROJECT_SUMMARY.md` for details.

## Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the biblical theme colors:
- `biblical-sand`: Light beige
- `biblical-parchment`: Off-white background
- `biblical-olive`: Green accent
- `biblical-burgundy`: Deep red primary
- `biblical-gold`: Gold accent
- `biblical-deepBrown`: Dark text
- `biblical-sage`: Light green

### Fonts

The theme uses:
- `Cinzel`: Decorative headings (loaded from Google Fonts)
- `Georgia`: Body text (system font)

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for admin routes
- File upload restrictions by user
- CORS protection

## Support

For issues or questions:
1. Check the Supabase logs
2. Review browser console for errors
3. Verify environment variables
4. Check database permissions (RLS policies)

## License

This project is open source and available for personal and commercial use.
# biblical-blog
# biblical-blog

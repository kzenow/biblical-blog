import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/utils/helpers'
import { ChevronLeft } from 'lucide-react'
import type { Database } from '@/types/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export const revalidate = 60 // Revalidate every 60 seconds

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const supabase = createClient()

  const { data: post } = (await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .maybeSingle()) as { data: { title: string; excerpt: string } | null }

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - Biblical Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createClient()

  const { data: post, error } = (await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .in('status', ['published', 'archived'])
    .maybeSingle()) as { data: BlogPost | null; error: any }

  if (error || !post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-biblical-burgundy hover:underline mb-8"
        >
          <ChevronLeft size={20} />
          Back to all posts
        </Link>

        <article className="biblical-card">
          <div className="mb-6 text-sm text-biblical-olive">
            {formatDate(post.created_at)}
          </div>

          {post.featured_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden -mx-6 -mt-6 mb-8">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <h1 className="text-5xl biblical-heading mb-6">{post.title}</h1>

          <div className="text-xl text-biblical-olive mb-8 pb-8 border-b-2 border-biblical-sand italic">
            {post.excerpt}
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:biblical-heading prose-a:text-biblical-burgundy prose-a:no-underline hover:prose-a:underline prose-blockquote:border-biblical-olive prose-blockquote:italic prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-8 text-center">
          <Link href="/blog" className="biblical-button">
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

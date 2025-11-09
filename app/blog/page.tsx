import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/helpers'
import { isFeaturedPost } from '@/utils/blog-status'
import type { Database } from '@/types/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogPage() {
  const supabase = createClient()

  const now = new Date().toISOString()

  // Get featured post
  const { data: featuredPosts } = (await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .lte('featured_start', now)
    .or(`featured_end.is.null,featured_end.gte.${now}`)
    .order('featured_start', { ascending: false })
    .limit(1)) as { data: BlogPost[] | null }

  const featuredPost = featuredPosts?.[0]

  // Get archived posts
  const { data: archivedPosts } = (await supabase
    .from('blog_posts')
    .select('*')
    .or(`status.eq.archived,and(status.eq.published,featured_end.lt.${now})`)
    .order('created_at', { ascending: false })) as { data: BlogPost[] | null }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {featuredPost && (
          <div className="mb-12">
            <div className="biblical-card bg-gradient-to-br from-biblical-parchment to-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-biblical-gold text-biblical-deepBrown px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
                <span className="text-sm text-biblical-olive">
                  {formatDate(featuredPost.created_at)}
                </span>
              </div>

              {featuredPost.featured_image_url && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={featuredPost.featured_image_url}
                    alt={featuredPost.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <h1 className="text-4xl biblical-heading mb-4">
                {featuredPost.title}
              </h1>

              <p className="text-lg text-biblical-deepBrown mb-6">
                {featuredPost.excerpt}
              </p>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="biblical-button inline-block"
              >
                Read Full Article
              </Link>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl biblical-heading mb-6">
            {featuredPost ? 'Archive' : 'Recent Posts'}
          </h2>

          {!archivedPosts || archivedPosts.length === 0 ? (
            <div className="biblical-card text-center py-12">
              <p className="text-biblical-olive text-lg">
                No archived posts yet. Check back soon for more spiritual insights!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="biblical-card hover:shadow-xl transition-shadow"
                >
                  {post.featured_image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden -mx-6 -mt-6 mb-4">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="text-sm text-biblical-olive mb-2">
                    {formatDate(post.created_at)}
                  </div>

                  <h3 className="text-xl biblical-heading mb-3">
                    {post.title}
                  </h3>

                  <p className="text-biblical-deepBrown line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 text-biblical-burgundy font-semibold">
                    Read more →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

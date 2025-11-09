import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDateTime } from '@/utils/helpers'
import { PlusCircle, Edit, Trash2, LogOut } from 'lucide-react'
import SignOutButton from '@/components/auth/SignOutButton'
import type { Database } from '@/types/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export default async function AdminDashboard() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: posts, error } = (await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })) as { data: BlogPost[] | null; error: any }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl biblical-heading">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link href="/admin/posts/new" className="biblical-button flex items-center gap-2">
              <PlusCircle size={20} />
              New Post
            </Link>
            <SignOutButton />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading posts: {error.message}
          </div>
        )}

        <div className="biblical-card">
          <h2 className="text-2xl biblical-heading mb-6">All Blog Posts</h2>

          {!posts || posts.length === 0 ? (
            <p className="text-center text-biblical-olive py-8">
              No blog posts yet. Create your first post to get started!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-biblical-sand">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Featured Start</th>
                    <th className="px-4 py-3 text-left">Featured End</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts?.map((post) => (
                    <tr key={post.id} className="border-t border-biblical-sand">
                      <td className="px-4 py-3 font-semibold">{post.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : post.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDateTime(post.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {post.featured_start
                          ? formatDateTime(post.featured_start)
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {post.featured_end ? formatDateTime(post.featured_end) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="p-2 text-biblical-olive hover:bg-biblical-sand rounded"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <Link
                            href={`/admin/posts/${post.id}/delete`}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

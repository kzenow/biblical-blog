import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import BlogPostForm from '@/components/blog/BlogPostForm'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl biblical-heading mb-8">Edit Blog Post</h1>
        <div className="biblical-card">
          <BlogPostForm post={post} userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BlogPostForm from '@/components/blog/BlogPostForm'

export default async function NewPostPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl biblical-heading mb-8">Create New Blog Post</h1>
        <div className="biblical-card">
          <BlogPostForm userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}

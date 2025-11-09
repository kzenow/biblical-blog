// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { generateSlug } from '@/utils/helpers'
import { Database } from '@/types/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']

interface BlogPostFormProps {
  post?: BlogPost
  userId: string
}

export default function BlogPostForm({ post, userId }: BlogPostFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image_url || '')
  const [featuredStart, setFeaturedStart] = useState(
    post?.featured_start ? new Date(post.featured_start).toISOString().slice(0, 16) : ''
  )
  const [featuredEnd, setFeaturedEnd] = useState(
    post?.featured_end ? new Date(post.featured_end).toISOString().slice(0, 16) : ''
  )
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published' | 'archived'>(
    post?.status || 'draft'
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!post) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-media').getPublicUrl(filePath)

      return publicUrl
    } catch (err: any) {
      console.error('Upload error:', err)
      throw err
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await handleImageUpload(file)
      setFeaturedImageUrl(url)
    } catch (err: any) {
      setError('Failed to upload featured image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const postData: BlogPostInsert = {
        title,
        slug,
        excerpt,
        content,
        featured_image_url: featuredImageUrl || null,
        featured_start: featuredStart || null,
        featured_end: featuredEnd || null,
        status,
        author_id: userId,
      }

      if (post) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            title,
            slug,
            excerpt,
            content,
            featured_image_url: featuredImageUrl || null,
            featured_start: featuredStart || null,
            featured_end: featuredEnd || null,
            status,
          })
          .eq('id', post.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData])

        if (insertError) throw insertError
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="biblical-input w-full"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-semibold mb-2">
          Slug (URL)
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="biblical-input w-full"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-semibold mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="biblical-input w-full"
          rows={3}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Content</label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          onImageUpload={handleImageUpload}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Featured Image</label>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageUpload}
            className="biblical-input w-full"
            disabled={loading || uploadingImage}
          />
          {featuredImageUrl && (
            <div className="mt-2">
              <img
                src={featuredImageUrl}
                alt="Featured"
                className="max-w-xs rounded-lg border-2 border-biblical-olive"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="featuredStart" className="block text-sm font-semibold mb-2">
            Featured Start Date & Time
          </label>
          <input
            id="featuredStart"
            type="datetime-local"
            value={featuredStart}
            onChange={(e) => setFeaturedStart(e.target.value)}
            className="biblical-input w-full"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="featuredEnd" className="block text-sm font-semibold mb-2">
            Featured End Date & Time
          </label>
          <input
            id="featuredEnd"
            type="datetime-local"
            value={featuredEnd}
            onChange={(e) => setFeaturedEnd(e.target.value)}
            className="biblical-input w-full"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-semibold mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="biblical-input w-full"
          disabled={loading}
        >
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="biblical-button"
          disabled={loading || uploadingImage}
        >
          {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all font-semibold"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

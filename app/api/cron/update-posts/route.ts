import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    const now = new Date().toISOString()

    // Update scheduled posts to published
    const { error: publishError } = await supabase
      .from('blog_posts')
      .update({ status: 'published' })
      .eq('status', 'scheduled')
      .lte('featured_start', now)

    if (publishError) {
      console.error('Error publishing scheduled posts:', publishError)
    }

    // Update published posts to archived if featured_end has passed
    const { error: archiveError } = await supabase
      .from('blog_posts')
      .update({ status: 'archived' })
      .eq('status', 'published')
      .not('featured_end', 'is', null)
      .lt('featured_end', now)

    if (archiveError) {
      console.error('Error archiving posts:', archiveError)
    }

    return NextResponse.json({
      success: true,
      message: 'Post statuses updated successfully',
      timestamp: now,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

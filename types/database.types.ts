export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          excerpt: string
          author_id: string
          featured_image_url: string | null
          published_at: string | null
          featured_start: string | null
          featured_end: string | null
          status: 'draft' | 'scheduled' | 'published' | 'archived'
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          excerpt: string
          author_id: string
          featured_image_url?: string | null
          published_at?: string | null
          featured_start?: string | null
          featured_end?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'archived'
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          excerpt?: string
          author_id?: string
          featured_image_url?: string | null
          published_at?: string | null
          featured_start?: string | null
          featured_end?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'archived'
          slug?: string
        }
      }
      media_files: {
        Row: {
          id: string
          created_at: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string
          blog_post_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string
          blog_post_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          uploaded_by?: string
          blog_post_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
}

// Provide fallback values to prevent app crash during development
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export type Database = {
  public: {
    Tables: {
      cms_users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'administrator' | 'editor' | 'author'
          status: 'active' | 'pending'
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'administrator' | 'editor' | 'author'
          status?: 'active' | 'pending'
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'administrator' | 'editor' | 'author'
          status?: 'active' | 'pending'
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
    }
  }
}
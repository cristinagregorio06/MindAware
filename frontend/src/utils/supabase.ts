import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your_supabase_project_url_here'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table interfaces
export interface TestResult {
  id: string
  user_id: string
  created_at: string
  digital_self_esteem: number
  digital_loneliness: number
  digital_anxiety: number
  depression: number
  information_panic: number
  life_satisfaction: number
  future_confidence: number
  overall_score: number
}

export interface UserProfile {
  id: string
  email: string
  created_at: string
  last_test_date?: string
  test_count: number
}
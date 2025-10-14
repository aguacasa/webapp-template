import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { env, isSupabaseConfigured } from '@/lib/env'

export function createClient() {
  if (!isSupabaseConfigured()) {
    console.warn(
      '⚠️  Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    )
  }

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

import { createClient as createPublicClient } from "@supabase/supabase-js"

import type { Database } from "@/shared/api/supabase/types"

export function createClient() {
  return createPublicClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

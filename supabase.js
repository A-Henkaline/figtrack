import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zfzlvtufuftadfsioxgr.supabase.co'
const supabaseKey = 'sb_publishable_Q7Qd4X_dQ2e0so39kaC6Nw_9DelIPTp'

export const supabase = createClient(supabaseUrl, supabaseKey)

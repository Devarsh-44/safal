import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase keys are configured. Otherwise the site runs in demo mode (localStorage). */
export const isLive = Boolean(url && key);

export const supabase = isLive ? createClient(url, key) : null;

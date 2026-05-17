import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

/* ── Campaign type (read-only subset for the blog) ─────────── */
export interface Campaign {
  id:           string;
  created_at:   string;
  updated_at:   string;
  title:        string;
  idea:         string;
  tone:         string;
  language:     string;
  channels:     string[];
  blog:         string | null;
  blog_structure: string | null;
  image_url:    string | null;
  image_prompt: string | null;
}

/** Returns only campaigns that have blog content */
export async function getBlogPosts(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, created_at, updated_at, title, idea, tone, language, channels, blog, blog_structure, image_url, image_prompt')
    .not('blog', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Campaign[];
}

export async function getBlogPost(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, created_at, updated_at, title, idea, tone, language, channels, blog, blog_structure, image_url, image_prompt')
    .eq('id', id)
    .not('blog', 'is', null)
    .single();

  if (error) return null;
  return data as Campaign;
}

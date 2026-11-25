import { supabase, isPlaceholder } from '../lib/supabase';
import type { BlogCommentItem } from '../types/admin';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LOCAL_STORAGE_KEY = 'portfolio_blog_comments_v1';

function readLocalComments(): BlogCommentItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BlogCommentItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalComments(items: BlogCommentItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Fetch comments for a single blog post (Supabase with graceful local fallback)
 */
export async function fetchBlogComments(blogId: string): Promise<{
  comments: BlogCommentItem[];
  source: 'supabase' | 'local';
}> {
  if (isPlaceholder || !isValidUuid(blogId)) {
    const local = readLocalComments().filter((c) => c.blog_id === blogId);
    return { comments: local, source: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      return { comments: data as BlogCommentItem[], source: 'supabase' };
    }
  } catch {
    // Fallback below
  }

  const local = readLocalComments().filter((c) => c.blog_id === blogId);
  return { comments: local, source: 'local' };
}

/**
 * Fetch comment counts grouped by blog_id for card badges
 */
export async function fetchBlogCommentCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};

  if (!isPlaceholder) {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('blog_id');

      if (!error && data) {
        for (const row of data as { blog_id: string }[]) {
          counts[row.blog_id] = (counts[row.blog_id] || 0) + 1;
        }
        return counts;
      }
    } catch {
      // Fallback below
    }
  }

  for (const item of readLocalComments()) {
    counts[item.blog_id] = (counts[item.blog_id] || 0) + 1;
  }
  return counts;
}

/**
 * Create a new visitor question/comment or reply
 */
export async function createBlogComment(payload: {
  blog_id: string;
  parent_id?: string | null;
  author_name: string;
  content: string;
  is_admin?: boolean;
}): Promise<{ comment: BlogCommentItem; source: 'supabase' | 'local' }> {
  const cleanPayload = {
    blog_id: payload.blog_id,
    parent_id: payload.parent_id || null,
    author_name: payload.author_name.trim(),
    content: payload.content.trim(),
    is_admin: Boolean(payload.is_admin),
  };

  if (!isPlaceholder && isValidUuid(payload.blog_id)) {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([cleanPayload])
        .select('*')
        .single();

      if (!error && data) {
        return { comment: data as BlogCommentItem, source: 'supabase' };
      }
    } catch {
      // Fall through to local fallback
    }
  }

  const fallbackItem: BlogCommentItem = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...cleanPayload,
    created_at: new Date().toISOString(),
  };

  const existing = readLocalComments();
  writeLocalComments([...existing, fallbackItem]);
  return { comment: fallbackItem, source: 'local' };
}

import { query, queryOne } from './db';
import type { Locale } from './i18n';

export type Post = {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  coverImage: string | null;
  category: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const POST_COLS = `id, slug, title_en AS "titleEn", title_ar AS "titleAr", excerpt_en AS "excerptEn", excerpt_ar AS "excerptAr",
  content_en AS "contentEn", content_ar AS "contentAr", cover_image AS "coverImage", category, published,
  published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt"`;

export async function getPublishedPosts(limit = 50) {
  try {
    return await query<Post>(`SELECT ${POST_COLS} FROM posts WHERE published = true ORDER BY published_at DESC NULLS LAST, id DESC LIMIT $1`, [limit]);
  } catch (e) {
    console.error('[posts]', (e as Error).message);
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    return await queryOne<Post>(`SELECT ${POST_COLS} FROM posts WHERE slug = $1 AND published = true`, [slug]);
  } catch (e) {
    console.error('[posts]', (e as Error).message);
    return null;
  }
}

export function localized(p: Post, l: Locale) {
  const pick = (en: string, ar: string) => (l === 'ar' ? ar || en : en || ar);
  return {
    title: pick(p.titleEn, p.titleAr),
    excerpt: pick(p.excerptEn, p.excerptAr),
    content: pick(p.contentEn, p.contentAr),
  };
}

export function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9؀-ۿ]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || `post-${Date.now()}`
  );
}

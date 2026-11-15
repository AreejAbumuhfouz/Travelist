import { query } from './db';
import type { Locale } from './i18n';

export type GalleryItem = { id: number; image: string; captionEn: string; captionAr: string; sort: number };

export const GALLERY_COLS = `id, image, caption_en AS "captionEn", caption_ar AS "captionAr", sort`;

export async function getGallery(limit = 60) {
  try {
    return await query<GalleryItem>(`SELECT ${GALLERY_COLS} FROM gallery ORDER BY sort ASC, id ASC LIMIT $1`, [limit]);
  } catch (e) {
    console.error('[gallery]', (e as Error).message);
    return [];
  }
}

export const caption = (g: GalleryItem, l: Locale) => (l === 'ar' ? g.captionAr || g.captionEn : g.captionEn || g.captionAr);

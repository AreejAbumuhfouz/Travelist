'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query, queryOne } from '@/lib/db';
import { SESSION_COOKIE, cookieOptions, signSession } from '@/lib/auth';
import { requireAdmin } from '@/lib/session';
import { CONTENT_FIELDS } from '@/lib/content';
import { slugify } from '@/lib/posts';

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const str = (f: FormData, k: string, max = 100_000) => String(f.get(k) ?? '').trim().slice(0, max);

function refreshSite() {
  revalidatePath('/', 'layout');
}

/* ---------- Auth ---------- */

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = str(form, 'email', 200).toLowerCase();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };

  const user = await queryOne<{ id: number; email: string; name: string; password_hash: string }>(
    'SELECT id, email, name, password_hash FROM users WHERE email = $1',
    [email],
  ).catch(() => null);

  // Compare even when the user is missing so timing does not reveal which emails exist
  const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) return { error: 'Incorrect email or password.' };

  const token = await signSession({ uid: user.id, email: user.email, name: user.name });
  cookies().set(SESSION_COOKIE, token, cookieOptions);
  redirect('/admin');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect('/admin/login');
}

export type PasswordState = { error?: string; ok?: boolean };

export async function changePassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  const s = await requireAdmin();
  const current = String(form.get('current') ?? '');
  const next = String(form.get('next') ?? '');
  const confirm = String(form.get('confirm') ?? '');
  if (next.length < 8) return { error: 'The new password must be at least 8 characters.' };
  if (next !== confirm) return { error: 'The new passwords do not match.' };
  const user = await queryOne<{ password_hash: string }>('SELECT password_hash FROM users WHERE id = $1', [s.uid]);
  if (!user || !(await bcrypt.compare(current, user.password_hash))) return { error: 'Your current password is incorrect.' };
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [await bcrypt.hash(next, 12), s.uid]);
  return { ok: true };
}

/* ---------- Posts ---------- */

export async function savePost(form: FormData) {
  await requireAdmin();
  const id = Number(form.get('id')) || null;
  const titleEn = str(form, 'titleEn', 300);
  const titleAr = str(form, 'titleAr', 300);
  let slug = slugify(str(form, 'slug', 120) || titleEn || titleAr);
  const published = form.get('published') === 'on';

  const values = [
    titleEn,
    titleAr,
    str(form, 'excerptEn', 600),
    str(form, 'excerptAr', 600),
    str(form, 'contentEn'),
    str(form, 'contentAr'),
    str(form, 'coverImage', 1000) || null,
    str(form, 'category', 60) || 'Travel',
    published,
  ];

  // Keep slugs unique
  const clash = await queryOne<{ id: number }>('SELECT id FROM posts WHERE slug = $1 AND ($2::int IS NULL OR id <> $2)', [slug, id]);
  if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  if (id) {
    await query(
      `UPDATE posts SET title_en=$1, title_ar=$2, excerpt_en=$3, excerpt_ar=$4, content_en=$5, content_ar=$6, cover_image=$7,
        category=$8, published=$9, published_at = CASE WHEN $9 AND published_at IS NULL THEN now() ELSE published_at END,
        slug=$10, updated_at=now() WHERE id=$11`,
      [...values, slug, id],
    );
  } else {
    await query(
      `INSERT INTO posts (title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, cover_image, category, published, published_at, slug)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, CASE WHEN $9 THEN now() ELSE NULL END, $10)`,
      [...values, slug],
    );
  }
  refreshSite();
  redirect('/admin/posts?saved=1');
}

export async function deletePost(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM posts WHERE id = $1', [Number(form.get('id'))]);
  refreshSite();
  redirect('/admin/posts?deleted=1');
}

export async function togglePublish(form: FormData) {
  await requireAdmin();
  await query(
    `UPDATE posts SET published = NOT published,
      published_at = CASE WHEN NOT published AND published_at IS NULL THEN now() ELSE published_at END, updated_at = now()
     WHERE id = $1`,
    [Number(form.get('id'))],
  );
  refreshSite();
  revalidatePath('/admin/posts');
}

/* ---------- Site content ---------- */

export async function saveContent(form: FormData) {
  await requireAdmin();
  for (const f of CONTENT_FIELDS) {
    const en = str(form, `${f.key}__en`, 10_000);
    const ar = f.shared ? en : str(form, `${f.key}__ar`, 10_000);
    await query(
      `INSERT INTO site_content (key, value_en, value_ar, updated_at) VALUES ($1,$2,$3,now())
       ON CONFLICT (key) DO UPDATE SET value_en = EXCLUDED.value_en, value_ar = EXCLUDED.value_ar, updated_at = now()`,
      [f.key, en, ar],
    );
  }
  refreshSite();
  redirect('/admin/content?saved=1');
}

/* ---------- Messages ---------- */

export async function setMessageRead(form: FormData) {
  await requireAdmin();
  await query('UPDATE messages SET read = $1 WHERE id = $2', [form.get('read') === 'true', Number(form.get('id'))]);
  revalidatePath('/admin', 'layout');
}

export async function deleteMessage(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM messages WHERE id = $1', [Number(form.get('id'))]);
  revalidatePath('/admin', 'layout');
}

/* ---------- Media ---------- */

export async function deleteMedia(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM media WHERE id = $1', [String(form.get('id'))]);
  revalidatePath('/admin/media');
}

/* ---------- Gallery ---------- */

export async function addGalleryItem(form: FormData) {
  await requireAdmin();
  const image = str(form, 'image', 1000);
  if (!image) redirect('/admin/gallery?error=1');
  const next = await queryOne<{ n: number }>('SELECT COALESCE(MAX(sort), 0) + 10 AS n FROM gallery');
  await query('INSERT INTO gallery (image, caption_en, caption_ar, sort) VALUES ($1,$2,$3,$4)', [
    image,
    str(form, 'captionEn', 200),
    str(form, 'captionAr', 200),
    next?.n ?? 0,
  ]);
  refreshSite();
  redirect('/admin/gallery?saved=1');
}

export async function updateGalleryItem(form: FormData) {
  await requireAdmin();
  await query('UPDATE gallery SET caption_en = $1, caption_ar = $2, sort = $3 WHERE id = $4', [
    str(form, 'captionEn', 200),
    str(form, 'captionAr', 200),
    Number(form.get('sort')) || 0,
    Number(form.get('id')),
  ]);
  refreshSite();
  redirect('/admin/gallery?saved=1');
}

export async function deleteGalleryItem(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM gallery WHERE id = $1', [Number(form.get('id'))]);
  refreshSite();
  redirect('/admin/gallery?deleted=1');
}

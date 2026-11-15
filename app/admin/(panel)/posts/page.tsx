/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { Notice, PageHeader, StatusBadge } from '@/components/admin/ui';
import { togglePublish } from '../../actions';

export const metadata = { title: 'Blog posts' };

export default async function PostsPage({ searchParams }: { searchParams: { saved?: string; deleted?: string } }) {
  await requireAdmin();
  const posts = await query<{ id: number; slug: string; title_en: string; title_ar: string; category: string; published: boolean; cover_image: string | null; updated_at: Date }>(
    'SELECT id, slug, title_en, title_ar, category, published, cover_image, updated_at FROM posts ORDER BY updated_at DESC',
  );
  const fmt = (d: Date) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

  return (
    <>
      <PageHeader
        title="Blog posts"
        description="Write each post in English and Arabic. Drafts stay hidden from the website."
        action={
          <Link href="/admin/posts/new" className="btn-primary">
            <Plus size={18} aria-hidden="true" /> New post
          </Link>
        }
      />
      {searchParams.saved && <Notice>Post saved.</Notice>}
      {searchParams.deleted && <Notice>Post deleted.</Notice>}

      {posts.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-muted">No posts yet.</p>
          <Link href="/admin/posts/new" className="btn-navy">Write your first post</Link>
        </div>
      ) : (
        <ul className="card divide-y divide-line">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-navy">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <img src="/brand/logo-icon-dark.png" alt="" className="mx-auto h-full w-auto p-3" />
                  )}
                </div>
                <div className="min-w-0">
                  <Link href={`/admin/posts/${p.id}`} className="block truncate font-semibold text-heading hover:text-orange-ink">
                    {p.title_en || '(no English title)'}
                  </Link>
                  <p className="truncate text-sm text-muted" dir="rtl" lang="ar">{p.title_ar || '(لا يوجد عنوان عربي)'}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {p.category} · Updated {fmt(p.updated_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <StatusBadge published={p.published} />
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-heading hover:bg-surface-2">
                    {p.published ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    {p.published ? 'Unpublish' : 'Publish'}
                  </button>
                </form>
                <Link href={`/admin/posts/${p.id}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-navy px-3 text-sm font-medium text-white dark:bg-heading dark:text-navy-deep">
                  <Pencil size={15} aria-hidden="true" /> Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

import Link from 'next/link';
import { FileText, Mail, PenSquare, Plus } from 'lucide-react';
import { query, queryOne } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { PageHeader, StatusBadge } from '@/components/admin/ui';

export const metadata = { title: 'Dashboard' };

export default async function Dashboard() {
  const s = await requireAdmin();
  const counts = await queryOne<{ posts: number; published: number; drafts: number; unread: number; messages: number }>(`
    SELECT
      (SELECT count(*)::int FROM posts) AS posts,
      (SELECT count(*)::int FROM posts WHERE published) AS published,
      (SELECT count(*)::int FROM posts WHERE NOT published) AS drafts,
      (SELECT count(*)::int FROM messages WHERE NOT read) AS unread,
      (SELECT count(*)::int FROM messages) AS messages`);
  const recentPosts = await query<{ id: number; title_en: string; title_ar: string; published: boolean; updated_at: Date }>(
    'SELECT id, title_en, title_ar, published, updated_at FROM posts ORDER BY updated_at DESC LIMIT 5',
  );
  const recentMessages = await query<{ id: number; name: string; subject: string; read: boolean; created_at: Date }>(
    'SELECT id, name, subject, read, created_at FROM messages ORDER BY created_at DESC LIMIT 5',
  );

  const cards = [
    { label: 'Published posts', value: counts?.published ?? 0, href: '/admin/posts' },
    { label: 'Drafts', value: counts?.drafts ?? 0, href: '/admin/posts' },
    { label: 'Unread messages', value: counts?.unread ?? 0, href: '/admin/messages' },
    { label: 'All messages', value: counts?.messages ?? 0, href: '/admin/messages' },
  ];
  const fmt = (d: Date) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

  return (
    <>
      <PageHeader
        title={`Welcome back, ${s.name.split(' ')[0] || 'there'}`}
        description="Here's what's happening on Travelist."
        action={
          <Link href="/admin/posts/new" className="btn-primary">
            <Plus size={18} aria-hidden="true" /> New post
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 transition-colors hover:border-orange">
            <p className="text-3xl font-extrabold text-heading">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-heading">
              <FileText size={18} aria-hidden="true" /> Recent posts
            </h2>
            <Link href="/admin/posts" className="text-sm font-semibold text-orange-ink">View all</Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-muted">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-orange-ink">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-heading">{p.title_en || p.title_ar}</span>
                      <span className="text-xs text-muted">Updated {fmt(p.updated_at)}</span>
                    </span>
                    <StatusBadge published={p.published} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-heading">
              <Mail size={18} aria-hidden="true" /> Latest messages
            </h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-orange-ink">Open inbox</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-muted">No messages yet. They appear here when someone uses the contact form.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className={`block truncate ${m.read ? 'text-heading' : 'font-bold text-heading'}`}>{m.name}</span>
                    <span className="block truncate text-xs text-muted">{m.subject || 'No subject'}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{fmt(m.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Link href="/admin/content" className="card mt-6 flex items-center gap-4 p-5 transition-colors hover:border-orange">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-orange dark:bg-surface-2">
          <PenSquare size={20} aria-hidden="true" />
        </span>
        <span>
          <span className="block font-bold text-heading">Edit website content</span>
          <span className="text-sm text-muted">Hero text, About page, follower numbers, contact details, social links and the media kit link — in English and Arabic.</span>
        </span>
      </Link>
    </>
  );
}

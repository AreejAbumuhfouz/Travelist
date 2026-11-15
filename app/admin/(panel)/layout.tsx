import Link from 'next/link';
import { ExternalLink, Image as ImageIcon, LogOut, Settings } from 'lucide-react';
import { requireAdmin } from '@/lib/session';
import { queryOne } from '@/lib/db';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme';
import { AdminBottomNav, AdminSidebarNav } from '@/components/admin/admin-nav';
import { logout } from '../actions';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const unread = Number((await queryOne<{ n: number }>('SELECT count(*)::int AS n FROM messages WHERE read = false'))?.n ?? 0);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-e border-line bg-surface p-5 lg:flex">
        <Link href="/admin" aria-label="Dashboard">
          <Logo />
        </Link>
        <nav aria-label="Admin" className="flex-1">
          <AdminSidebarNav unread={unread} />
        </nav>
        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <p className="truncate text-sm text-muted">{session.email}</p>
          <div className="flex items-center gap-2">
            <ThemeToggle labels={{ light: 'Light mode', dark: 'Dark mode' }} />
            <a href="/en" target="_blank" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading hover:bg-surface-2" aria-label="View website">
              <ExternalLink size={18} aria-hidden="true" />
            </a>
            <form action={logout}>
              <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-heading hover:bg-surface-2">
                <LogOut size={17} aria-hidden="true" /> Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur-md lg:hidden">
          <Link href="/admin" aria-label="Dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle labels={{ light: 'Light mode', dark: 'Dark mode' }} />
            <Link href="/admin/media" aria-label="Media library" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading">
              <ImageIcon size={18} aria-hidden="true" />
            </Link>
            <Link href="/admin/settings" aria-label="Settings" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading">
              <Settings size={18} aria-hidden="true" />
            </Link>
            <form action={logout}>
              <button type="submit" aria-label="Log out" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading">
                <LogOut size={18} aria-hidden="true" />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">{children}</main>
      </div>

      <AdminBottomNav unread={unread} />
    </div>
  );
}

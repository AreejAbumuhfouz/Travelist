'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Image as ImageIcon, Images, LayoutDashboard, Mail, PenSquare, Settings } from 'lucide-react';

export const adminItems = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Blog', Icon: FileText },
  { href: '/admin/content', label: 'Content', Icon: PenSquare },
  { href: '/admin/gallery', label: 'Gallery', Icon: Images },
  { href: '/admin/messages', label: 'Messages', Icon: Mail },
  { href: '/admin/media', label: 'Media', Icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

function useIsActive() {
  const p = usePathname() || '';
  return (href: string) => (href === '/admin' ? p === '/admin' : p.startsWith(href));
}

export function AdminSidebarNav({ unread }: { unread: number }) {
  const isActive = useIsActive();
  return (
    <ul className="flex flex-col gap-1">
      {adminItems.map(({ href, label, Icon }) => {
        const on = isActive(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={on ? 'page' : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors ${
                on ? 'bg-navy text-white dark:bg-heading dark:text-navy-deep' : 'text-heading hover:bg-surface-2'
              }`}
            >
              <Icon size={19} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {label === 'Messages' && unread > 0 && (
                <span className="rounded-full bg-orange px-2 py-0.5 text-xs font-bold text-navy-deep">{unread}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Mobile bottom bar for the admin (first five sections; Media and Settings live in the top bar). */
export function AdminBottomNav({ unread }: { unread: number }) {
  const isActive = useIsActive();
  return (
    <nav aria-label="Admin" className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-5">
        {adminItems.slice(0, 5).map(({ href, label, Icon }) => {
          const on = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? 'page' : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${on ? 'text-orange-ink' : 'text-muted'}`}
              >
                <span className={`flex h-8 w-12 items-center justify-center rounded-full ${on ? 'bg-orange/15' : ''}`}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                {label}
                {label === 'Messages' && unread > 0 && (
                  <span className="absolute end-[22%] top-2 h-2.5 w-2.5 rounded-full bg-orange ring-2 ring-surface" aria-label={`${unread} unread`} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

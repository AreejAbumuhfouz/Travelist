'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Handshake, Home, Mail, UserRound } from 'lucide-react';
import type { Dict, Locale } from '@/lib/i18n';
import { ThemeToggle } from './theme';
import { Logo } from './logo';

const items = [
  { key: 'home', path: '', Icon: Home },
  { key: 'about', path: '/about', Icon: UserRound },
  { key: 'work', path: '/work-with-me', Icon: Handshake },
  { key: 'blog', path: '/blog', Icon: BookOpen },
  { key: 'contact', path: '/contact', Icon: Mail },
] as const;

function useActive(locale: Locale) {
  const pathname = usePathname() || '/';
  return (path: string) => {
    const full = `/${locale}${path}`;
    return path === '' ? pathname === full || pathname === `${full}/` : pathname.startsWith(full);
  };
}

function LangSwitch({ locale, t }: { locale: Locale; t: Dict }) {
  const pathname = usePathname() || `/${locale}`;
  const other: Locale = locale === 'en' ? 'ar' : 'en';
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}`;
  return (
    <Link
      href={href}
      hrefLang={other}
      lang={other}
      aria-label={t.langSwitch}
      className="inline-flex h-11 items-center justify-center rounded-full border border-line px-4 text-sm font-semibold text-heading transition-colors hover:bg-surface-2"
    >
      {t.langName}
    </Link>
  );
}

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const isActive = useActive(locale);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href={`/${locale}`} className="shrink-0" aria-label="Travelist — home">
          <Logo />
        </Link>

        <nav aria-label={t.menu} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.filter(({ key }) => key !== 'contact').map(({ key, path }) => {
              const active = isActive(path);
              return (
                <li key={key}>
                  <Link
                    href={`/${locale}${path}`}
                    aria-current={active ? 'page' : undefined}
                    className={`whitespace-nowrap rounded-full px-3 py-2.5 text-[15px] font-medium lg:px-4 transition-colors ${
                      active ? 'bg-navy text-white dark:bg-heading dark:text-navy-deep' : 'text-heading hover:bg-surface-2'
                    }`}
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch locale={locale} t={t} />
          <ThemeToggle labels={t.theme} />
          <Link href={`/${locale}/contact`} className="btn-primary hidden md:inline-flex">
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Mobile-only bottom tab bar */
export function BottomNav({ locale, t }: { locale: Locale; t: Dict }) {
  const isActive = useActive(locale);
  return (
    <nav aria-label={t.menu} className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ key, path, Icon }) => {
          const active = isActive(path);
          return (
            <li key={key}>
              <Link
                href={`/${locale}${path}`}
                aria-current={active ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  active ? 'text-orange-ink' : 'text-muted hover:text-heading'
                }`}
              >
                <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-orange/15' : ''}`}>
                  <Icon size={21} strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
                </span>
                <span className="max-w-full truncate px-0.5">{t.navShort[key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

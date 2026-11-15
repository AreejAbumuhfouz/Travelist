import Link from 'next/link';
import { AtSign, Download, Facebook, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';
import type { Dict, Locale } from '@/lib/i18n';
import type { SiteContent } from '@/lib/content';
import { LogoFull } from './logo';

export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;

export function socialList(c: SiteContent) {
  return [
    { key: 'instagram', href: c.instagram_url, label: 'Instagram', handle: '@travelist_2', count: c.ig_followers, Icon: Instagram },
    { key: 'facebook', href: c.facebook_url, label: 'Facebook', handle: 'Travelist', count: c.fb_followers, Icon: Facebook },
    { key: 'threads', href: c.threads_url, label: 'Threads', handle: '@travelist_2', count: c.threads_followers, Icon: AtSign },
    { key: 'linkedin', href: c.linkedin_url, label: 'LinkedIn', handle: 'Abdallah Yacoub', count: '', Icon: Linkedin },
  ].filter((l) => l.href);
}

export function SocialLinks({ c, className = '' }: { c: SiteContent; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {socialList(c).map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading transition-colors hover:border-orange hover:text-orange-ink"
          >
            <Icon size={19} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ locale, t, c }: { locale: Locale; t: Dict; c: SiteContent }) {
  const year = new Date().getFullYear();
  const pages = [
    { k: 'home', href: '' },
    { k: 'about', href: '/about' },
    { k: 'work', href: '/work-with-me' },
    { k: 'blog', href: '/blog' },
    { k: 'contact', href: '/contact' },
  ] as const;
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1.2fr]">
        <div className="flex flex-col items-start gap-4">
          <LogoFull className="h-24 w-auto" />
          <p className="max-w-xs text-muted">{t.footer.tagline}</p>
          {c.media_kit_url && (
            <a href={c.media_kit_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-heading hover:text-orange-ink">
              <Download size={16} aria-hidden="true" /> {t.home.mediaKit}
            </a>
          )}
        </div>
        <nav aria-label={t.menu}>
          <ul className="grid gap-3 text-[15px]">
            {pages.map(({ k, href }) => (
              <li key={k}>
                <Link href={`/${locale}${href}`} className="text-heading hover:text-orange-ink">
                  {t.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-heading">{t.contact.follow}</p>
          <SocialLinks c={c} />
          {c.contact_phone && (
            <a href={waLink(c.contact_phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-orange-ink">
              <MessageCircle size={16} aria-hidden="true" />
              <span dir="ltr">{c.contact_phone}</span>
            </a>
          )}
          {c.contact_email && (
            <a href={`mailto:${c.contact_email}`} className="inline-flex items-center gap-2 break-all text-muted hover:text-orange-ink">
              <Mail size={16} aria-hidden="true" />
              {c.contact_email}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col gap-2 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Travelist_2 · {locale === 'ar' ? 'عبدالله يعقوب الزيود' : 'Abdallah Yacoub Alzyoud'}. {t.footer.rights}
          </p>
          <p>
            {locale === 'ar' ? 'تصميم وتطوير' : 'Designed & developed by'}{' '}
            <a href="https://areejmuhfouz.com" target="_blank" rel="noopener" className="font-semibold text-heading hover:text-orange-ink">
              {locale === 'ar' ? 'أريج أبومحفوظ' : 'Areej Abumuhfouz'}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

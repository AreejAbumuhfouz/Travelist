/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from 'lucide-react';
import type { Dict, Locale } from '@/lib/i18n';
import { EXHIBITIONS, type SiteContent } from '@/lib/content';
import { caption, type GalleryItem } from '@/lib/gallery';
import { socialList } from './footer';

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-2xl flex-col gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-balance text-3xl font-extrabold text-heading md:text-4xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function StatsRow({ c, t, className = '' }: { c: SiteContent; t: Dict; className?: string }) {
  const stats = [
    { v: c.stat_followers, l: t.stats.followers },
    { v: c.stat_views, l: t.stats.views },
    { v: c.stat_million, l: t.stats.million },
  ];
  return (
    <dl className={`grid grid-cols-3 divide-x divide-line rounded-xl2 border border-line bg-surface rtl:divide-x-reverse ${className}`}>
      {stats.map((s) => (
        <div key={s.l} className="flex flex-col gap-1 px-3 py-4 sm:px-6">
          <dt className="order-2 text-xs leading-snug text-muted sm:text-sm">{s.l}</dt>
          <dd className="order-1 text-2xl font-extrabold text-heading sm:text-3xl" dir="ltr">
            {s.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PlatformCards({ c, t }: { c: SiteContent; t: Dict }) {
  const items = socialList(c).filter((s) => s.count);
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {items.map(({ key, href, label, handle, count, Icon }) => (
        <li key={key}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="card group flex items-center gap-4 p-5 transition-colors hover:border-orange">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-orange dark:bg-surface-2">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-2xl font-extrabold text-heading" dir="ltr">
                {count}
              </span>
              <span className="block text-sm leading-snug text-muted">
                {label}
                <span className="block" dir="ltr">{handle}</span>
              </span>
            </span>
            <ArrowUpRight size={18} className="shrink-0 text-muted transition-colors group-hover:text-orange-ink rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function GalleryGrid({ items, locale, limit, featured = true }: { items: GalleryItem[]; locale: Locale; limit?: number; featured?: boolean }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {list.map((g, i) => (
        <li key={g.id} className={`group relative overflow-hidden rounded-xl2 bg-navy ${featured && i === 0 ? 'col-span-2 row-span-2' : ''}`}>
          <figure className="h-full">
            <img
              src={g.image}
              alt={caption(g, locale)}
              loading="lazy"
              className="aspect-[3/4] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {caption(g, locale) && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-sm font-medium text-white sm:p-4">
                {caption(g, locale)}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function ExhibitionList({ locale, columns = true }: { locale: Locale; columns?: boolean }) {
  return (
    <ol className={`grid gap-4 ${columns ? 'md:grid-cols-2' : ''}`}>
      {EXHIBITIONS.map((e) => (
        <li key={e.name.en} className="card flex gap-4 p-5 sm:p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/15 text-sm font-bold text-orange-ink" aria-hidden="true">
            {e.code}
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-orange-ink">{e.date[locale]}</p>
            <h3 className="text-lg font-bold leading-snug text-heading">{e.name[locale]}</h3>
            <p className="text-muted">{e.place[locale]}</p>
            <p className="text-sm text-muted">{e.role[locale]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

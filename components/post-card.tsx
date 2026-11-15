/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { formatDate, type Dict, type Locale } from '@/lib/i18n';
import { localized, readingMinutes, type Post } from '@/lib/posts';

export function PostCover({ src, alt, className = '' }: { src: string | null; alt: string; className?: string }) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`flex h-full w-full items-center justify-center bg-navy ${className}`} aria-hidden="true">
      <img src="/brand/logo-icon-dark.png" alt="" className="h-1/3 w-auto opacity-90" />
    </div>
  );
}

export function PostCard({ post, locale, t }: { post: Post; locale: Locale; t: Dict }) {
  const p = localized(post, locale);
  return (
    <article className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1">
      <Link href={`/${locale}/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <PostCover src={post.coverImage} alt="" className="transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="rounded-full bg-orange/15 px-2.5 py-0.5 font-medium text-orange-ink">{post.category}</span>
          <time dateTime={new Date(post.publishedAt ?? post.createdAt).toISOString()}>{formatDate(post.publishedAt ?? post.createdAt, locale)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" /> {readingMinutes(p.content)} {t.blog.minRead}
          </span>
        </div>
        <h3 className="text-xl font-bold leading-snug text-heading">
          <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-orange-ink">
            {p.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-muted">{p.excerpt}</p>
        <Link href={`/${locale}/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-heading hover:text-orange-ink">
          {t.blog.readMore}
          <ArrowRight size={17} className="rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

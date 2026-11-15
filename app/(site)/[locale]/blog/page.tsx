import type { Metadata } from 'next';
import Link from 'next/link';
import { getDict, type Locale } from '@/lib/i18n';
import { getPublishedPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { PageHero } from '@/components/page-hero';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: getDict(params.locale).nav.blog };
}

export default async function BlogPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { category?: string } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const all = await getPublishedPosts(100);
  const categories = Array.from(new Set(all.map((p) => p.category))).sort();
  const active = searchParams.category && categories.includes(searchParams.category) ? searchParams.category : null;
  const posts = active ? all.filter((p) => p.category === active) : all;

  const chip = (label: string, href: string, on: boolean) => (
    <Link
      key={label}
      href={href}
      aria-current={on ? 'page' : undefined}
      className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
        on ? 'bg-navy text-white dark:bg-heading dark:text-navy-deep' : 'border border-line text-heading hover:bg-surface-2'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
    <PageHero eyebrow={t.blog.eyebrow} title={t.blog.title} subtitle={t.blog.subtitle} image="/images/gallery/bali-waterfall.jpg" position="center 35%" />
    <section className="container pb-8 pt-12">

      {categories.length > 1 && (
        <nav aria-label="Categories" className="mb-8 flex flex-wrap gap-2">
          {chip(t.blog.all, `/${locale}/blog`, !active)}
          {categories.map((cat) => chip(cat, `/${locale}/blog?category=${encodeURIComponent(cat)}`, active === cat))}
        </nav>
      )}

      {posts.length === 0 ? (
        <p className="card p-10 text-center text-muted">{t.blog.empty}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} locale={locale} t={t} />
          ))}
        </div>
      )}
    </section>
    </>
  );
}

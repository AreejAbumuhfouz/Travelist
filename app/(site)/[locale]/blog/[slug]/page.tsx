import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { formatDate, getDict, type Locale } from '@/lib/i18n';
import { getPublishedPostBySlug, getPublishedPosts, localized, readingMinutes } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import { PostCard, PostCover } from '@/components/post-card';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const post = await getPublishedPostBySlug(decodeURIComponent(params.slug));
  if (!post) return {};
  const p = localized(post, params.locale);
  return { title: p.title, description: p.excerpt, openGraph: post.coverImage ? { images: [post.coverImage] } : undefined };
}

export default async function PostPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const post = await getPublishedPostBySlug(decodeURIComponent(params.slug));
  if (!post) notFound();
  const p = localized(post, locale);
  const related = (await getPublishedPosts(4)).filter((x) => x.id !== post.id).slice(0, 3);
  const date = post.publishedAt ?? post.createdAt;

  return (
    <>
      <article className="container max-w-3xl pb-10 pt-8 md:pt-12">
        <Link href={`/${locale}/blog`} className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-orange-ink">
          <ArrowLeft size={16} className="rtl:rotate-180" aria-hidden="true" />
          {t.blog.back}
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="rounded-full bg-orange/15 px-2.5 py-0.5 font-medium text-orange-ink">{post.category}</span>
          <time dateTime={new Date(date).toISOString()}>{formatDate(date, locale)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" /> {readingMinutes(p.content)} {t.blog.minRead}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-extrabold leading-tight text-heading md:text-5xl">{p.title}</h1>
        {p.excerpt && <p className="mt-4 text-lg text-muted md:text-xl">{p.excerpt}</p>}
        <div className="my-8 aspect-[16/9] overflow-hidden rounded-[1.5rem]">
          <PostCover src={post.coverImage} alt={p.title} />
        </div>
        <div className="prose-tl" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />
      </article>

      {related.length > 0 && (
        <section className="container pt-10">
          <h2 className="mb-6 text-2xl font-bold text-heading">{t.home.latestTitle}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <PostCard key={r.id} post={r} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

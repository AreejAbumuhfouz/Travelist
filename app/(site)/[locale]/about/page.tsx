/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { getDict, type Locale } from '@/lib/i18n';
import { MEDIA_ORGS, getContent } from '@/lib/content';
import { getGallery } from '@/lib/gallery';
import { PageHero } from '@/components/page-hero';
import { ExhibitionList, GalleryGrid, PlatformCards, SectionHeading, StatsRow } from '@/components/sections';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: getDict(params.locale).nav.about };
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const [c, gallery] = await Promise.all([getContent(locale), getGallery()]);
  const paragraphs = c.about_body.split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={c.about_title} image="/images/gallery/london-leicester-square.jpg" position="center 62%" />
      <section className="container grid items-start gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-5 lg:sticky lg:top-28 lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-navy shadow-card">
            <img src={c.about_image || '/images/abdallah.jpg'} alt={locale === 'ar' ? 'عبدالله يعقوب الزيود' : 'Abdallah Yacoub Alzyoud'} className="h-full w-full object-cover" />
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-bold text-heading">{t.about.profileTitle}</h2>
            <dl className="grid gap-3 text-[15px]">
              {t.about.profile.map((r) => (
                <div key={r.k} className="grid grid-cols-[7.5rem_1fr] gap-3">
                  <dt className="text-muted">{r.k}</dt>
                  <dd className="font-medium text-heading">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-lg leading-relaxed text-muted">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <StatsRow c={c} t={t} />

          <h2 className="mt-6 text-2xl font-bold text-heading">{t.platforms.title}</h2>
          <PlatformCards c={c} t={t} />

          <h2 className="mt-6 text-2xl font-bold text-heading">{t.about.eventsTitle}</h2>
          <ExhibitionList locale={locale} columns={false} />

          <h2 className="mt-6 text-2xl font-bold text-heading">{t.about.mediaTitle}</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {MEDIA_ORGS.map((m) => (
              <li key={m.en} className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-orange dark:bg-surface-2">
                  <Newspaper size={18} aria-hidden="true" />
                </span>
                <span className="font-semibold text-heading">{m[locale]}</span>
              </li>
            ))}
          </ul>

          <Link href={`/${locale}/work-with-me`} className="btn-primary mt-4 self-start">
            {t.home.ctaWork}
            <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {gallery.length > 0 && (
        <section id="gallery" className="container scroll-mt-24 pt-10">
          <SectionHeading eyebrow={t.home.galleryEyebrow} title={t.home.galleryTitle} />
          <GalleryGrid items={gallery} locale={locale} featured={false} />
        </section>
      )}
    </>
  );
}

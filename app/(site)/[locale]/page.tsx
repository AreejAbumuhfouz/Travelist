/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowRight, BedDouble, Camera, ChevronDown, Download, Handshake, Megaphone, Mic, Play, Plane } from 'lucide-react';
import { getDict, type Locale } from '@/lib/i18n';
import { AUDIENCE, DESTINATIONS, PARTNER_NAMES, TOP_CONTENT, getContent } from '@/lib/content';
import { getPublishedPosts } from '@/lib/posts';
import { getGallery } from '@/lib/gallery';
import { PostCard } from '@/components/post-card';
import { ExhibitionList, GalleryGrid, PlatformCards, SectionHeading } from '@/components/sections';

const serviceIcons = [Plane, BedDouble, Camera, Megaphone, Mic, Handshake];

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const [c, posts, gallery] = await Promise.all([getContent(locale), getPublishedPosts(3), getGallery(9)]);
  const name = locale === 'ar' ? 'عبدالله يعقوب الزيود' : 'Abdallah Yacoub Alzyoud';
  const stats = [
    { v: c.stat_followers, l: t.stats.followers },
    { v: c.stat_views, l: t.stats.views },
    { v: c.stat_million, l: t.stats.million },
  ];

  return (
    <>
      {/* Hero — full-bleed photo */}
      <section className="relative isolate -mt-px overflow-hidden bg-navy-deep">
        <img src={c.hero_image || '/images/gallery/bali-lempuyang-gate.jpg'} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container flex flex-col justify-end gap-8 pb-10 pt-24 md:min-h-[calc(100svh-5rem)] md:pb-14 md:pt-28">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <div className="glass flex items-center gap-3 rounded-full py-1.5 pe-4 ps-1.5">
              <img src="/images/abdallah.jpg" alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-orange" />
              <span className="text-sm font-semibold text-white">{name}</span>
              <span className="text-sm text-white/70" dir="ltr">
                @travelist_2
              </span>
            </div>
            <h1 className="text-shadow text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">{c.hero_title}</h1>
            <p className="text-shadow max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">{c.hero_subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/work-with-me`} className="btn-primary h-14 px-7 text-base">
                {t.home.ctaWork}
                <ArrowRight size={19} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
              {c.media_kit_url && (
                <a href={c.media_kit_url} target="_blank" rel="noopener" className="btn glass h-14 px-7 text-base text-white hover:bg-white/20">
                  <Download size={19} aria-hidden="true" />
                  {t.home.mediaKit}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/20 pt-6 md:flex-row md:items-end md:justify-between">
            <dl className="grid grid-cols-3 gap-4 sm:gap-10">
              {stats.map((s) => (
                <div key={s.l} className="flex flex-col">
                  <dt className="order-2 text-xs leading-snug text-white/70 sm:text-sm">{s.l}</dt>
                  <dd className="order-1 text-3xl font-extrabold text-white sm:text-5xl" dir="ltr">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
            <a href="#platforms" className="hidden items-center gap-2 text-sm font-medium text-white/75 hover:text-white md:inline-flex">
              {t.home.scroll}
              <ChevronDown size={18} className="animate-bounce motion-reduce:animate-none" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Destinations ticker */}
      <div className="overflow-hidden bg-orange py-4 text-navy-deep" aria-hidden="true">
        <div className="marquee-track flex gap-10 whitespace-nowrap text-lg font-extrabold uppercase tracking-wider rtl:tracking-normal">
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="flex items-center gap-10">
              {d[locale]}
              <span className="h-2 w-2 rounded-full bg-navy-deep" />
            </span>
          ))}
        </div>
      </div>

      {/* Platforms + partners */}
      <section id="platforms" className="container scroll-mt-24 py-16">
        <PlatformCards c={c} t={t} />
        <div className="mt-10 flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted rtl:tracking-normal">{t.home.partnersTitle}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3" dir="ltr">
            {PARTNER_NAMES.map((p) => (
              <li key={p} className="text-2xl font-extrabold tracking-tight text-heading/60 transition-colors hover:text-heading">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Top content — reel cards */}
      <section className="bg-navy-deep py-20 text-white md:py-24">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange rtl:text-sm rtl:tracking-normal">{t.home.reelsEyebrow}</span>
              <h2 className="text-balance text-3xl font-extrabold md:text-4xl">{t.home.reelsTitle}</h2>
            </div>
            <a href={c.instagram_url} target="_blank" rel="noopener noreferrer" className="btn border border-white/25 text-white hover:bg-white/10">
              {t.home.reelsCta}
              <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TOP_CONTENT.map((x, i) => (
              <li key={x.title.en}>
                <a
                  href={c.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-[1.5rem] p-4 sm:p-5"
                  style={{
                    background: x.image
                      ? undefined
                      : [
                          'linear-gradient(160deg,#F08335 0%,#c2551a 100%)',
                          'linear-gradient(160deg,#24497a 0%,#0E1F36 100%)',
                          'linear-gradient(160deg,#183153 0%,#F08335 140%)',
                          'linear-gradient(160deg,#2c5a8f 0%,#13284a 100%)',
                        ][i % 4],
                  }}
                >
                  {x.image ? (
                    <>
                      <img src={x.image} alt="" className="absolute inset-0 -z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" aria-hidden="true" />
                    </>
                  ) : (
                    <img src="/brand/logo-icon-dark.png" alt="" className="pointer-events-none absolute -bottom-6 -end-6 w-3/4 opacity-15" aria-hidden="true" />
                  )}
                  <span className="relative z-10 inline-flex w-fit items-center rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {x.kind[locale]}
                  </span>
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center self-center rounded-full bg-white/90 text-navy-deep shadow-lg transition-transform group-hover:scale-110">
                    <Play size={24} className="ms-1 fill-current" aria-hidden="true" />
                  </span>
                  <span className="relative z-10 flex flex-col gap-1">
                    <span className="text-3xl font-extrabold leading-none sm:text-4xl" dir="ltr">
                      {x.views}
                    </span>
                    <span className="text-xs text-white/80">{t.home.views}</span>
                    <span className="mt-2 font-semibold leading-snug">{x.title[locale]}</span>
                    <span className="text-xs text-white/70">{x.note[locale]}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Audience snapshot */}
          <div className="mt-14 grid gap-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8 lg:grid-cols-[1.2fr_2fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold">{t.home.audienceTitle}</h3>
              <Link href={`/${locale}/work-with-me`} className="inline-flex items-center gap-2 font-semibold text-orange hover:text-white">
                {t.home.audienceCta}
                <ArrowRight size={17} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { v: AUDIENCE.arabic, l: t.work.audienceArabic },
                { v: AUDIENCE.ages, l: t.work.audienceAges },
                { v: AUDIENCE.women, l: locale === 'ar' ? 'من النساء' : 'Women' },
                { v: `${AUDIENCE.markets[0].value}%`, l: AUDIENCE.markets[0].name[locale] },
              ].map((s) => (
                <div key={s.l} className="flex flex-col">
                  <dt className="order-2 text-sm text-white/70">{s.l}</dt>
                  <dd className="order-1 text-3xl font-extrabold text-white" dir="ltr">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-20 md:py-24">
        <SectionHeading eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} />
        <ul className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {t.services.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <li key={s.t} className="group flex flex-col gap-4 bg-surface p-7 transition-colors hover:bg-surface-2/60">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/15 text-orange-ink transition-colors group-hover:bg-orange group-hover:text-navy-deep">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-muted/60" dir="ltr">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-heading">{s.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{s.d}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="container pb-20 md:pb-24">
          <SectionHeading eyebrow={t.home.galleryEyebrow} title={t.home.galleryTitle}>
            <Link href={`/${locale}/about#gallery`} className="btn-ghost">
              {t.home.viewGallery}
              <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </SectionHeading>
          <GalleryGrid items={gallery} locale={locale} limit={9} />
        </section>
      )}

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="bg-surface-2/60 py-20 md:py-24">
          <div className="container">
            <SectionHeading eyebrow={t.home.latestEyebrow} title={t.home.latestTitle}>
              <Link href={`/${locale}/blog`} className="btn-ghost">
                {t.home.viewAll}
                <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
            </SectionHeading>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Exhibitions */}
      <section className="container py-20 md:py-24">
        <SectionHeading eyebrow={t.home.eventsEyebrow} title={t.home.eventsTitle} />
        <ExhibitionList locale={locale} />
      </section>

      {/* CTA with photo */}
      <section className="container">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-deep">
          <img src="/images/gallery/bali-kelingking.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
          <div className="flex flex-col items-start gap-6 px-6 py-16 sm:px-12 md:py-24">
            <h2 className="text-shadow max-w-2xl text-balance text-3xl font-extrabold leading-tight text-white md:text-5xl">{t.home.ctaTitle}</h2>
            <p className="text-shadow max-w-xl text-lg text-white/85">{t.home.ctaText}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/contact`} className="btn-primary h-14 px-7 text-base">
                {t.work.ctaContact}
                <ArrowRight size={19} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
              {c.media_kit_url && (
                <a href={c.media_kit_url} target="_blank" rel="noopener" className="btn glass h-14 px-7 text-base text-white hover:bg-white/20">
                  <Download size={19} aria-hidden="true" />
                  {t.home.mediaKit}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

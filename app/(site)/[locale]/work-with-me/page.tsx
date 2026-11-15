import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BedDouble, Camera, Download, Handshake, Landmark, Mic, Plane, Target } from 'lucide-react';
import { getDict, type Locale } from '@/lib/i18n';
import { AUDIENCE, PROGRAMS, TOP_CONTENT, getContent } from '@/lib/content';
import { SectionHeading, StatsRow } from '@/components/sections';
import { PageHero } from '@/components/page-hero';
import { waLink } from '@/components/footer';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: getDict(params.locale).nav.work };
}

const areaIcons = [BedDouble, Plane, Landmark, Camera, Mic, Handshake];

export default async function WorkWithMePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const w = t.work;
  const c = await getContent(locale);
  const maxMarket = Math.max(...AUDIENCE.markets.map((m) => m.value));

  return (
    <>
      <PageHero eyebrow={w.eyebrow} title={w.title} subtitle={w.subtitle} image="/images/gallery/istanbul-ortakoy.jpg" position="center 40%">
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/${locale}/contact`} className="btn-primary h-14 px-7 text-base">
            {w.ctaContact}
            <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
          </Link>
          {c.media_kit_url && (
            <a href={c.media_kit_url} target="_blank" rel="noopener" className="btn glass h-14 px-7 text-base text-white hover:bg-white/20">
              <Download size={18} aria-hidden="true" />
              {t.home.mediaKit}
            </a>
          )}
        </div>
      </PageHero>
      <section className="container -mt-8 pb-16 md:-mt-10">
        <StatsRow c={c} t={t} className="relative z-10 max-w-3xl shadow-card" />
      </section>

      {/* Areas */}
      <section className="container pb-20">
        <SectionHeading eyebrow={w.eyebrow} title={w.areasTitle} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {w.areas.map((a, i) => {
            const Icon = areaIcons[i];
            return (
              <li key={a.t} className="card flex flex-col gap-4 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-orange dark:bg-surface-2">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-heading">{a.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{a.d}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Audience */}
      <section className="bg-surface-2/60 py-20">
        <div className="container">
          <SectionHeading eyebrow={w.audienceEyebrow} title={w.audienceTitle} />
          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1">
              {[
                { v: AUDIENCE.arabic, l: w.audienceArabic },
                { v: AUDIENCE.ages, l: w.audienceAges },
                { v: `${AUDIENCE.women} / ${AUDIENCE.men}`, l: w.audienceGender },
              ].map((s) => (
                <div key={s.l} className="card flex flex-col gap-1 p-4 sm:p-6">
                  <dt className="order-2 text-sm text-muted">{s.l}</dt>
                  <dd className="order-1 text-xl font-extrabold text-heading sm:text-3xl" dir="ltr">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="card p-6">
              <h3 className="mb-5 font-bold text-heading">{w.audienceMarkets}</h3>
              <ul className="flex flex-col gap-4">
                {AUDIENCE.markets.map((m) => (
                  <li key={m.name.en} className="grid grid-cols-[7rem_1fr_3.5rem] items-center gap-3">
                    <span className="text-[15px] font-medium text-heading">{m.name[locale]}</span>
                    <span className="h-3 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                      <span className="block h-full rounded-full bg-orange" style={{ width: `${(m.value / maxMarket) * 100}%` }} />
                    </span>
                    <span className="text-end text-sm font-semibold text-heading" dir="ltr">
                      {m.value}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">{w.audienceSource}</p>

          <h3 className="mb-5 mt-14 text-2xl font-bold text-heading">{w.topTitle}</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOP_CONTENT.map((x) => (
              <li key={x.title.en} className="card flex flex-col gap-2 p-5">
                <span className="text-3xl font-extrabold text-heading" dir="ltr">
                  {x.views}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-ink">{x.kind[locale]}</span>
                <span className="font-semibold text-heading">{x.title[locale]}</span>
                <span className="text-sm text-muted">{x.note[locale]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">{w.topSource}</p>
        </div>
      </section>

      {/* Programs */}
      <section className="container py-20">
        <SectionHeading eyebrow={t.home.partnersTitle} title={w.programsTitle} />
        <ul className="grid gap-4 md:grid-cols-2">
          {PROGRAMS.map((p) => (
            <li key={p.name} className="card flex flex-col gap-2 p-6">
              <h3 className="text-xl font-bold text-heading" dir="auto">
                {p.name === 'Hotels & restaurants' && locale === 'ar' ? 'الفنادق والمطاعم' : p.name}
              </h3>
              <p className="text-muted">{p.desc[locale]}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Goal + CTA */}
      <section className="container">
        <div className="grid gap-8 rounded-[2rem] bg-navy px-6 py-12 text-white sm:px-12 md:py-14 lg:grid-cols-[1.3fr_1fr] dark:bg-surface-2">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange">
              <Target size={18} aria-hidden="true" /> {w.goalTitle}
            </span>
            <p className="text-2xl font-bold leading-snug text-white dark:text-heading">{w.goal}</p>
            <p className="text-white/75 dark:text-muted">{w.approach}</p>
            <p className="text-white/75 dark:text-muted">{w.availability}</p>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Link href={`/${locale}/contact`} className="btn-primary">
              {w.ctaContact}
              <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
            </Link>
            {c.contact_phone && (
              <a href={waLink(c.contact_phone)} target="_blank" rel="noopener noreferrer" className="btn border border-white/30 text-white hover:bg-white/10 dark:border-line dark:text-heading">
                {t.contact.whatsapp} · <span dir="ltr">{c.contact_phone}</span>
              </a>
            )}
            {c.contact_email && (
              <a href={`mailto:${c.contact_email}`} className="btn border border-white/30 text-white hover:bg-white/10 dark:border-line dark:text-heading">
                <span className="truncate">{c.contact_email}</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

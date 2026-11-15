import type { Metadata } from 'next';
import { Download, Mail, MessageCircle, Phone } from 'lucide-react';
import { getDict, type Locale } from '@/lib/i18n';
import { getContent } from '@/lib/content';
import { SocialLinks } from '@/components/footer';
import { ContactForm } from './contact-form';
import { PageHero } from '@/components/page-hero';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: getDict(params.locale).nav.contact };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const c = await getContent(locale);
  const wa = c.contact_phone.replace(/\D/g, '');

  return (
    <>
    <PageHero eyebrow={t.contact.eyebrow} title={t.contact.title} subtitle={t.contact.subtitle} image="/images/gallery/amman-airport.jpg" position="center 30%" />
    <section className="container grid gap-10 pb-8 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="flex flex-col gap-6">

        <ul className="flex flex-col gap-3">
          {wa && (
            <li>
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-4 transition-colors hover:border-orange">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C4B] dark:text-[#4ade80]">
                  <MessageCircle size={22} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold text-heading">{t.contact.whatsapp}</span>
                  <span className="text-muted" dir="ltr">{c.contact_phone}</span>
                </span>
              </a>
            </li>
          )}
          {c.contact_phone && (
            <li>
              <a href={`tel:+${wa}`} className="card flex items-center gap-4 p-4 transition-colors hover:border-orange">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-orange dark:bg-surface-2">
                  <Phone size={21} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold text-heading">{t.contact.call}</span>
                  <span className="text-muted" dir="ltr">{c.contact_phone}</span>
                </span>
              </a>
            </li>
          )}
          {c.contact_email && (
            <li>
              <a href={`mailto:${c.contact_email}`} className="card flex items-center gap-4 p-4 transition-colors hover:border-orange">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-orange dark:bg-surface-2">
                  <Mail size={21} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold text-heading">{t.contact.emailLabel}</span>
                  <span className="break-all text-muted">{c.contact_email}</span>
                </span>
              </a>
            </li>
          )}
        </ul>

        <div className="flex flex-col gap-3">
          <p className="font-semibold text-heading">{t.contact.follow}</p>
          <SocialLinks c={c} />
        </div>
        {c.media_kit_url && (
          <a href={c.media_kit_url} target="_blank" rel="noopener" className="btn-ghost self-start">
            <Download size={18} aria-hidden="true" /> {t.home.mediaKit}
          </a>
        )}
      </div>

      <ContactForm t={t.contact} />
    </section>
    </>
  );
}

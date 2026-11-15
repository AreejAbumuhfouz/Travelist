import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../../globals.css';
import { dir, getDict, isLocale, type Locale } from '@/lib/i18n';
import { getContent } from '@/lib/content';
import { themeScript } from '@/components/theme';
import { BottomNav, Header } from '@/components/site-nav';
import { Footer } from '@/components/footer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = (isLocale(params.locale) ? params.locale : 'en') as Locale;
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(site),
    title: {
      default: l === 'ar' ? 'Travelist_2 | عبدالله يعقوب الزيود – صانع محتوى سياحي' : 'Travelist_2 | Abdallah Yacoub Alzyoud – Travel Content Creator',
      template: '%s | Travelist_2',
    },
    description:
      l === 'ar'
        ? 'صانع محتوى سياحي أردني: وجهات وفنادق وتجارب سفر، وتعاونات مع علامات سفر عالمية. أكثر من 290 ألف متابع.'
        : 'Jordanian travel content creator: destinations, hotels and travel experiences, plus brand and tourism collaborations. 290K+ followers across Instagram, Facebook and Threads.',
    alternates: { languages: { en: '/en', ar: '/ar' } },
    openGraph: { siteName: 'Travelist', images: ['/brand/logo-full.png'] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1524' },
  ],
};

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const t = getDict(locale);
  const c = await getContent(locale);

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen overflow-x-clip pb-20 md:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-orange focus:px-4 focus:py-2 focus:text-navy-deep">
          Skip to content
        </a>
        <Header locale={locale} t={t} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t} c={c} />
        <BottomNav locale={locale} t={t} />
      </body>
    </html>
  );
}

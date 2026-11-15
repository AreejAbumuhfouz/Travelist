import type { Metadata } from 'next';
import '../globals.css';
import { themeScript } from '@/components/theme';

export const metadata: Metadata = {
  title: { default: 'Admin | Travelist', template: '%s | Travelist Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

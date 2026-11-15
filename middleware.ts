import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from './lib/auth';
import { defaultLocale, isLocale } from './lib/i18n';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: everything except the login page needs a valid session
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Public site: make sure every path starts with a locale (/en or /ar)
  const first = pathname.split('/')[1];
  if (isLocale(first)) {
    const res = NextResponse.next();
    res.cookies.set('locale', first, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return res;
  }

  const saved = req.cookies.get('locale')?.value;
  const locale = isLocale(saved) ? saved : defaultLocale;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|brand|images|media-kit|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)'],
};

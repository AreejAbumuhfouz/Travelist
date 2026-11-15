import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySession } from './auth';

export async function getSession() {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin server action and page. */
export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect('/admin/login');
  return s;
}

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { LogoFull } from '@/components/logo';
import { ThemeToggle } from '@/components/theme';
import { LoginForm } from './login-form';

export const metadata = { title: 'Sign in' };

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute end-4 top-4">
        <ThemeToggle labels={{ light: 'Light mode', dark: 'Dark mode' }} />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoFull className="h-28 w-auto" />
        </div>
        <div className="card p-6 sm:p-8">
          <h1 className="mb-1 text-2xl font-bold text-heading">Admin sign in</h1>
          <p className="mb-6 text-sm text-muted">Manage blog posts, site content and messages.</p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <a href="/en" className="hover:text-orange-ink">← Back to website</a>
        </p>
      </div>
    </main>
  );
}

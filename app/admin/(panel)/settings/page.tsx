import { requireAdmin } from '@/lib/session';
import { PageHeader } from '@/components/admin/ui';
import { PasswordForm } from './password-form';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const s = await requireAdmin();
  return (
    <>
      <PageHeader title="Settings" description={`Signed in as ${s.email}`} />
      <section className="card max-w-lg p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-heading">Change password</h2>
        <PasswordForm />
      </section>
    </>
  );
}

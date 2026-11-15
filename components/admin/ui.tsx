import Link from 'next/link';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-heading md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ children, tone = 'success' }: { children: React.ReactNode; tone?: 'success' | 'info' }) {
  return (
    <p
      role="status"
      className={`mb-6 rounded-xl p-4 text-sm font-medium ${
        tone === 'success' ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'bg-orange/15 text-orange-ink'
      }`}
    >
      {children}
    </p>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        published ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' : 'bg-surface-2 text-muted'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-emerald-600' : 'bg-muted'}`} aria-hidden="true" />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

export function LinkButton({ href, children, variant = 'navy' }: { href: string; children: React.ReactNode; variant?: 'navy' | 'ghost' | 'primary' }) {
  const cls = variant === 'navy' ? 'btn-navy' : variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

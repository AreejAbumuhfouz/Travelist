import { Mail, MailOpen, MessageCircle, Trash2 } from 'lucide-react';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { PageHeader } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteMessage, setMessageRead } from '../../actions';

export const metadata = { title: 'Messages' };

type Msg = { id: number; name: string; email: string; phone: string | null; subject: string; body: string; read: boolean; created_at: Date };

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await query<Msg>('SELECT id, name, email, phone, subject, body, read, created_at FROM messages ORDER BY created_at DESC LIMIT 200');
  const fmt = (d: Date) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d));

  return (
    <>
      <PageHeader title="Messages" description="Everything sent through the contact form on the website." />
      {messages.length === 0 ? (
        <p className="card p-10 text-center text-muted">No messages yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {messages.map((m) => (
            <li key={m.id} className={`card p-5 ${m.read ? '' : 'border-orange/60'}`}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-bold text-heading">
                    {!m.read && <span className="h-2.5 w-2.5 rounded-full bg-orange" aria-label="Unread" />}
                    {m.name}
                  </p>
                  <p className="text-sm text-muted">
                    <a href={`mailto:${m.email}`} className="hover:text-orange-ink">{m.email}</a>
                    {m.phone && <> · <span dir="ltr">{m.phone}</span></>}
                  </p>
                </div>
                <time className="text-xs text-muted">{fmt(m.created_at)}</time>
              </div>
              {m.subject && <p className="mb-1 font-semibold text-heading">{m.subject}</p>}
              <p className="whitespace-pre-line text-ink" dir="auto">{m.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message'))}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-navy px-4 text-sm font-medium text-white dark:bg-heading dark:text-navy-deep">
                  <Mail size={15} aria-hidden="true" /> Reply
                </a>
                {m.phone && (
                  <a href={`https://wa.me/${m.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-heading hover:bg-surface-2">
                    <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                  </a>
                )}
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={String(!m.read)} />
                  <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-heading hover:bg-surface-2">
                    <MailOpen size={15} aria-hidden="true" /> {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <DeleteButton compact confirmText="Delete message?">
                    <Trash2 size={15} aria-hidden="true" /> Delete
                  </DeleteButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

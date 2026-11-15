'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { CheckCircle2, Send } from 'lucide-react';
import type { Dict } from '@/lib/i18n';
import { sendMessage, type ContactState } from './actions';

function Submit({ t }: { t: Dict['contact'] }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
      {pending ? t.sending : t.send}
      <Send size={17} className="rtl:-scale-x-100" aria-hidden="true" />
    </button>
  );
}

export function ContactForm({ t }: { t: Dict['contact'] }) {
  const [state, action] = useFormState<ContactState, FormData>(sendMessage, { status: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="card flex flex-col gap-5 p-6 sm:p-8" noValidate>
      {state.status === 'success' && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden="true" /> {t.success}
        </p>
      )}
      {(state.status === 'invalid' || state.status === 'error') && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-800 dark:text-red-300">
          {state.status === 'invalid' ? t.error : t.failed}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">{t.name}</label>
          <input id="name" name="name" required autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="label">{t.email}</label>
          <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className="field rtl:text-right" />
        </div>
        <div>
          <label htmlFor="phone" className="label">{t.phone}</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" dir="ltr" className="field rtl:text-right" />
        </div>
        <div>
          <label htmlFor="subject" className="label">{t.subject}</label>
          <input id="subject" name="subject" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">{t.message}</label>
        <textarea id="message" name="message" required rows={6} className="field resize-y" />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Submit t={t} />
    </form>
  );
}

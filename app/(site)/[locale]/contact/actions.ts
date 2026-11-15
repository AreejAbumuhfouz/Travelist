'use server';

import { query } from '@/lib/db';

export type ContactState = { status: 'idle' | 'success' | 'invalid' | 'error' };

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').trim().slice(0, max);

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field
  if (clean(form.get('website'), 200)) return { status: 'success' };

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200);
  const phone = clean(form.get('phone'), 40);
  const subject = clean(form.get('subject'), 200);
  const body = clean(form.get('message'), 5000);

  if (!name || !body || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: 'invalid' };

  try {
    await query('INSERT INTO messages (name, email, phone, subject, body) VALUES ($1,$2,$3,$4,$5)', [name, email, phone || null, subject, body]);
    return { status: 'success' };
  } catch (e) {
    console.error('[contact]', (e as Error).message);
    return { status: 'error' };
  }
}

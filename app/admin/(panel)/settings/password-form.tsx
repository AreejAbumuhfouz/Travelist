'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { changePassword, type PasswordState } from '../../actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-navy self-start">
      {pending ? 'Saving…' : 'Update password'}
    </button>
  );
}

export function PasswordForm() {
  const [state, action] = useFormState<PasswordState, FormData>(changePassword, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-4">
      {state.error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-300">{state.error}</p>}
      {state.ok && <p role="status" className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">Password updated.</p>}
      <div>
        <label htmlFor="current" className="label">Current password</label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className="field" />
      </div>
      <div>
        <label htmlFor="next" className="label">New password</label>
        <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </div>
      <div>
        <label htmlFor="confirm" className="label">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </div>
      <Submit />
    </form>
  );
}

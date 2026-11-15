'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { LogIn } from 'lucide-react';
import { login, type LoginState } from '../actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-navy w-full">
      {pending ? 'Signing in…' : 'Sign in'}
      <LogIn size={17} aria-hidden="true" />
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-300">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      <Submit />
    </form>
  );
}

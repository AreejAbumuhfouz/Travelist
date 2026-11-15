'use client';

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch('/api/media', { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url as string;
}

/** A URL field with an Upload button and a preview. Submits as a normal form input. */
export function ImageField({ name, label, defaultValue = '' }: { name: string; label: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setError('');
    try {
      setUrl(await uploadImage(f));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <div className="flex flex-col gap-3">
        {url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-surface-2">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setUrl('')}
              aria-label="Remove image"
              className="absolute end-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep/80 text-white"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input id={name} name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… or upload" className="field" dir="ltr" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="btn-ghost shrink-0 px-4">
            {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={18} aria-hidden="true" />}
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
      </div>
    </div>
  );
}

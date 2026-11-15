'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ImagePlus, Loader2, Save } from 'lucide-react';
import { ImageField, uploadImage } from './image-upload';

export type PostFormValues = {
  id?: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  coverImage: string | null;
  category: string;
  published: boolean;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
      {pending ? 'Saving…' : 'Save post'}
    </button>
  );
}

function LangPanel({ lang, v, hidden }: { lang: 'en' | 'ar'; v: PostFormValues; hidden: boolean }) {
  const ar = lang === 'ar';
  const suffix = ar ? 'Ar' : 'En';
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const insertImage = async (f?: File) => {
    if (!f || !contentRef.current) return;
    setBusy(true);
    setErr('');
    try {
      const url = await uploadImage(f);
      const el = contentRef.current;
      const at = el.selectionStart ?? el.value.length;
      const snippet = `\n\n![](${url})\n\n`;
      el.value = el.value.slice(0, at) + snippet + el.value.slice(at);
      el.focus();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className={hidden ? 'hidden' : 'flex flex-col gap-5'} lang={lang} dir={ar ? 'rtl' : 'ltr'}>
      <div>
        <label htmlFor={`title${suffix}`} className="label">{ar ? 'العنوان' : 'Title'}</label>
        <input id={`title${suffix}`} name={`title${suffix}`} defaultValue={ar ? v.titleAr : v.titleEn} className="field text-lg font-semibold" />
      </div>
      <div>
        <label htmlFor={`excerpt${suffix}`} className="label">{ar ? 'وصف مختصر (يظهر في البطاقات ونتائج البحث)' : 'Short summary (shown on cards and in search results)'}</label>
        <textarea id={`excerpt${suffix}`} name={`excerpt${suffix}`} rows={2} defaultValue={ar ? v.excerptAr : v.excerptEn} className="field" />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor={`content${suffix}`} className="label mb-0">{ar ? 'المحتوى' : 'Content'}</label>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-heading hover:bg-surface-2">
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={15} aria-hidden="true" />}
            {ar ? 'إدراج صورة' : 'Insert image'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => insertImage(e.target.files?.[0])} />
        </div>
        <textarea
          ref={contentRef}
          id={`content${suffix}`}
          name={`content${suffix}`}
          rows={18}
          defaultValue={ar ? v.contentAr : v.contentEn}
          className="field font-mono text-[14px] leading-6"
        />
        {err && <p role="alert" className="mt-1 text-sm text-red-700 dark:text-red-300">{err}</p>}
        <p className="mt-2 text-xs leading-5 text-muted" dir="ltr">
          Formatting: <code>## Heading</code> · <code>### Subheading</code> · <code>**bold**</code> · <code>- list item</code> · <code>1. step</code> ·{' '}
          <code>&gt; quote</code> · <code>[link](https://…)</code> · leave an empty line between paragraphs.
        </p>
      </div>
    </div>
  );
}

export function PostForm({ action, values }: { action: (f: FormData) => void; values: PostFormValues }) {
  const [tab, setTab] = useState<'en' | 'ar'>('en');
  const tabs = [
    { id: 'en' as const, label: 'English' },
    { id: 'ar' as const, label: 'العربية' },
  ];

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <div className="card p-5 sm:p-6">
        <div role="tablist" aria-label="Language" className="mb-6 inline-flex rounded-full bg-surface-2 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`h-10 rounded-full px-5 text-sm font-semibold transition-colors ${tab === t.id ? 'bg-surface text-heading shadow-card' : 'text-muted'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <LangPanel lang="en" v={values} hidden={tab !== 'en'} />
        <LangPanel lang="ar" v={values} hidden={tab !== 'ar'} />
      </div>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
        <div className="card flex flex-col gap-5 p-5">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span>
              <span className="block font-semibold text-heading">Published</span>
              <span className="text-sm text-muted">Visible on the website</span>
            </span>
            <input type="checkbox" name="published" defaultChecked={values.published} className="h-6 w-6 accent-[#F08335]" />
          </label>
          <SaveButton />
        </div>
        <div className="card flex flex-col gap-5 p-5">
          <ImageField name="coverImage" label="Cover image" defaultValue={values.coverImage ?? ''} />
          <div>
            <label htmlFor="category" className="label">Category</label>
            <input id="category" name="category" list="categories" defaultValue={values.category} className="field" />
            <datalist id="categories">
              <option value="Destinations" />
              <option value="Tips" />
              <option value="Events" />
              <option value="Partnerships" />
            </datalist>
          </div>
          <div>
            <label htmlFor="slug" className="label">URL slug</label>
            <input id="slug" name="slug" defaultValue={values.slug} placeholder="auto from English title" className="field" dir="ltr" />
            <p className="mt-1 text-xs text-muted">The link will be /blog/your-slug</p>
          </div>
        </div>
      </aside>
    </form>
  );
}

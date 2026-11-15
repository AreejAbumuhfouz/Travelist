import { Save } from 'lucide-react';
import { requireAdmin } from '@/lib/session';
import { CONTENT_FIELDS, getAllContentRows } from '@/lib/content';
import { Notice, PageHeader } from '@/components/admin/ui';
import { ImageField } from '@/components/admin/image-upload';
import { saveContent } from '../../actions';

export const metadata = { title: 'Website content' };

export default async function ContentPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requireAdmin();
  const rows = await getAllContentRows();
  const saved = new Map(rows.map((r) => [r.key, r]));
  const groups = Array.from(new Set(CONTENT_FIELDS.map((f) => f.group)));

  return (
    <>
      <PageHeader title="Website content" description="Edit the text and numbers on the Home, About, Work with me and Contact pages. Arabic fields are shown right-to-left." />
      {searchParams.saved && <Notice>Content saved. The website is updated.</Notice>}

      <form action={saveContent} className="flex flex-col gap-6">
        {groups.map((g) => (
          <fieldset key={g} className="card p-5 sm:p-6">
            <legend className="sr-only">{g}</legend>
            <h2 className="mb-5 text-lg font-bold text-heading">{g}</h2>
            <div className="flex flex-col gap-6">
              {CONTENT_FIELDS.filter((f) => f.group === g).map((f) => {
                const row = saved.get(f.key);
                const en = row?.value_en ?? f.en;
                const ar = row?.value_ar ?? f.ar;
                if (f.shared && f.key.endsWith('_image')) {
                  return <ImageField key={f.key} name={`${f.key}__en`} label={f.label.replace(' URL', '')} defaultValue={en} />;
                }
                if (f.shared) {
                  return (
                    <div key={f.key}>
                      <label htmlFor={`${f.key}__en`} className="label">{f.label}</label>
                      <input id={`${f.key}__en`} name={`${f.key}__en`} defaultValue={en} className="field" dir="ltr" />
                    </div>
                  );
                }
                const Input = f.multiline ? 'textarea' : 'input';
                return (
                  <div key={f.key} className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor={`${f.key}__en`} className="label">{f.label} · English</label>
                      <Input id={`${f.key}__en`} name={`${f.key}__en`} defaultValue={en} rows={f.multiline ? 8 : undefined} className="field" />
                    </div>
                    <div lang="ar" dir="rtl">
                      <label htmlFor={`${f.key}__ar`} className="label">{f.label} · العربية</label>
                      <Input id={`${f.key}__ar`} name={`${f.key}__ar`} defaultValue={ar} rows={f.multiline ? 8 : undefined} className="field" />
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className="sticky bottom-20 z-10 flex justify-end lg:bottom-6">
          <button type="submit" className="btn-primary shadow-card">
            <Save size={18} aria-hidden="true" /> Save all changes
          </button>
        </div>
      </form>
    </>
  );
}

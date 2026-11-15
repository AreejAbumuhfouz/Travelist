/* eslint-disable @next/next/no-img-element */
import { Plus, Save, Trash2 } from 'lucide-react';
import { requireAdmin } from '@/lib/session';
import { query } from '@/lib/db';
import { GALLERY_COLS, type GalleryItem } from '@/lib/gallery';
import { Notice, PageHeader } from '@/components/admin/ui';
import { ImageField } from '@/components/admin/image-upload';
import { DeleteButton } from '@/components/admin/delete-button';
import { addGalleryItem, deleteGalleryItem, updateGalleryItem } from '../../actions';

export const metadata = { title: 'Gallery' };

export default async function GalleryAdminPage({ searchParams }: { searchParams: { saved?: string; deleted?: string; error?: string } }) {
  await requireAdmin();
  const items = await query<GalleryItem>(`SELECT ${GALLERY_COLS} FROM gallery ORDER BY sort ASC, id ASC`);

  return (
    <>
      <PageHeader title="Gallery" description="Travel photos shown on the Home and About pages. The first photo is shown largest. Lower order numbers come first." />
      {searchParams.saved && <Notice>Gallery updated.</Notice>}
      {searchParams.deleted && <Notice>Photo removed.</Notice>}
      {searchParams.error && <Notice tone="info">Choose or upload an image first.</Notice>}

      <form action={addGalleryItem} className="card mb-8 grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
        <ImageField name="image" label="New photo" />
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="new-en" className="label">Caption · English</label>
            <input id="new-en" name="captionEn" placeholder="e.g. Kelingking Beach, Bali" className="field" />
          </div>
          <div lang="ar" dir="rtl">
            <label htmlFor="new-ar" className="label">الوصف · العربية</label>
            <input id="new-ar" name="captionAr" placeholder="مثال: شاطئ كلينكينغ، بالي" className="field" />
          </div>
          <button type="submit" className="btn-primary self-start">
            <Plus size={18} aria-hidden="true" /> Add to gallery
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="card p-10 text-center text-muted">No photos yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((g) => (
            <li key={g.id} className="card overflow-hidden">
              <img src={g.image} alt="" loading="lazy" className="aspect-[4/3] w-full bg-surface-2 object-cover" />
              <form action={updateGalleryItem} className="flex flex-col gap-3 p-4">
                <input type="hidden" name="id" value={g.id} />
                <div>
                  <label htmlFor={`en-${g.id}`} className="label">Caption · English</label>
                  <input id={`en-${g.id}`} name="captionEn" defaultValue={g.captionEn} className="field" />
                </div>
                <div lang="ar" dir="rtl">
                  <label htmlFor={`ar-${g.id}`} className="label">الوصف · العربية</label>
                  <input id={`ar-${g.id}`} name="captionAr" defaultValue={g.captionAr} className="field" />
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-24">
                    <label htmlFor={`sort-${g.id}`} className="label">Order</label>
                    <input id={`sort-${g.id}`} name="sort" type="number" defaultValue={g.sort} className="field" />
                  </div>
                  <button type="submit" className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy px-3 text-sm font-semibold text-white dark:bg-heading dark:text-navy-deep">
                    <Save size={16} aria-hidden="true" /> Save
                  </button>
                </div>
              </form>
              <form action={deleteGalleryItem} className="border-t border-line px-4 py-3">
                <input type="hidden" name="id" value={g.id} />
                <DeleteButton compact confirmText="">
                  <Trash2 size={15} aria-hidden="true" /> Remove
                </DeleteButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

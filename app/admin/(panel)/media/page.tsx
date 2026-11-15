/* eslint-disable @next/next/no-img-element */
import { Trash2 } from 'lucide-react';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { PageHeader } from '@/components/admin/ui';
import { DeleteButton } from '@/components/admin/delete-button';
import { MediaUploader, CopyUrl } from '@/components/admin/media-uploader';
import { deleteMedia } from '../../actions';

export const metadata = { title: 'Media' };

export default async function MediaPage() {
  await requireAdmin();
  const items = await query<{ id: string; filename: string; size: number; created_at: Date }>(
    'SELECT id, filename, size, created_at FROM media ORDER BY created_at DESC LIMIT 300',
  );

  return (
    <>
      <PageHeader title="Media library" description="Upload photos once and reuse them in posts and pages. JPG, PNG or WebP up to 5 MB." action={<MediaUploader />} />
      {items.length === 0 ? (
        <p className="card p-10 text-center text-muted">No images yet. Upload your first photo.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="card overflow-hidden">
              <div className="aspect-square bg-surface-2">
                <img src={`/api/media/${m.id}`} alt={m.filename} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-2 p-3">
                <p className="truncate text-sm font-medium text-heading" title={m.filename}>{m.filename}</p>
                <p className="text-xs text-muted">{Math.round(m.size / 1024)} KB</p>
                <div className="flex flex-wrap gap-2">
                  <CopyUrl url={`/api/media/${m.id}`} />
                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={m.id} />
                    <DeleteButton compact confirmText="">
                      <Trash2 size={15} aria-hidden="true" />
                      <span className="sr-only">Delete</span>
                    </DeleteButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

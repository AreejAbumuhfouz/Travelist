import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/session';
import { PageHeader } from '@/components/admin/ui';
import { PostForm } from '@/components/admin/post-form';
import { savePost } from '../../../actions';

export const metadata = { title: 'New post' };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-orange-ink">
        <ArrowLeft size={16} aria-hidden="true" /> All posts
      </Link>
      <PageHeader title="New post" />
      <PostForm
        action={savePost}
        values={{ slug: '', titleEn: '', titleAr: '', excerptEn: '', excerptAr: '', contentEn: '', contentAr: '', coverImage: null, category: 'Travel', published: false }}
      />
    </>
  );
}

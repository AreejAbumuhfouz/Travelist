import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { queryOne } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { POST_COLS, type Post } from '@/lib/posts';
import { PageHeader } from '@/components/admin/ui';
import { PostForm } from '@/components/admin/post-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { deletePost, savePost } from '../../../actions';

export const metadata = { title: 'Edit post' };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const post = await queryOne<Post>(`SELECT ${POST_COLS} FROM posts WHERE id = $1`, [id]);
  if (!post) notFound();

  return (
    <>
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-orange-ink">
        <ArrowLeft size={16} aria-hidden="true" /> All posts
      </Link>
      <PageHeader
        title="Edit post"
        action={
          <div className="flex gap-2">
            {post.published && (
              <a href={`/en/blog/${post.slug}`} target="_blank" className="btn-ghost h-11 px-4 text-sm">
                <ExternalLink size={16} aria-hidden="true" /> View
              </a>
            )}
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <DeleteButton confirmText="Delete this post permanently?">
                <Trash2 size={16} aria-hidden="true" /> Delete
              </DeleteButton>
            </form>
          </div>
        }
      />
      <PostForm action={savePost} values={post} />
    </>
  );
}

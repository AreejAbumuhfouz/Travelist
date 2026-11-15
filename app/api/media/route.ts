import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export async function POST(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Use a JPG, PNG, WebP, GIF or AVIF image.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image is larger than 5 MB.' }, { status: 400 });

  const data = Buffer.from(await file.arrayBuffer());
  const [row] = await query<{ id: string }>('INSERT INTO media (filename, mime, size, data) VALUES ($1,$2,$3,$4) RETURNING id', [
    file.name.slice(0, 200),
    file.type,
    file.size,
    data,
  ]);
  return NextResponse.json({ id: row.id, url: `/api/media/${row.id}` });
}

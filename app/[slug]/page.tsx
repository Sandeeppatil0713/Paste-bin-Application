import { notFound } from 'next/navigation';
import Link from 'next/link';
import CopyButtons from './CopyButtons';
import { getPaste } from '@/lib/db';

export default async function PastePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paste = await getPaste(slug);

  if (!paste) notFound();

  const createdAt = new Date(paste.created_at).toLocaleString();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl">

        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-zinc-400 text-sm hover:text-zinc-200 transition-colors">
            ← New paste
          </Link>
          <span className="text-xs text-zinc-500">{createdAt}</span>
        </div>

        {paste.title && (
          <h1 className="text-2xl font-bold mb-2 tracking-tight">{paste.title}</h1>
        )}

        <div className="flex gap-3 mb-4 text-xs text-zinc-400">
          <span className="bg-zinc-800 px-2 py-1 rounded">{paste.language}</span>
          {paste.expires_at && (
            <span className="bg-zinc-800 px-2 py-1 rounded">
              Expires {new Date(paste.expires_at).toLocaleString()}
            </span>
          )}
          {paste.max_views && (
            <span className="bg-zinc-800 px-2 py-1 rounded">
              {paste.view_count} / {paste.max_views} views
            </span>
          )}
        </div>

        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words">
          {paste.content}
        </pre>

        <CopyButtons content={paste.content} />

      </div>
    </div>
  );
}

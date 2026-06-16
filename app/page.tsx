'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  'plaintext', 'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'html', 'css', 'json', 'sql', 'bash', 'markdown',
];

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [expiryType, setExpiryType] = useState<'never' | 'time' | 'views'>('never');
  const [expiryTime, setExpiryTime] = useState('1h');
  const [maxViews, setMaxViews] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getExpiresAt(): string | null {
    if (expiryType !== 'time') return null;
    const map: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + map[expiryTime]).toISOString();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          content,
          language,
          expires_at: getExpiresAt(),
          max_views: expiryType === 'views' ? maxViews : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      router.push(`/${data.slug}`);
    } catch {
      setError('Network error, please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">PasteBin</h1>
        <p className="text-zinc-400 mb-8">Paste your text and share the link.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-500"
          />

          <textarea
            placeholder="Paste your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm font-mono resize-y focus:outline-none focus:border-zinc-500"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-zinc-400">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-zinc-400">Expiry</label>
              <select
                value={expiryType}
                onChange={(e) => setExpiryType(e.target.value as 'never' | 'time' | 'views')}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              >
                <option value="never">Never</option>
                <option value="time">After time</option>
                <option value="views">After views</option>
              </select>
            </div>

            {expiryType === 'time' && (
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-zinc-400">Duration</label>
                <select
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                >
                  <option value="1h">1 hour</option>
                  <option value="24h">24 hours</option>
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                </select>
              </div>
            )}

            {expiryType === 'views' && (
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-zinc-400">Max views</label>
                <input
                  type="number"
                  min={1}
                  value={maxViews}
                  onChange={(e) => setMaxViews(Number(e.target.value))}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-100 text-zinc-900 font-semibold rounded-lg py-2 px-6 hover:bg-white transition-colors disabled:opacity-50 self-end"
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>
      </div>
    </div>
  );
}

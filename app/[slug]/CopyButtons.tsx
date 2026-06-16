'use client';

import { useState } from 'react';

type Props = {
  content: string;
};

export default function CopyButtons({ content }: Props) {
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  function handleCopyContent() {
    navigator.clipboard.writeText(content);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        onClick={handleCopyContent}
        className={`text-xs px-3 py-1.5 rounded transition-all border ${
          copiedContent
            ? 'bg-green-900 border-green-500 text-green-300'
            : 'bg-zinc-800 border-transparent hover:bg-zinc-700 text-zinc-100'
        }`}
      >
        {copiedContent ? 'Copied ✓' : 'Copy'}
      </button>
      <button
        onClick={handleCopyLink}
        className={`text-xs px-3 py-1.5 rounded transition-all border ${
          copiedLink
            ? 'bg-green-900 border-green-500 text-green-300'
            : 'bg-zinc-800 border-transparent hover:bg-zinc-700 text-zinc-100'
        }`}
      >
        {copiedLink ? 'Copied ✓' : 'Copy link'}
      </button>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { createPaste } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { title, content, language, expires_at, max_views } = body;

  if (!content || content.trim() === '') {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const slug = await createPaste({
    title,
    content,
    language,
    expires_at,
    max_views,
  });

  return NextResponse.json({ slug }, { status: 201 });
}

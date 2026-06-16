import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const paste = await getPaste(slug);

  if (!paste) {
    return NextResponse.json({ error: 'Paste not found or expired' }, { status: 404 });
  }

  return NextResponse.json(paste);
}

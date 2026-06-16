import { neon } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';

const sql = neon(process.env.DATABASE_URL!);

export type Paste = {
  id: string;
  slug: string;
  title: string | null;
  content: string;
  language: string;
  expires_at: string | null;
  max_views: number | null;
  view_count: number;
  created_at: string;
};

export async function createPaste(data: {
  title?: string;
  content: string;
  language?: string;
  expires_at?: string | null;
  max_views?: number | null;
}) {
  const slug = nanoid(8);

  const rows = await sql`
    INSERT INTO pastes (slug, title, content, language, expires_at, max_views)
    VALUES (
      ${slug},
      ${data.title ?? null},
      ${data.content},
      ${data.language ?? 'plaintext'},
      ${data.expires_at ?? null},
      ${data.max_views ?? null}
    )
    RETURNING slug
  `;

  return rows[0].slug as string;
}


export async function getPaste(slug: string): Promise<Paste | null> {
  const rows = await sql`
    SELECT * FROM pastes WHERE slug = ${slug}
  `;

  if (rows.length === 0) return null;

  const paste = rows[0] as Paste;

  // Check time expiry
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    return null;
  }

  // Check view limit
  if (paste.max_views !== null && paste.view_count >= paste.max_views) {
    return null;
  }

  // Increment view count
  await sql`
    UPDATE pastes SET view_count = view_count + 1 WHERE slug = ${slug}
  `;

  return paste;
}

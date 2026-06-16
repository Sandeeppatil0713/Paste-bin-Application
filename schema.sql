CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS pastes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(12) UNIQUE NOT NULL,
  title       VARCHAR(255),
  content     TEXT NOT NULL,
  language    VARCHAR(50) NOT NULL DEFAULT 'plaintext',
  expires_at  TIMESTAMPTZ,
  max_views   INTEGER,
  view_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pastes_slug ON pastes(slug);
CREATE INDEX IF NOT EXISTS idx_pastes_expires_at ON pastes(expires_at);

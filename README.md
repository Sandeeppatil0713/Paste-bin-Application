# PasteBin

A simple pastebin web app to quickly store and share text content via a unique link.

## Features

- Create pastes with optional title and syntax language
- Shareable unique URL for each paste
- Optional expiry by time (1h, 24h, 7d, 30d)
- Optional expiry by view count (burn after read)

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Neon (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.sample` to `.env` and fill in your `DATABASE_URL`
4. Run the schema in your Neon SQL Editor (`schema.sql`)
5. Start the dev server: `npm run dev`

## Environment Variables

```
DATABASE_URL=your_neon_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

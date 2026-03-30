# CatGPT

A cat-themed chatbot that responds to your messages with relevant short cat videos. Type something — CatGPT matches it to a theme and serves up a perfectly curated cat clip.

## How it works

User messages are matched against keyword sets (sad, work, food, sleep, etc.) and mapped to a themed pool of pre-curated YouTube cat videos. A random video from the matching theme is served alongside a sassy cat response.

**17 themes:** emotions, work, food, sleep, love, angry, science, music, exercise, money, weather, scared, smart, travel, tech, generic_positive, and a fallback catch-all.

## Tech stack

- React 18
- Vite
- Deployed on Cloudflare Pages

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Video library

The video library (`src/data/video-library.json`) is a pre-built static JSON file — no YouTube API calls at runtime. To rebuild it:

```bash
cd VideoLibrary
# Add your YouTube Data API key to VideoLibrary/.env:
# YOUTUBE_API_KEY=your_key_here
node build-library.mjs
```

Requires a YouTube Data API v3 key (~7,000 quota units for a full build).

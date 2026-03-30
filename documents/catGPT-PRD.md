# catGPT — Product Requirements Document

## Overview

**catGPT** is a parody chat application styled after ChatGPT, but instead of generating text responses, it responds exclusively with relevant cat videos sourced from YouTube. Users type messages (questions, feelings, requests — anything) and catGPT interprets the intent/vibe, searches YouTube for matching cat videos, and presents the result in a chat-style interface.

The tone is intentionally silly. This is a meme-tier product that should make people laugh.

## Core User Flow

1. User opens catGPT — greeted by a silly landing/chat screen
2. User types a message (e.g., "explain quantum physics", "I'm having a bad day", "write me a poem")
3. catGPT shows a cat-themed loading state with funny messages
4. catGPT responds with an embedded YouTube cat video that is *somehow* relevant to the query
5. User can share/copy the video link
6. Conversation history persists in the session so users can scroll back through their "chat"

## Architecture

### Tech Stack

- **Frontend:** Developer's choice (React with Vite recommended, but flexible — whatever works best)
- **Query Engine:** Client-side keyword mapping (no AI, no external API for interpretation)
- **Video Source:** YouTube Data API v3 (requires API key)
- **Hosting:** Cloudflare Pages
- **Styling:** CSS — kawaii-meme hybrid, warm and playful

### How It Works

```
User Message
    ↓
Keyword Mapper (client-side, no API)
    → Tokenises the user's message into lowercase words
    → Matches words against a keyword-to-theme dictionary
    → Builds a YouTube search query: "cat" + matched theme modifiers
    → Selects a funny response message from a pool associated with the matched theme
    → If no keywords match: falls back to "cat" + raw user words (surprisingly effective)
    ↓
YouTube Data API v3
    → Searches with the generated query
    → Filters: type=video, safeSearch=moderate
    → Returns top result(s)
    ↓
Frontend renders:
    → Funny cat-themed response text
    → Embedded YouTube video player
    → Share/copy link button
```

### Keyword Mapping System

The keyword mapper is a client-side module that converts user messages into cat-themed YouTube search queries without any AI. It consists of two data structures:

**1. Theme Dictionary** — maps keywords to search query fragments and response messages:

```javascript
const themes = {
  emotions: {
    keywords: ["sad", "depressed", "upset", "cry", "unhappy", "down", "miserable", "heartbroken"],
    queries: ["funny cat cheering up owner", "cat being adorable compilation", "cat hugs sad human"],
    responses: ["Purr-scription: one cat video, twice daily.", "Who needs therapy when you have cats?", "Even my hairballs are more uplifting than your day."]
  },
  work: {
    keywords: ["work", "job", "office", "boss", "meeting", "deadline", "email", "colleague", "monday", "corporate"],
    queries: ["cat interrupts work from home", "cat on keyboard during meeting", "cat destroys office"],
    responses: ["Have you tried knocking everything off your desk? Works for me.", "Your meeting could've been a cat video.", "I too like to sit on important documents."]
  },
  food: {
    keywords: ["food", "eat", "hungry", "cook", "recipe", "dinner", "lunch", "breakfast", "pizza", "snack"],
    queries: ["cat stealing food compilation", "cat begging for food funny", "cat cooking kitchen"],
    responses: ["I also scream at my human until food appears.", "My diet is 100% whatever falls on the floor.", "Have you considered just knocking it off the counter?"]
  },
  sleep: {
    keywords: ["tired", "sleepy", "sleep", "nap", "bed", "exhausted", "rest", "insomnia"],
    queries: ["sleepy kittens compilation", "cat napping funny positions", "cat sleeping cute"],
    responses: ["I sleep 16 hours a day and I've never been more productive.", "Let me show you how the experts do it.", "Napping is not lazy. It's an art form."]
  },
  love: {
    keywords: ["love", "crush", "date", "relationship", "valentine", "romance", "boyfriend", "girlfriend", "partner", "marry"],
    queries: ["cats cuddling cute compilation", "cat loves owner affection", "cats being romantic funny"],
    responses: ["I too knock things over to show my affection.", "Relationships are easy: just headbutt them.", "Have you tried bringing them a dead mouse? Works every time."]
  },
  angry: {
    keywords: ["angry", "mad", "furious", "rage", "annoyed", "frustrated", "hate", "ugh"],
    queries: ["angry cats funny compilation", "cat hissing dramatic", "grumpy cat compilation"],
    responses: ["I understand. I too become violent when my bowl is half empty.", "Have you tried knocking a glass off the table? Very therapeutic.", "Hiss first, ask questions never."]
  },
  science: {
    keywords: ["science", "physics", "math", "chemistry", "quantum", "biology", "space", "universe", "theory"],
    queries: ["cat confused by physics", "cat gravity fails", "cats defying physics compilation"],
    responses: ["Cats already defy physics daily. You're welcome.", "I have a PhD in knocking things off tables. It's applied gravity.", "Schrödinger had a cat. I rest my case."]
  },
  music: {
    keywords: ["music", "song", "sing", "dance", "guitar", "piano", "concert", "band", "spotify"],
    queries: ["cats dancing funny compilation", "cat playing piano keyboard", "cat singing meowing"],
    responses: ["I've been dropping albums at 3am for years.", "My genre is 'screaming at a closed door'.", "Meow meow meow. That's my new single."]
  },
  exercise: {
    keywords: ["gym", "workout", "exercise", "run", "fitness", "lift", "sport", "training", "yoga"],
    queries: ["cat workout exercise funny", "cat doing yoga stretching", "cat running zoomies compilation"],
    responses: ["I get my cardio from 3am zoomies. Try it.", "My workout is sprinting to the food bowl and back.", "Stretching is my passion. I'm basically a yoga instructor."]
  },
  money: {
    keywords: ["money", "rich", "broke", "salary", "expensive", "budget", "invest", "finance", "bank", "pay"],
    queries: ["cats living luxury rich compilation", "cat with money funny", "expensive cat toys unboxing"],
    responses: ["I don't need money. I own everything in this house already.", "My financial plan is to sit on my human's laptop until they feed me.", "Broke? I've been freeloading for years. Let me teach you."]
  },
  weather: {
    keywords: ["rain", "sun", "snow", "weather", "cold", "hot", "storm", "wind", "summer", "winter"],
    queries: ["cats in snow funny compilation", "cat hates rain water", "cat enjoying sunshine nap"],
    responses: ["I judge all weather from behind a window. As one should.", "If it's raining, it's napping weather. If it's sunny, it's napping weather.", "My forecast: 100% chance of cat."]
  },
  scared: {
    keywords: ["scared", "fear", "horror", "spooky", "terrified", "creepy", "ghost", "halloween", "jump"],
    queries: ["cats getting scared funny compilation", "cat cucumber scare", "scaredy cat compilation"],
    responses: ["CUCUMBER! Sorry, reflex.", "I too am scared of the vacuum. We are not so different.", "The real horror is an empty food bowl."]
  },
  smart: {
    keywords: ["learn", "study", "school", "university", "exam", "homework", "read", "book", "education", "teach"],
    queries: ["smart cat tricks compilation", "cat reading book funny", "cats being intelligent"],
    responses: ["I already graduated top of my class at Meowxford.", "I can open doors, drawers, and hearts. What can you do?", "Study tip: sit on the textbook. Absorb knowledge through osmosis."]
  },
  travel: {
    keywords: ["travel", "vacation", "trip", "holiday", "fly", "airport", "beach", "adventure", "explore"],
    queries: ["cat adventure travel outdoors", "cat in suitcase funny travel", "cat on vacation compilation"],
    responses: ["Why travel when the box the suitcase came in is right here?", "I've explored every corner of this house. I've seen enough.", "Adventure is finding a new sunny spot on the floor."]
  },
  tech: {
    keywords: ["computer", "code", "programming", "software", "app", "website", "ai", "robot", "internet", "laptop", "phone"],
    queries: ["cat on laptop computer funny", "cat typing keyboard compilation", "cat vs technology funny"],
    responses: ["I've been walking on keyboards and writing code for years.", "Have you tried sitting on it? That usually fixes things.", "I'm the reason your code has bugs. You're welcome."]
  },
  generic_positive: {
    keywords: ["happy", "great", "awesome", "amazing", "wonderful", "good", "best", "fantastic", "excellent", "celebrate"],
    queries: ["happy cats compilation cute", "cats celebrating funny", "joyful kittens playing"],
    responses: ["I'm happy too. I just don't show it. Ever.", "Purring is my happy dance.", "Congratulations! Here's a cat video. You've earned it."]
  }
}
```

**2. Matching Logic:**

1. Tokenise the user's message: lowercase, split on spaces/punctuation, remove stop words
2. Score each theme: count how many of its keywords appear in the tokenised message
3. Pick the highest-scoring theme (ties broken randomly for variety)
4. If no theme scores above 0: use a **default fallback** — prepend "cat" to the user's raw message as the search query, and pick from a pool of generic responses like "I don't understand, but here's a cat.", "That's a lot of words. Here's a cat video instead.", "I'm just a cat. But I found this."
5. From the matched theme, randomly select one query and one response (don't always pick the first — variety matters)
6. Use the selected query to search YouTube

**3. Stop Words List:**

Filter out common words that add noise: "the", "a", "an", "is", "are", "was", "were", "i", "me", "my", "you", "your", "it", "this", "that", "what", "how", "why", "when", "where", "who", "do", "does", "did", "can", "could", "would", "should", "will", "have", "has", "had", "been", "be", "am", "to", "of", "in", "on", "for", "with", "about", "just", "really", "very", "so", "but", "and", "or", "not", "no", "please", "help", "tell", "know", "think", "want", "need", "like", "make", "get"

### Video Source: Curated Database (No API Key Required)

Instead of calling the YouTube API at runtime, catGPT uses a pre-built database of curated cat video IDs stored as a static JSON file or JS module. This eliminates the need for any API keys, serverless functions, or caching. The entire app is a pure static site.

**Requirements for curated videos:**
- All videos must be **under 60 seconds** in length
- All videos must feature **cats** as the primary subject (no other animals)
- All videos must be **embeddable** (not restricted by uploader)
- All videos must be **SFW and family-friendly**
- Aim for **10-15 videos per theme** (16 themes = ~160-240 videos total)
- Prefer videos that are funny, cute, or have high view counts (likely to stay online)

**Data structure — replace `queries` with `videoIds` in each theme:**

```javascript
const themes = {
  emotions: {
    keywords: ["sad", "depressed", "upset", ...],
    videoIds: [
      { id: "dQw4w9WgXcQ", title: "Cat cheers up sad human" },
      { id: "abc123xyz", title: "Kitten gives comforting headbutt" },
      // ... 10-15 videos per theme
    ],
    responses: ["Purr-scription: one cat video, twice daily.", ...]
  },
  // ... other themes
}
```

**Selection logic:**
1. Keyword mapper identifies the best theme (same as before)
2. Randomly select a video from that theme's `videoIds` array
3. Track recently shown video IDs in session state to avoid repeats until the pool is exhausted
4. Embed using standard YouTube iframe: `https://www.youtube.com/embed/{videoId}`

**Fallback pool:**
Maintain a separate `fallback` array of ~20 universally funny/cute cat videos for when no theme matches. These should be crowd-pleasers that work regardless of context.

**Maintenance:**
Periodically check that videos are still available (not deleted/privated). A simple script can hit `https://www.youtube.com/oembed?url=https://youtube.com/watch?v={id}` for each ID — a 404 means the video is gone.

### Fallback Handling

- If no theme matches the user's message: pick from the generic fallback pool with a response like "I don't understand, but here's a cat.", "That's a lot of words. Here's a cat video instead."
- If the selected video fails to load in the embed: show the next video in the theme's pool, or fall back to generic pool

## UI/UX Design

### Brand Mascot

The entire site is themed around an orange tabby cat mascot (see `catgpt-mascot.png` in the project assets). This is a kawaii-style cartoon orange cat with:
- Rounded body, big black eyes with white highlights
- Pink inner ears, small pink nose
- Orange fur with darker orange spots/patches
- Thick black outlines, cute smile with whiskers
- Overall chibi/kawaii proportions

This mascot should appear as:
- The chat avatar for all catGPT responses
- Part of the header/logo area
- In the empty state / welcome screen
- In loading animations (bouncing, spinning, sleeping, etc.)
- In error states

The mascot image file should be included in the project assets and used directly (not recreated in CSS).

### Mascot Asset Files

Pre-generated asset files are included in the project. All have transparent backgrounds. Use these directly — do not regenerate or resize at build time.

| File | Size | Purpose |
|------|------|---------|
| `catgpt-mascot.png` | 1056×992 | Full-size mascot (transparent bg). Use for welcome screen, empty states, error pages. |
| `favicon.ico` | 16+32+48 | Multi-size ICO for browser tabs. Place in site root. |
| `favicon-16x16.png` | 16×16 | Standard favicon fallback. |
| `favicon-32x32.png` | 32×32 | Retina favicon. |
| `favicon-48x48.png` | 48×48 | Larger favicon for some browsers. |
| `apple-touch-icon.png` | 180×180 | iOS home screen icon. |
| `android-chrome-192x192.png` | 192×192 | Android PWA icon (standard). |
| `android-chrome-512x512.png` | 512×512 | Android PWA icon (high-res). |
| `catgpt-avatar-64.png` | 64×64 | Chat avatar for catGPT responses (1x). |
| `catgpt-avatar-128.png` | 128×128 | Chat avatar for catGPT responses (2x retina). |
| `og-mascot-400.png` | 400×400 | Open Graph / social sharing meta image asset. |

**HTML head tags to include:**
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta property="og:image" content="/og-mascot-400.png">
```

### Colour Palette (Derived from Mascot)

All colours pulled from the mascot illustration:

| Role | Colour | Hex | Usage |
|------|--------|-----|-------|
| Primary | Warm Orange | `#F4A44E` | Buttons, accents, highlights, catGPT bubble backgrounds |
| Primary Light | Soft Peach | `#F7C98C` | Hover states, secondary backgrounds, user message bubbles |
| Primary Pale | Cream | `#FFF0D6` | Page background, input field background |
| Accent | Pink | `#F2A0A8` | Links, interactive elements, notification dots |
| Dark | Charcoal/Black | `#2D2D2D` | Text, outlines (matching mascot's thick outlines) |
| White | Clean White | `#FFFFFF` | Card backgrounds, contrast areas |
| Spot | Darker Orange | `#E88B30` | Hover accents, active states, shadows |

The overall feel should be warm, soft, and playful — like the mascot itself. No harsh or cold tones.

### Aesthetic Direction: Intentionally Silly / Kawaii-Meme Hybrid

- **NOT** a polished, professional chat app
- Warm and cute, matching the mascot energy — kawaii meets internet humour
- Rounded corners everywhere (matching the mascot's rounded shapes)
- Thick borders/outlines on UI elements (echoing the mascot's black outlines)
- Fonts: playful rounded fonts like **Fredoka One** (headings/logo), **Nunito** or **Quicksand** (body text) — bubbly and friendly
- Wobbly/bouncy CSS animations on interactions
- Cat paw cursor encouraged
- Generous use of the mascot in different poses/states if possible (happy, sleeping, confused, excited)

### Layout

- **Page background:** Cream (`#FFF0D6`) with optional subtle paw print pattern
- **Chat container** centred on screen, max-width ~700px, white background with soft shadow and rounded corners
- **Header:**
  - Mascot image (small, ~40px) next to "catGPT" in Fredoka One
  - Fake "model selector" dropdown with options: "cat-4o", "cat-o1", "meow-3.5-turbo", "gpt-4-paws"
  - Orange-themed header bar
- **Message area:** scrollable chat history
  - User messages: right-aligned bubbles in soft peach (`#F7C98C`), rounded corners, thick-ish border
  - catGPT responses: left-aligned, containing:
    - Mascot image as avatar (small circle, thick black border)
    - Funny text response from Gemini (in a white bubble with orange-tinted border)
    - Embedded YouTube video (16:9 aspect ratio, responsive, with rounded corners)
    - Share/copy link button (small, under the video, orange accent)
- **Input area:** fixed at bottom
  - Rounded input field with cream background and thick orange border
  - Send button: orange with a cat paw icon or 🐾 emoji
  - Placeholder text rotates between cat puns: "Ask me anything... I'll respond with cats", "What's on your mind? (I only speak in cat videos)", "Type something... anything... cats."
- **No sidebar** — keep it simple, single column

### Loading States

While searching for the purrfect video, show rotating cat-themed loading messages such as:
- "Searching the cat internet..."
- "Consulting the council of cats..."
- "Knocking things off the table while I think..."
- "Chasing a laser pointer of inspiration..."
- "Taking a quick nap... I mean, processing..."
- "Hacking up a response..."
- "Sharpening my claws on the server..."
- "If I fits, I sits... in your search results..."

Display these with a cat-themed spinner or animated cat emoji.

### Cat Puns in UI Copy

- Page title: "catGPT — Every Answer is a Cat Video"
- Empty state: "Go ahead, ask me anything. The answer is always cats. 🐱"
- Error state: "Something went wrong. A cat probably sat on the keyboard. 🐾"
- Footer or subtle text: "Powered by cats. Not responsible for productivity loss."

### Share/Copy Button

- Small button under each video response
- Copies the YouTube video URL to clipboard
- Shows brief toast: "Link copied! Now go annoy someone with it. 😺"

## API Keys & Environment Variables

**None required.** The curated video database means no runtime API calls. The entire app is a static site with zero external dependencies.

## Deployment

### Cloudflare Pages

- Pure static site deployed to Cloudflare Pages — no serverless functions needed
- No environment variables required

### Build & Deploy

- Standard build command for chosen framework (e.g., `npm run build`)
- Output directory configured for Cloudflare Pages
- Connect GitHub repo for automatic deploys on push

## Scope Boundaries

### In Scope (MVP)

- Chat interface with message input
- Client-side keyword mapping for query interpretation (no AI dependency)
- Curated cat video database (~160-240 videos, tagged by theme)
- YouTube embed for video playback
- Cat-themed loading messages
- Cat puns throughout UI
- Share/copy video link
- Session-based chat history (in memory, no persistence)
- Fully responsive design (scales to any screen size — mobile, tablet, desktop)
- Mascot-themed design (orange tabby colour palette, mascot avatar)
- Pure static site — zero API keys, zero serverless functions

### Out of Scope (Future / Maybe Never)

- User accounts / auth
- Persistent chat history
- AI-powered query interpretation (Gemini/OpenAI — could add later for smarter matching)
- Live YouTube search (could add as fallback for unmatched queries)
- Multiple video results per query (stick to 1 for MVP)
- Video favouriting / bookmarking
- Cat video of the day
- Dark mode (or make it the only mode — cats are nocturnal)
- Actual useful responses (this is catGPT, not ChatGPT)

## Success Metrics

- Makes people laugh: ✅
- Only shows cat videos: ✅
- Videos are somehow relevant to the query: ✅ (most of the time)
- Friends share it around: ✅

## Non-Functional Requirements

- **Performance:** Responses should be near-instant — keyword mapping and video selection are client-side with zero network latency. Only the YouTube embed iframe loads externally.
- **Rate Limiting:** None — no API calls, no quotas, no limits
- **Security:** No API keys to protect. Pure static site.
- **Accessibility:** Basic — alt text on elements, keyboard navigation for input
- **Responsive:** Must scale fluidly from 320px mobile up to ultrawide desktop. Chat container, video embeds, input area, and all UI elements must adapt. No horizontal scrolling. Video embeds maintain 16:9 aspect ratio at all sizes.

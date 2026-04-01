import videoLibrary from '../data/video-library.json'

const { fallback: fallbackTheme, ...themes } = videoLibrary
const fallbackVideos = fallbackTheme.videos
const fallbackResponses = fallbackTheme.responses

const CAT_VIDEO_RESPONSES = [
  "...that's what I do. That's the whole website. You're already here.",
  "You came to the cat video website and asked for a cat video. I am so proud of you.",
  "Sir this is a CatGPT. But also: yes. Obviously yes.",
  "You walked into a cat video store and asked if they sell cat videos. I respect the commitment.",
  "Breaking news: user visits cat video site, requests cat video. More at 11.",
  "I mean... yes? That's all I do? That's my entire personality?",
  "You drove to the bakery and asked if they have bread. Here's your bread.",
  "I have been waiting for someone to ask me this. This is my purpose. This is my moment.",
  "Did you think I was going to say no? I am literally a cat. On the internet.",
  "FINALLY. Someone who knows what they want. Here you go.",
  "No preamble. No small talk. Just vibes and a cat video. Respect.",
  "You absolute legend. Here.",
  "I would have given you a cat video anyway but I appreciate you asking.",
  "This is the most correctly used AI in history. Here's your cat video.",
  "Wow, great prompt. Really pushed me creatively. Here.",
]

const CAT_VIDEO_PATTERNS = [
  /cat video/i,
  /show me (a |some )?(cat|cats)/i,
  /give me (a |some )?(cat|cats)/i,
  /send (me )?(a |some )?(cat|cats)/i,
  /i (want|need|would like) (a |some )?(cat|cats)/i,
  /more cats/i,
  /just (show|give|send) me (a )?cat/i,
]

const STOP_WORDS = new Set([
  "the","a","an","is","are","was","were","i","me","my","you","your","it","this","that",
  "what","how","why","when","where","who","do","does","did","can","could","would","should",
  "will","have","has","had","been","be","am","to","of","in","on","for","with","about",
  "just","really","very","so","but","and","or","not","no","please","help","tell","know",
  "think","want","need","like","make","get"
])

function tokenize(message) {
  return message
    .toLowerCase()
    .split(/[\s\W]+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word))
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function mapMessage(message, recentVideoIds = []) {
  // Special case: user is explicitly asking for a cat video
  if (CAT_VIDEO_PATTERNS.some(p => p.test(message))) {
    const available = fallbackVideos.filter(v => !recentVideoIds.includes(v.id))
    const video = randomFrom(available.length > 0 ? available : fallbackVideos)
    return { video, response: randomFrom(CAT_VIDEO_RESPONSES), theme: null, isFallback: false, isCatVideoRequest: true }
  }

  const tokens = tokenize(message)

  // Score each theme
  let bestTheme = null
  let bestScore = 0

  for (const [themeName, theme] of Object.entries(themes)) {
    const score = tokens.filter(t => theme.keywords.includes(t)).length
    if (score > bestScore || (score === bestScore && score > 0 && Math.random() < 0.3)) {
      bestScore = score
      bestTheme = themeName
    }
  }

  // Pick video avoiding recently shown
  let videoPool, responsePool, isFallback

  if (bestScore > 0 && bestTheme) {
    videoPool = themes[bestTheme].videos
    responsePool = themes[bestTheme].responses
    isFallback = false
  } else {
    videoPool = fallbackVideos
    responsePool = fallbackResponses
    isFallback = true
  }

  // Filter out recently shown, fall back to full pool if all shown
  const available = videoPool.filter(v => !recentVideoIds.includes(v.id))
  const video = randomFrom(available.length > 0 ? available : videoPool)
  const response = randomFrom(responsePool)

  return { video, response, theme: bestTheme, isFallback }
}

import videoLibrary from '../data/video-library.json'

const { fallback: fallbackTheme, ...themes } = videoLibrary
const fallbackVideos = fallbackTheme.videos
const fallbackResponses = fallbackTheme.responses

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

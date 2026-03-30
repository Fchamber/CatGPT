import { useState } from 'react'
import './VideoEmbed.css'

export default function VideoEmbed({ video }) {
  const [copied, setCopied] = useState(false)
  const [embedError, setEmbedError] = useState(false)

  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0&modestbranding=1`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(videoUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  if (embedError) {
    return (
      <div className="video-error">
        <p>😿 This video escaped. <a href={videoUrl} target="_blank" rel="noopener noreferrer">Watch it on YouTube instead →</a></p>
      </div>
    )
  }

  return (
    <div className="video-wrapper">
      <div className="video-aspect">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setEmbedError(true)}
          className="video-iframe"
        />
      </div>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? "Link copied! Now go annoy someone with it. 😺" : "🔗 Share this video"}
      </button>
    </div>
  )
}

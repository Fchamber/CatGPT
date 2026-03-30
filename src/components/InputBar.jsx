import { useState, useRef } from 'react'
import './InputBar.css'

const PLACEHOLDERS = [
  "Ask me anything... I'll respond with cats",
  "What's on your mind? (I only speak in cat videos)",
  "Type something... anything... cats.",
  "Go ahead. I already know the answer. It's a cat.",
  "What ails you? Cats will fix it.",
]

export default function InputBar({ onSend, isLoading }) {
  const [text, setText] = useState('')
  const [placeholderIdx] = useState(() => Math.floor(Math.random() * PLACEHOLDERS.length))
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    onSend(text.trim())
    setText('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="input-field"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDERS[placeholderIdx]}
        disabled={isLoading}
        autoFocus
      />
      <button className="send-btn" type="submit" disabled={isLoading || !text.trim()} aria-label="Send">
        🐾
      </button>
    </form>
  )
}

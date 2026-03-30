import { useEffect, useRef } from 'react'
import Message from './Message'
import LoadingMessage from './LoadingMessage'
import './ChatWindow.css'

export default function ChatWindow({ messages, isLoading, loadingText }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window">
      {messages.length === 0 && !isLoading && (
        <div className="empty-state">
          <img src="/catgpt-mascot.png" alt="catGPT" className="empty-mascot" />
          <p className="empty-text">Go ahead, ask me anything.<br />The answer is always cats. 🐱</p>
        </div>
      )}
      {messages.map(msg => (
        <Message key={msg.id} message={msg} />
      ))}
      {isLoading && <LoadingMessage text={loadingText} />}
      <div ref={bottomRef} />
    </div>
  )
}

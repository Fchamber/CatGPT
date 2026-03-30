import './LoadingMessage.css'

export default function LoadingMessage({ text }) {
  return (
    <div className="message message-bot">
      <div className="bot-avatar-wrapper">
        <img src="/catgpt-avatar-64.png" srcSet="/catgpt-avatar-128.png 2x" alt="catGPT" className="bot-avatar loading-bounce" />
      </div>
      <div className="bot-content">
        <div className="bubble bubble-bot loading-bubble">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-text">{text}</span>
        </div>
      </div>
    </div>
  )
}

import VideoEmbed from './VideoEmbed'
import './Message.css'

export default function Message({ message }) {
  if (message.type === 'user') {
    return (
      <div className="message message-user">
        <div className="bubble bubble-user">{message.text}</div>
      </div>
    )
  }

  return (
    <div className="message message-bot">
      <div className="bot-avatar-wrapper">
        <img src="/catgpt-avatar-64.png" srcSet="/catgpt-avatar-128.png 2x" alt="catGPT" className="bot-avatar" />
      </div>
      <div className="bot-content">
        <div className="bubble bubble-bot">{message.text}</div>
        <VideoEmbed video={message.video} />
      </div>
    </div>
  )
}

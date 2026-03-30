import { useState, useRef } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import { mapMessage } from './utils/keywordMapper'
import './App.css'

const LOADING_MESSAGES = [
  "Searching the cat internet...",
  "Consulting the council of cats...",
  "Knocking things off the table while I think...",
  "Chasing a laser pointer of inspiration...",
  "Taking a quick nap... I mean, processing...",
  "Hacking up a response...",
  "Sharpening my claws on the server...",
  "If I fits, I sits... in your search results...",
]

function randomLoadingMessage() {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const recentVideoIds = useRef([])

  async function handleSend(text) {
    if (!text.trim() || isLoading) return

    const userMsg = { type: 'user', text, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setLoadingText(randomLoadingMessage())

    // Simulate a brief delay for comedic effect
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const result = mapMessage(text, recentVideoIds.current)

    // Track recently shown videos (keep last 20)
    recentVideoIds.current = [...recentVideoIds.current, result.video.id].slice(-20)

    const botMsg = {
      type: 'bot',
      id: Date.now() + 1,
      text: result.response,
      video: result.video,
    }

    setMessages(prev => [...prev, botMsg])
    setIsLoading(false)
  }

  return (
    <div className="app">
      <div className="chat-container">
        <Header />
        <ChatWindow messages={messages} isLoading={isLoading} loadingText={loadingText} />
        <InputBar onSend={handleSend} isLoading={isLoading} />
        <footer className="chat-footer">Powered by cats. Not responsible for productivity loss.</footer>
      </div>
    </div>
  )
}

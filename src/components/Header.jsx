import './Header.css'

const FAKE_MODELS = ["cat-4o", "cat-o1", "meow-3.5-turbo", "gpt-4-paws"]

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src="/catgpt-avatar-64.png" alt="catGPT mascot" className="header-mascot" />
        <span className="header-title">catGPT</span>
      </div>
      <select className="model-selector" defaultValue="cat-4o">
        {FAKE_MODELS.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </header>
  )
}

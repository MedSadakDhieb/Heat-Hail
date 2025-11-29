import { useState } from 'react'
import Hero from './componets/Hero'
import GlobeShowcase from './componets/GlobeShowcase'
import AboutScroller from './componets/AboutScroller'
import LoginPanel from './componets/LoginPanel'
import SmoothScroller from './componets/SmoothScroller'
import Footer from './componets/Footer'
import GameHub from './componets/GameHub'
import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [stage, setStage] = useState('landing')
  const [currentUser, setCurrentUser] = useState(null)

  const handleLoginSuccess = (userRecord) => {
    setCurrentUser(userRecord)
    setStage('game')
    setShowLogin(false)
  }

  const handleExitGame = () => {
    setStage('landing')
    setCurrentUser(null)
  }

  if (stage === 'game' && currentUser) {
    return (
      <div className="game-shell">
        <GameHub user={currentUser} onLeave={handleExitGame} />
      </div>
    )
  }

  return (
    <SmoothScroller>
      <div className="page">
        <Hero onPlaytestClick={() => setShowLogin(true)} />
        <GlobeShowcase />
        <AboutScroller />
        <Footer />
      </div>
      {showLogin && <LoginPanel onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
    </SmoothScroller>
  )
}

export default App

import { useState } from 'react'
import Hero from './componets/Hero'
import GlobeShowcase from './componets/GlobeShowcase'
import AboutScroller from './componets/AboutScroller'
import LoginPanel from './componets/LoginPanel'
import SmoothScroller from './componets/SmoothScroller'
import Footer from './componets/Footer'
import GameHub from './componets/GameHub'
import NumberGame from './componets/NumberGame'
import GameMenu from './componets/GameMenu'
import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [stage, setStage] = useState('landing') // 'landing', 'menu', 'game'
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedGame, setSelectedGame] = useState(null) // 'map' or 'numbers'

  const handleLoginSuccess = (userRecord) => {
    setCurrentUser(userRecord)
    setStage('menu')
    setShowLogin(false)
  }

  const handleGameSelect = (gameType) => {
    setSelectedGame(gameType)
    setStage('game')
  }

  const handleChangeGame = () => {
    setStage('menu')
    setSelectedGame(null)
  }

  const handleExitGame = () => {
    setStage('landing')
    setCurrentUser(null)
    setSelectedGame(null)
  }

  // Game menu stage
  if (stage === 'menu' && currentUser) {
    return (
      <div className="game-shell">
        <GameMenu user={currentUser} onSelectGame={handleGameSelect} onLeave={handleExitGame} />
      </div>
    )
  }

  // Game stage
  if (stage === 'game' && currentUser && selectedGame) {
    return (
      <div className="game-shell">
        {selectedGame === 'map' ? (
          <GameHub user={currentUser} onLeave={handleExitGame} onChangeGame={handleChangeGame} />
        ) : (
          <NumberGame user={currentUser} onLeave={handleExitGame} onChangeGame={handleChangeGame} />
        )}
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

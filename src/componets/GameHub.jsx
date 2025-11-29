import { useMemo, useState } from 'react'
import countries from '../data/countries.json'
import ChatBot from './ChatBot'
import GoogleMap from './GoogleMap'

const toRadians = (deg) => (deg * Math.PI) / 180

const haversineDistance = (a, b) => {
  const R = 6371
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return Math.round(2 * R * Math.asin(Math.sqrt(h)))
}

const classifyHeat = (distance) => {
  if (distance < 400) return 'Inferno'
  if (distance < 1200) return 'Boiling'
  if (distance < 2500) return 'Warm front'
  if (distance < 4500) return 'Cold gust'
  if (distance < 7000) return 'Freezing wind'
  return 'Arctic hail'
}

const pickRandomCountry = (list, forbiddenName) => {
  const filtered = forbiddenName ? list.filter((c) => c.name !== forbiddenName) : list
  return filtered[Math.floor(Math.random() * filtered.length)]
}

function GameHub({ user, onLeave }) {
  const countryIndex = useMemo(
    () => countries.map((country) => ({ ...country, key: country.name.toLowerCase() })),
    [],
  )

  const countryMap = useMemo(() => {
    const map = new Map()
    countryIndex.forEach((country) => map.set(country.key, country))
    return map
  }, [countryIndex])

  const [target, setTarget] = useState(() => pickRandomCountry(countryIndex))
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({
    attempts: 0,
    solved: 0,
    best: null,
    streak: 0,
    lastDistance: null,
  })

  const accuracy = stats.attempts ? Math.round((stats.solved / stats.attempts) * 100) : 0
  const nors = target.lat >= 0 ? 'Northern ' : 'Southern '

  const handleGuess = (event) => {
    event.preventDefault()
    if (!guess.trim()) return
    const normalized = guess.trim().toLowerCase()
    const record = countryMap.get(normalized)
    if (!record) {
      setFeedback({ type: 'error', message: 'Unknown territory. Try another country.' })
      return
    }

    const distance = haversineDistance(record, target)
    const isCorrect = record.name === target.name
    const heat = classifyHeat(distance)

    setSuggestions([])
    setHistory((prev) =>
      [
        {
          id: `${Date.now()}-${Math.random()}`,
          guess: record.name,
          distance,
          heat,
          success: isCorrect,
        },
        ...prev,
      ].slice(0, 6),
    )

    setStats((prev) => {
      const attempts = prev.attempts + 1
      const solved = prev.solved + (isCorrect ? 1 : 0)
      const bestRaw = isCorrect ? Math.min(prev.best ?? Number.MAX_SAFE_INTEGER, distance) : prev.best
      const best = bestRaw === Number.MAX_SAFE_INTEGER ? null : bestRaw
      return {
        attempts,
        solved,
        best,
        streak: isCorrect ? prev.streak + 1 : 0,
        lastDistance: distance,
      }
    })

    if (isCorrect) {
      setFeedback({ type: 'success', message: `Nailed it. ${record.name} was the secret hotspot!` })
      setTarget(pickRandomCountry(countryIndex, record.name))
    } else {
      setFeedback({
        type: 'hint',
        message: `${heat} • ${distance.toLocaleString()} km away`,
      })
    }

    setGuess('')
  }

  const handleInputChange = (event) => {
    const value = event.target.value
    setGuess(value)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    const normalized = value.toLowerCase()
    const matches = countryIndex
      .filter((country) => country.name.toLowerCase().startsWith(normalized))
      .slice(0, 6)
    setSuggestions(matches)
  }

  const handleSuggestionClick = (name) => {
    setGuess(name)
    setSuggestions([])
  }

  return (
    <>
      <div className="game-layout">
        <section className="game-panel">
          <header className="game-panel__header">
            <div>
              <p className="eyebrow">Logged in as</p>
              <h2>{user.username}</h2>
              <p className="game-subline">{user.email}</p>
            </div>
            <button className="cta ghost" onClick={onLeave}>
              Return to landing
            </button>
          </header>

          <div className="target-hints">
            <div>
              <span>Hemisphere</span>
              <strong>{nors}</strong>
            </div>
          </div>

          <form className="game-form" onSubmit={handleGuess}>
            <label htmlFor="guess-input">Type a country</label>
            <div className="game-input-row">
              <div className="game-input-wrapper">
                <input
                  id="guess-input"
                  value={guess}
                  onChange={handleInputChange}
                  placeholder="e.g. Morocco"
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <ul className="suggestion-list">
                    {suggestions.map((item) => (
                      <li key={item.name}>
                        <button type="button" onClick={() => handleSuggestionClick(item.name)}>
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="cta primary">
                Send guess
              </button>
            </div>
          </form>

          {feedback && (
            <div className={`game-feedback game-feedback--${feedback.type}`}>{feedback.message}</div>
          )}

          <div className="history">
            <div className="history-header">
              <h3>Recent scans</h3>
              <span>{history.length} rounds</span>
            </div>
            <ul className="history-list">
              {history.length === 0 && <li className="history-empty">Start guessing to build intel.</li>}
              {history.map((item) => (
                <li key={item.id} className={item.success ? 'history-item success' : 'history-item'}>
                  <div>
                    <strong>{item.guess}</strong>
                    <span>{item.heat}</span>
                  </div>
                  <span className="history-distance">{item.distance.toLocaleString()} km</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="game-dashboard">
          <h3>Command dashboard</h3>
          <div className="stat-grid">
            <article className="stat-card">
              <span>Attempts</span>
              <strong>{stats.attempts}</strong>
            </article>
            <article className="stat-card">
              <span>Finds</span>
              <strong>{stats.solved}</strong>
            </article>
            <article className="stat-card">
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
            </article>
            <article className="stat-card">
              <span>Streak</span>
              <strong>{stats.streak}</strong>
            </article>
            <article className="stat-card">
              <span>Best distance</span>
              <strong>
                {typeof stats.best === 'number' ? `${stats.best.toLocaleString()} km` : '—'}
              </strong>
            </article>
            <article className="stat-card">
              <span>Last scan</span>
              <strong>
                {typeof stats.lastDistance === 'number'
                  ? `${stats.lastDistance.toLocaleString()} km`
                  : '—'}
              </strong>
            </article>
          </div>

          <GoogleMap />
        </aside>
      </div>

      <ChatBot country={target} />
    </>
  )
}

export default GameHub

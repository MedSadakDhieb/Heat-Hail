import { useState, useRef, useEffect } from 'react'
import { playCorrect, playMisplaced, playWrong, playVictory, playClick } from '../utils/soundUtils'

const generateRandomNumber = () => {
    const digits = []
    while (digits.length < 5) {
        const digit = Math.floor(Math.random() * 10)
        if (!digits.includes(digit)) {
            digits.push(digit)
        }
    }
    return digits.join('')
}

const analyzeGuess = (guess, target) => {
    const feedback = []
    const targetDigits = target.split('')
    const guessDigits = guess.split('')

    for (let i = 0; i < 5; i++) {
        const digit = guessDigits[i]
        if (digit === targetDigits[i]) {
            feedback.push({ digit, status: 'correct' }) 
            playCorrect()
        } else if (targetDigits.includes(digit)) {
            feedback.push({ digit, status: 'misplaced' }) 
            playMisplaced()
        } else {
            feedback.push({ digit, status: 'wrong' }) 
            playWrong()
        }
    }

    return feedback
}

function NumberGame({ user, onLeave, onChangeGame }) {
    const [target, setTarget] = useState(() => generateRandomNumber())
    const [guess, setGuess] = useState(['', '', '', '', ''])
    const [feedback, setFeedback] = useState(null)
    const [history, setHistory] = useState([])
    const [stats, setStats] = useState({
        attempts: 0,
        solved: 0,
        best: null,
        streak: 0,
        currentAttempts: 0,
    })

    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()]

    const handleDigitChange = (index, value) => {
        
        if (value && !/^\d$/.test(value)) return

        const newGuess = [...guess]
        newGuess[index] = value

        setGuess(newGuess)

        
        if (value && index < 4) {
            inputRefs[index + 1].current?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        
        if (e.key === 'Backspace' && !guess[index] && index > 0) {
            inputRefs[index - 1].current?.focus()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const guessString = guess.join('')
        if (guessString.length !== 5) {
            setFeedback({ type: 'error', message: 'Please enter all 5 digits.' })
            playWrong()
            return
        }

        
        const uniqueDigits = new Set(guessString.split(''))
        if (uniqueDigits.size !== 5) {
            setFeedback({ type: 'error', message: 'All digits must be unique (0-9).' })
            playWrong()
            return
        }

        playClick()

        const result = analyzeGuess(guessString, target)
        const isCorrect = guessString === target

        const newAttempts = stats.currentAttempts + 1

        setHistory((prev) =>
            [
                {
                    id: Date.now(),
                    guess: guessString,
                    feedback: result,
                    success: isCorrect,
                },
                ...prev,
            ].slice(0, 10)
        )

        if (isCorrect) {
            playVictory()
            setFeedback({ type: 'success', message: `🎉 Brilliant! You cracked the code in ${newAttempts} ${newAttempts === 1 ? 'attempt' : 'attempts'}!` })

            setStats((prev) => {
                const bestRaw = Math.min(prev.best ?? Number.MAX_SAFE_INTEGER, newAttempts)
                const best = bestRaw === Number.MAX_SAFE_INTEGER ? null : bestRaw
                return {
                    attempts: prev.attempts + newAttempts,
                    solved: prev.solved + 1,
                    best,
                    streak: prev.streak + 1,
                    currentAttempts: 0,
                }
            })

            
            setTimeout(() => {
                setTarget(generateRandomNumber())
                setGuess(['', '', '', '', ''])
                setFeedback(null)
                inputRefs[0].current?.focus()
            }, 2500)
        } else {
            setFeedback({ type: 'hint', message: `Attempt ${newAttempts}. Check the colors for hints!` })
            setStats((prev) => ({ ...prev, currentAttempts: newAttempts }))
            setGuess(['', '', '', '', ''])
            inputRefs[0].current?.focus()
        }
    }

    const handleSurrender = () => {
        playWrong()
        setFeedback({ type: 'error', message: `💀 You surrendered! The answer was ${target}` })
        setStats((prev) => ({
            ...prev,
            streak: 0,
            currentAttempts: 0,
        }))

        /
        setTimeout(() => {
            setTarget(generateRandomNumber())
            setGuess(['', '', '', '', ''])
            setFeedback(null)
            inputRefs[0].current?.focus()
        }, 3000)
    }

    useEffect(() => {
        inputRefs[0].current?.focus()
    }, [])

    const accuracy = stats.attempts ? Math.round((stats.solved / (stats.solved + stats.currentAttempts)) * 100) : 0

    return (
        <div className="game-layout">
            <section className="game-panel">
                <header className="game-panel__header">
                    <div>
                        <p className="eyebrow">Logged in as</p>
                        <h2>{user.username}</h2>
                        <p className="game-subline">{user.email}</p>
                    </div>
                    <div className="header-buttons">
                        <button className="cta ghost" onClick={onChangeGame}>
                            Change game
                        </button>
                        <button className="cta ghost" onClick={onLeave}>
                            Return to landing
                        </button>
                    </div>
                </header>

                <div className="number-game-intro">
                    <h3>🔢 Heat-Hail Numbers</h3>
                    <p>Crack the 5-digit code! Each digit (0-9) appears only once.</p>
                </div>

                <form className="game-form number-form" onSubmit={handleSubmit}>
                    <label>Enter your 5-digit guess</label>
                    <div className="digit-input-row">
                        {guess.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleDigitChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="digit-input"
                                autoComplete="off"
                            />
                        ))}
                    </div>
                    <div className="game-form-buttons">
                        <button type="submit" className="cta primary wide">
                            Submit guess
                        </button>
                        <button type="button" className="cta ghost wide" onClick={handleSurrender}>
                            Surrender
                        </button>
                    </div>
                </form>

                {feedback && (
                    <div className={`game-feedback game-feedback--${feedback.type}`}>{feedback.message}</div>
                )}

                <div className="history">
                    <div className="history-header">
                        <h3>Guess history</h3>
                        <span>{history.length} guesses</span>
                    </div>
                    <ul className="history-list">
                        {history.length === 0 && <li className="history-empty">Start guessing to build your history.</li>}
                        {history.map((item) => (
                            <li key={item.id} className={item.success ? 'number-history-item success' : 'number-history-item'}>
                                <div className="digit-feedback-row">
                                    {item.feedback.map((fb, idx) => (
                                        <div key={idx} className={`digit-box digit-${fb.status}`}>
                                            {fb.digit}
                                        </div>
                                    ))}
                                </div>
                                {item.success && <span className="success-badge">✓ Solved</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <aside className="game-dashboard">
                <h3>Command dashboard</h3>
                <div className="stat-grid">
                    <article className="stat-card">
                        <span>Total attempts</span>
                        <strong>{stats.attempts + stats.currentAttempts}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Solved</span>
                        <strong>{stats.solved}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Current try</span>
                        <strong>{stats.currentAttempts}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Streak</span>
                        <strong>{stats.streak}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Best solve</span>
                        <strong>{typeof stats.best === 'number' ? `${stats.best} ${stats.best === 1 ? 'attempt' : 'attempts'}` : '—'}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Win rate</span>
                        <strong>{accuracy}%</strong>
                    </article>
                </div>

                <div className="number-game-legend">
                    <h4>Color Guide</h4>
                    <div className="legend-items">
                        <div className="legend-item">
                            <div className="digit-box digit-correct">5</div>
                            <span>Correct position</span>
                        </div>
                        <div className="legend-item">
                            <div className="digit-box digit-misplaced">3</div>
                            <span>Wrong position</span>
                        </div>
                        <div className="legend-item">
                            <div className="digit-box digit-wrong">7</div>
                            <span>Not in code</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default NumberGame

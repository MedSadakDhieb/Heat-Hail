import { playClick } from '../utils/soundUtils'

function GameMenu({ user, onSelectGame, onLeave }) {
    const handleGameSelect = (gameType) => {
        playClick()
        onSelectGame(gameType)
    }

    return (
        <div className="game-menu-container">
            <header className="game-menu-header">
                <div>
                    <p className="eyebrow">Welcome back</p>
                    <h2>{user.username}</h2>
                    <p className="game-subline">Choose your mission</p>
                </div>
                <button className="cta ghost" onClick={onLeave}>
                    Return to landing
                </button>
            </header>

            <div className="game-menu">
                <article className="game-choice-card" onClick={() => handleGameSelect('map')}>
                    <div className="game-card-icon">🌍</div>
                    <h3>Heat-Hail Map</h3>
                    <p>Guess countries based on distance clues. Navigate the world with heat and hail feedback.</p>
                    <div className="game-card-badge heat-badge">Geography</div>
                </article>

                <article className="game-choice-card" onClick={() => handleGameSelect('numbers')}>
                    <div className="game-card-icon">🔢</div>
                    <h3>Heat-Hail Numbers</h3>
                    <p>Crack the 5-digit code! Use color clues to deduce each unique digit's position.</p>
                    <div className="game-card-badge hail-badge">Logic</div>
                </article>
            </div>
        </div>
    )
}

export default GameMenu

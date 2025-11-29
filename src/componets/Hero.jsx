function Hero({ onPlaytestClick }) {
  return (
    <header className="hero" id="top">
      <p className="eyebrow">Social deduction · Geography vibes</p>
      <h1 className="title">
        <span className="word heat-word">
          <span className="word-label">Heat</span>
          <span className="runner runner-heat" aria-hidden="true">
            ●
          </span>
        </span>
        <span className="ampersand">&amp;</span>
        <span className="word hail-word">
          <span className="word-label">Hail</span>
          <span className="runner runner-hail" aria-hidden="true">
            ●
          </span>
        </span>
      </h1>
      <p className="headline">
        A world-scale guessing game where weather clues melt or freeze the competition. Call a
        country, feel the climate response.
      </p>
      <div className="cta-row">
        <button className="cta primary" onClick={onPlaytestClick}>
          Playtest access
        </button>
        
      </div>
    </header>
  )
}

export default Hero


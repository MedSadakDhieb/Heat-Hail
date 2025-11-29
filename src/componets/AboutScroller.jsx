import { useEffect, useRef } from 'react'

const steps = [
  {
    title: '01 · Call the climate',
    body:
      'Type any country name. Heat callers crave scorching zones, while hail callers hunt the chill.',
  },
  {
    title: '02 · Align your faction',
    body:
      'Choose to represent Heat or Hail. Your choices nudge live team momentum and unlock perks.',
  },
  {
    title: '03 · AI-grade feedback',
    body:
      'We scan global weather trends to tell you if you hit a heatwave or triggered a hailstorm.',
  },
  {
    title: '04 · Keep the streak alive',
    body: 'Chain correct guesses to boost your faction. Miss twice and the climate flips on you.',
  },
  {
    title: '05 · Hidden intel drops',
    body:
      'Decode orbital pings, barometric clues, and team chat leaks that hint at the next perfect guess.',
  },
  {
    title: '06 · Unlock wild modes',
    body: 'Co-op rushes, storm gambits, and region duels keep every session fresh.',
  },
]

function AboutScroller() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll('.about-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('about-card--visible', entry.isIntersecting)
        })
      },
      { threshold: 0.35 },
    )

    cards.forEach((card, index) => {
      card.style.setProperty('--card-index', index)
      observer.observe(card)
    })

    return () => {
      cards.forEach((card) => observer.unobserve(card))
    }
  }, [])

  return (
    <section className="about" id="about" ref={sectionRef}>
      <p className="eyebrow">How Heat &amp; Hail works</p>
      <h2>Scroll the playbook</h2>
      <div className="about-track">
        {steps.map((step) => (
          <article key={step.title} className="about-card">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AboutScroller


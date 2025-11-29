import { useEffect } from 'react'
import Lenis from 'lenis'

function SmoothScroller({ children, onScroll }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: true,
      gestureOrientation: 'vertical',
      touchMultiplier: 1.4,
    })

    const handleScroll = (e) => {
      onScroll?.(e)
    }

    lenis.on('scroll', handleScroll)

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.off('scroll', handleScroll)
      lenis.destroy()
    }
  }, [onScroll])

  return <>{children}</>
}

export default SmoothScroller


// Sound utility functions using Web Audio API
let audioContext = null
let isMuted = false

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

const playTone = (frequency, duration = 0.15, volume = 0.3) => {
  if (isMuted) return

  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (error) {
    console.warn('Audio playback failed:', error)
  }
}

// Green - correct digit in correct position
export const playCorrect = () => {
  playTone(880, 0.1, 0.25) // A5 note
}

// Orange - correct digit in wrong position
export const playMisplaced = () => {
  playTone(440, 0.12, 0.2) // A4 note
}

// Red - digit not in number
export const playWrong = () => {
  playTone(220, 0.15, 0.15) // A3 note
}

// Victory sound - ascending tones
export const playVictory = () => {
  if (isMuted) return

  try {
    const ctx = getAudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      const startTime = ctx.currentTime + index * 0.12
      const duration = 0.25

      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    })
  } catch (error) {
    console.warn('Audio playback failed:', error)
  }
}

// UI click sound
export const playClick = () => {
  playTone(800, 0.05, 0.15)
}

// Toggle mute
export const toggleMute = () => {
  isMuted = !isMuted
  return isMuted
}

// Get mute status
export const isSoundMuted = () => isMuted

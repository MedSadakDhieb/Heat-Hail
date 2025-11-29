import { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

function GlobeShowcase() {
  const globeRef = useRef(null)
  const sectionRef = useRef(null)
  const [active, setActive] = useState(false)
  const [userInteracting, setUserInteracting] = useState(false)

  const markers = useMemo(
    () => [
      {
        id: 'Tunisia',
        lat: 33.886917,
        lng: 9.537499,
        size: 1.2,
        color: '#ff5a41',
        label: 'Heat alert: Tunisia',
      },
      {
        id: 'dubai',
        lat: 25.276987,
        lng: 55.296249,
        size: 1.2,
        color: '#ff5a41',
        label: 'Heat alert: Dubai',
      },
      {
        id: 'reykjavík',
        lat: 64.1466,
        lng: -21.9426,
        size: 1,
        color: '#4ca3ff',
        label: 'Hail alert: Reykjavík',
      },
      {
        id: 'oslo',
        lat: 59.9139,
        lng: 10.7522,
        size: 0.9,
        color: '#4ca3ff',
        label: 'Hail alert: Oslo',
      },
    ],
    [],
  )

  const arcs = useMemo(
    () => [
      {

        startLat: 33.886917,
        startLng: 9.537499,
        endLat: 64.1466,
        endLng: -21.9426,
        color: ['#ff5a41', '#4ca3ff'],
      },
      {
        startLat: 25.276987,
        startLng: 55.296249,
        endLat: 59.9139,
        endLng: 10.7522,
        color: ['#ff5a41', '#4ca3ff'],
      },
    ],
    [],
  )

  useEffect(() => {
    if (!globeRef.current) return
    const controls = globeRef.current.controls()
    controls.autoRotate = !userInteracting
    controls.autoRotateSpeed = 0.4
    controls.enableZoom = true
    controls.enablePan = true
  }, [userInteracting])

  useEffect(() => {
    const canvas = globeRef.current?.renderer().domElement
    if (!canvas) return
    const handlePointerDown = () => setUserInteracting(true)
    const handlePointerUp = () => setUserInteracting(false)
    const handlePointerLeave = () => setUserInteracting(false)
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setActive(entry.isIntersecting))
      },
      { threshold: 0.45 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={`globe-section ${active ? 'globe-section--active' : ''}`}
      id="globe"
      ref={sectionRef}
    >
      <div className="globe-wrapper">
        <div className="globe-gradient" aria-hidden="true" />
        <Globe
          ref={globeRef}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(5, 7, 16, 0)"
          arcsData={arcs}
          arcColor="color"
          arcAltitude={0.15}
          arcStroke={1}
          arcDashLength={0.4}
          arcDashGap={0.7}
          arcDashAnimateTime={2800}
          pointsData={markers}
          pointAltitude={(d) => d.size * 0.03}
          pointRadius={(d) => d.size * 0.75}
          pointColor="color"
          labelsData={markers}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelColor={(d) => d.color}
          labelText={(d) => d.label}
          labelSize={1.3}
        />
        <div className="globe-hint">{userInteracting ? 'Exploring…' : 'Drag, scroll or pinch the globe'}</div>
      </div>
    </section>
  )
}

export default GlobeShowcase


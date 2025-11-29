import { useEffect, useRef } from 'react'

function GoogleMap() {
    const mapRef = useRef(null)

    useEffect(() => {
        // Load Google Maps script if not already loaded
        if (!window.google) {
            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`
            script.async = true
            script.defer = true
            script.onload = initMap
            document.head.appendChild(script)
        } else {
            initMap()
        }

        function initMap() {
            if (!mapRef.current) return

            // Create a world map centered on the equator
            new window.google.maps.Map(mapRef.current, {
                center: { lat: 20, lng: 0 },
                zoom: 2,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            })
        }
    }, [])

    return (
        <div className="map-container">
            <h4>World Map</h4>
            <div ref={mapRef} className="map-view"></div>
            <p className="map-disclaimer">
                * Map boundaries and names are provided by Google Maps and may not reflect The realitie this app only recognize the State of palstine and consider israel as a terrorist occupation.
            </p>
        </div>
    )
}

export default GoogleMap

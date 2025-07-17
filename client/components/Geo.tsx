import { useState, useEffect, useCallback } from 'react'
import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, MapMouseEvent} from '@vis.gl/react-google-maps';


declare global {
  interface Window {
    initialize: () => void;
  }
}

function Geo() {
  const [marker, setMarker] = useState<{lat: number, lng: number} | null>(null);
  const [mapSize, setMapSize] = useState<{width: string, height: string}>({width: '400px', height: '300px'});
  const [expanded, setExpanded] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [hasLoadedInitialLocation, setHasLoadedInitialLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [showResultsMap, setShowResultsMap] = useState(false);
  const [lastGuess, setLastGuess] = useState<{lat: number, lng: number} | null>(null);
  const [score, setScore] = useState(0);
  const [scoreAlert, setScoreAlert] = useState('');
  const [currentHeading, setCurrentHeading] = useState(0);

  const getRandomCoordinates = () => {
    // Generate random latitude between -85 and 85 (avoiding extreme poles)
    const lat = (Math.random() * 170) - 85;
    // Generate random longitude between -180 and 180
    const lng = (Math.random() * 360) - 180;
    return { lat, lng };
  };

  const findRandomStreetViewLocation = useCallback(async () => {
    if (!mapsLoaded || !window.google) {
      console.log('Google Maps not loaded yet');
      return null;
    }
    
    const streetViewService = new google.maps.StreetViewService();
    let attempts = 0;
    const maxAttempts = 20; // Limit attempts to avoid infinite loops

    const tryRandomLocation = async (): Promise<{lat: number, lng: number} | null> => {
      if (attempts >= maxAttempts) {
        console.log('Max attempts reached, using fallback location');
        return { lat: -20.152288051191736, lng: -67.47815303851836 }; // fallback
        // Antarctica: -65.1172937, lng: -63.9998866
      }
      

      const randomCoords = getRandomCoordinates();
      attempts++;

      return new Promise((resolve) => {
        streetViewService.getPanorama({
          location: randomCoords,
          radius: 50000, // 50km radius to find nearby street view
          source: google.maps.StreetViewSource.OUTDOOR
        }, (data, status) => {
          if (status === google.maps.StreetViewStatus.OK && data?.location?.latLng) {
            const lat = data.location.latLng.lat();
            const lng = data.location.latLng.lng();
            attempts = 0
            resolve({ lat, lng });
          } else {
            // Try again with new random coordinates
            resolve(tryRandomLocation());
          }
        });
      });
    };

    return tryRandomLocation();
  }, [mapsLoaded]);

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const newMarker = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng
      };
      setMarker(newMarker);
    }
  };

  interface ExpandMapEvent extends React.MouseEvent<HTMLButtonElement> {
    target: HTMLButtonElement & { innerHTML: string };
  }

  const expandMap = (event: ExpandMapEvent): void => {
    console.log(event.target.innerHTML);
    if (expanded === 1 && event.target.innerHTML === '-') {
      setMapSize({width: '400px', height: '300px'})
      setExpanded(0)
    } else if (expanded === 0 && event.target.innerHTML === '+' || expanded === 2 && event.target.innerHTML === '-') { 
      setMapSize({width: '800px', height: '600px'})
      setExpanded(1)
    } else if (expanded === 1 && event.target.innerHTML === '+') {
      setMapSize({width: '75%', height: '100%'})
      setExpanded(2)
    }
  };

  const initialize = useCallback(() => {
    if (!mapsLoaded || !currentLocation) return;
    
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: currentLocation,
        zoom: 14,
      }
    );
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano") as HTMLElement,
      {
        position: currentLocation,
        pov: {
          heading: 34,
          pitch: 10,
        },
        enableCloseButton: false,
        addressControl: false,
        fullscreenControl: false,
        motionTrackingControl: false,
        panControl: false,
        zoomControl: false,
        linksControl: false,
        showRoadLabels: false,
        visible: true,
        clickToGo: true,
        scrollwheel: true,
        compassControl: false,
        gestureHandling: 'passive',
      } as google.maps.StreetViewPanoramaOptions & { compassControl: boolean }
    );

    // Add listener for pov changes to track heading
    panorama.addListener('pov_changed', () => {
      const pov = panorama.getPov();
      setCurrentHeading(pov.heading || 0);
    });

    map.setStreetView(panorama);
  }, [currentLocation, mapsLoaded]);

  const loadRandomLocation = useCallback(async () => {
    setIsLoading(true);
    const newLocation = await findRandomStreetViewLocation();
    
    if (newLocation) {
      setCurrentLocation(newLocation);
      
      // Update the panorama with the new location
      const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano") as HTMLElement,
        {
          position: newLocation,
          pov: {
            heading: Math.random() * 360, // Random heading
            pitch: Math.random() * 40 - 20, // Random pitch between -20 and 20
          },
          enableCloseButton: false,
          addressControl: false,
          fullscreenControl: false,
          motionTrackingControl: false,
          panControl: false,
          zoomControl: false,
          linksControl: false,
          showRoadLabels: false,
          visible: true,
          clickToGo: true,
          scrollwheel: true,
          compassControl: false,
          gestureHandling: 'passive',
        } as google.maps.StreetViewPanoramaOptions & { compassControl: boolean }
      );

      // Add listener for pov changes to track heading
      panorama.addListener('pov_changed', () => {
        const pov = panorama.getPov();
        setCurrentHeading(pov.heading || 0);
      });

      // Set initial heading
      setCurrentHeading(panorama.getPov().heading || 0);
    }
    setIsLoading(false);
  }, [findRandomStreetViewLocation]);

  useEffect(() => {
    // Initialize when both maps are loaded and we have a current location
    if (mapsLoaded) {
      if (!hasLoadedInitialLocation) {
        // Load random location on first load
        loadRandomLocation();
        setHasLoadedInitialLocation(true);
      } else {
        // Normal initialization for subsequent location changes
        initialize();
      }
    }
  }, [initialize, mapsLoaded, hasLoadedInitialLocation, loadRandomLocation]);

  window.initialize = initialize;

  const submitGuess = () => {
    // Logic to handle the guess submission
    
    if (marker && currentLocation) {
      // Store the guess for results display
      setLastGuess(marker);
      
      // Calculate bounds to show both points
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
      bounds.extend(new google.maps.LatLng(currentLocation.lat, currentLocation.lng));
      
      // Calculate center and zoom to fit both points
      const center = bounds.getCenter();
      setMapCenter({ lat: center.lat(), lng: center.lng() });
      
      // Set zoom to show both points (rough calculation)
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(marker.lat, marker.lng),
        new google.maps.LatLng(currentLocation.lat, currentLocation.lng)
      );
      
      // Calculate appropriate zoom level based on distance
      let zoom = 10;
      if (distance > 4000000) zoom = 2; 
      else if (distance > 3000000) zoom = 3; 
      else if (distance > 2000000) zoom = 4;  // > 2000km
      else if (distance > 1000000) zoom = 5;  // > 1000km
      else if (distance > 500000) zoom = 6;   // > 500km
      else if (distance > 100000) zoom = 7;  // > 100km
      else if (distance > 50000) zoom = 8;   // > 50km
      else if (distance > 10000) zoom = 10;   // > 10km
      else zoom = 12;                         // < 10km

      console.log('d&z', distance, zoom)

      setScoreAlert('+ ' + Math.max(0, 100 - Math.floor(Math.sqrt(distance) / 20)) + ' POINTS');
      setScore((prevScore) => prevScore + Math.max(0, 100 - Math.floor(Math.sqrt(distance) / 20))); // Simple scoring based on distance
      setMapZoom(zoom);
      setShowResultsMap(true);
      //setExpanded(true);
      setMapSize({width: '100%', height: '100%'});
    }
    
    // Clear the marker
    setMarker(null);
  };

  const nextRound = () => {
    // Reset everything for next round
    setShowResultsMap(false);
    setLastGuess(null);
    setMapCenter({ lat: 0, lng: 0 });
    setMapZoom(1);
    setExpanded(0);
    setMapSize({width: '400px', height: '300px'});
    setScoreAlert('')
    setMarker(null);
    // Load new random location
    loadRandomLocation();
  };

  return (
    <div className='h-screen w-full'>
      <p className='absolute top-0 left-0 p-2 z-50 bg-blue-500 rounded-lg ring-2 ring-white text-white text-2xl translate-x-1 translate-y-1 '>Score: {score}</p>
      {showResultsMap ? <p className='absolute top-2 left-[50%] p-2 z-50 bg-green-500 rounded-lg ring-2 ring-white text-white text-4xl font-semibold -translate-x-[50%]'>{scoreAlert}</p> : ''}
      
      {/* Show loading/black screen when no location is loaded or loading */}
      {(!currentLocation || isLoading) && (
        <div className='absolute top-0 left-0 z-20 h-screen w-full bg-black flex items-center justify-center'>
          <div className='text-white text-2xl flex flex-col items-center gap-4'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white'></div>
            <div>{isLoading ? 'Loading next location...' : 'Loading random location...'}</div>
          </div>
        </div>
      )}

      {/* restart button */}
      <button onClick={() => initialize()}
        className="absolute bottom-32 left-6 p-1 ring-2 ring-white rounded-lg z-40 items-center justify-center bg-gray-500 bg-opacity-60"
      ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw inline"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Start</button>
      
      {/* Custom Compass - only show when location is loaded */}
      {currentLocation && (
        <div className='absolute bottom-8 left-4 z-30 w-20 h-20 bg-black bg-opacity-60 rounded-full flex items-center justify-center border-2 border-white'>
          <div className='relative w-16 h-16'>
            {/* Compass circle */}
            <div className='absolute inset-0 rounded-full  bg-gray-800'></div>
            {/* North indicator */}
            <div 
              className='absolute top-2 left-1/2 w-1 h-6 bg-red-500 rounded-full transform -translate-x-1/2 origin-bottom'
              style={{ transform: ` rotate(${-currentHeading}deg)` }}
            ><p className='absolute top-2 left-1/2 w-1 h-6 transform -translate-y-7 -translate-x-1.5 origin-bottom'>N</p><div 
              className='absolute top-2 left-1/2 w-1 h-6 bg-white rounded-full transform -translate-x-1/2 translate-y-[65%] origin-bottom'
            ></div></div>
          </div>
        </div>
      )}

      {/* Hidden div for Google Maps API initialization */}
      <div id="map" style={{ display: 'none' }}></div>
      
      {/* Street View Panorama */}
      <div 
        id="pano" 
        className="absolute top-0 left-0 z-10 h-screen w-full"
      ></div>
      
      {/* Regular Map */}
      <div 
        className="dark:bg-black dark:text-white bg-white text-black absolute bottom-0 right-0 z-40" 
        style={{ width: mapSize.width, height: mapSize.height }}
      >
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY || ''} onLoad={() => {
          setMapsLoaded(true);
        }}>
          <div className="relative h-full w-full [&_.gm-style-cc]:hidden [&_.gm-style]:child:[last-child]:hidden mapCursor">
          <Map
      zoom={mapZoom}
      center={mapCenter}
      mapId="DEMO_MAP_ID"
      mapTypeControl={false}
      streetViewControl={false}
      keyboardShortcuts={false}
      scrollwheel={true}
      zoomControl={false}
      fullscreenControl={false}
      clickableIcons={false}
      disableDefaultUI={true}
      onClick={handleMapClick}
      onCameraChanged={ (ev: MapCameraChangedEvent) => {
        // Update state when user interacts with map
        setMapCenter(ev.detail.center);
        setMapZoom(ev.detail.zoom);
      }}>
      {/* Show guess marker (red) and actual location marker (green) in results mode */}
      {showResultsMap && lastGuess && (
        <>
          <AdvancedMarker position={currentLocation} >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#16A34A" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-check-inside-icon lucide-map-pin-check-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m9 10 2 2 4-4"/></svg>
          </AdvancedMarker>
          <AdvancedMarker position={lastGuess}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#DC2626" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </AdvancedMarker>
        </>
      )}
      {/* Show normal guess marker when not in results mode */}
      {!showResultsMap && marker && (
        <AdvancedMarker position={marker}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#DC2626" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
        </AdvancedMarker>
      )}
   </Map>
   </div>
        </APIProvider>
        {/* zoom buttons */}
        {expanded === 0 ?
        <button className='absolute top-0 left-0 bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          +
        </button> : ''}
        {expanded === 1 ? (
          <div className='flex absolute top-0 left-0'>
          <button className=' bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          +
          </button>
          <button className='bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          -
        </button>
        </div>
        ) : ''}
        {expanded === 2 ?
        <button className='absolute top-0 left-0 bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          -
        </button> : ''}
        {!showResultsMap ? (
          <button 
            className='absolute bottom-0 left-0 bg-green-500 text-white p-1 rounded text-xl ring-2 ring-white disabled:bg-gray-500 disabled:text-gray-400' 
            onClick={() => submitGuess()}
            disabled={isLoading || !marker}
          >
            Submit
          </button>
        ) : (
          <button 
            className='absolute bottom-0 left-0 bg-blue-500 text-white p-1 rounded text-2xl ring-2 ring-white animate-pulse translate-x-4 -translate-y-4' 
            onClick={() => nextRound()}
          >
            Next Round
          </button>
        )}
      </div>
      </div>
  )
}

export default Geo
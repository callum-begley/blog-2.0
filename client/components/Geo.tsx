import { useState, useEffect, useCallback } from 'react'
import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin, MapMouseEvent} from '@vis.gl/react-google-maps';


declare global {
  interface Window {
    initialize: () => void;
  }
}

function Geo() {
  const [marker, setMarker] = useState<{lat: number, lng: number} | null>(null);
  const [mapSize, setMapSize] = useState<{width: string, height: string}>({width: '400px', height: '300px'});
  const [expanded, setExpanded] = useState(false);
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
        return { lat: 40.748817, lng: -73.985428 }; // NYC fallback
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
    console.log('Map clicked at:', event.detail.latLng);
  };

  const expandMap = () => {
    if (expanded) {
      setMapSize({width: '400px', height: '300px'})
    } else {
      setMapSize({width: '800px', height: '600px'})
    }
    setExpanded(!expanded)
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
    console.log('Finding random street view location...');
    const newLocation = await findRandomStreetViewLocation();
    
    if (newLocation) {
      setCurrentLocation(newLocation);
      console.log('Found location:', newLocation);
      
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
      if (distance > 1000000) zoom = 4;       // > 1000km
      else if (distance > 500000) zoom = 5;   // > 500km
      else if (distance > 100000) zoom = 7;   // > 100km
      else if (distance > 50000) zoom = 8;    // > 50km
      else if (distance > 10000) zoom = 10;   // > 10km
      else zoom = 12;                         // < 10km

      console.log('Distance:', distance);

      setScoreAlert('+ ' + Math.max(0, 100 - Math.floor(Math.sqrt(distance) / 20)) + ' POINTS');
      setScore((prevScore) => prevScore + Math.max(0, 100 - Math.floor(Math.sqrt(distance) / 20))); // Simple scoring based on distance
      setMapZoom(zoom);
      setShowResultsMap(true);
      setExpanded(true);
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
    setExpanded(false);
    setMapSize({width: '400px', height: '300px'});
    setScoreAlert('')
    // Load new random location
    loadRandomLocation();
  };

  return (
    <div className='h-screen w-full'>
      <p className='absolute top-0 left-0 p-2 z-50 bg-blue-500 rounded-lg ring-2 ring-white text-white text-2xl translate-x-1 translate-y-1 '>Score: {score}</p>
      {showResultsMap ? <p className='absolute top-2 left-[50%] p-2 z-50 bg-green-500 rounded-lg ring-2 ring-white text-white text-4xl font-semibold -translate-x-[50%]'>{scoreAlert}</p> : ''}
      
      {/* Show loading/black screen when no location is loaded */}
      {!currentLocation && (
        <div className='absolute top-0 left-0 z-20 h-screen w-full bg-black flex items-center justify-center'>
          <div className='text-white text-2xl'>Loading random location...</div>
        </div>
      )}
      
      {/* Custom Compass - only show when location is loaded */}
      {currentLocation && (
        <div className='absolute bottom-4 left-4 z-30 w-20 h-20 bg-black bg-opacity-60 rounded-full flex items-center justify-center border-2 border-white'>
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
          console.log('Maps API has loaded.');
          setMapsLoaded(true);
        }}>
          <div className="relative h-full w-full [&_.gm-style-cc]:hidden [&_.gm-style]:child:[last-child]:hidden">
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
        //console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom);
        // Update state when user interacts with map
        setMapCenter(ev.detail.center);
        setMapZoom(ev.detail.zoom);
      }}>
      {/* Show guess marker (red) and actual location marker (green) in results mode */}
      {showResultsMap && lastGuess && (
        <>
          <AdvancedMarker position={lastGuess}>
            <Pin background={'#DC2626'} borderColor={'#991B1B'} />
          </AdvancedMarker>
          <AdvancedMarker position={currentLocation}>
            <Pin background={'#16A34A'} borderColor={'#15803D'} />
          </AdvancedMarker>
        </>
      )}
      {/* Show normal guess marker when not in results mode */}
      {!showResultsMap && marker && (
        <AdvancedMarker position={marker}>
          <Pin />
        </AdvancedMarker>
      )}
   </Map>
   </div>
        </APIProvider>
        <button className='absolute top-0 left-0 bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={() => expandMap()} disabled={showResultsMap}>
          {expanded ? '-' : '+'}
        </button>
        {!showResultsMap ? (
          <button 
            className='absolute bottom-0 left-0 bg-green-500 text-white p-1 rounded text-xl disabled:bg-gray-500 disabled:text-gray-400' 
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
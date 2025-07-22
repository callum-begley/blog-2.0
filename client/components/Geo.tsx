import { useState, useEffect, useCallback, useRef } from 'react'
import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, MapMouseEvent, useMap} from '@vis.gl/react-google-maps';
import { MapsData } from '../models/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLocations } from '../apiClient';


declare global {
  interface Window {
    initialize: () => void;
  }
}

// Helper component to access map instance
const MapHelper = ({ onMapReady }: { onMapReady: (map: google.maps.Map) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  return null;
};

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
  const [distanceDisplay, setDistanceDisplay] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [playerGuesses, setPlayerGuesses] = useState<Array<{lat: number, lng: number} | null>>([]);
  const [correctGuesses, setCorrectGuesses] = useState<Array<{lat: number, lng: number} | null>>([]);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [finalPolylines, setFinalPolylines] = useState<google.maps.Polyline[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState('Anywhere');
  const [theme, setTheme] = useState('');
  const [isAI, setIsAI] = useState(false);
  const [aiLocations, setAiLocations] = useState<Array<{lat: number, lng: number}>>([]);
  const [currentAiLocationIndex, setCurrentAiLocationIndex] = useState(0);
  const queryClient = useQueryClient();
  const divRef = useRef<HTMLDivElement>(null);

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['maps'],
    queryFn: async () => {
      const data: MapsData = await getLocations(location, theme)
      return data
    },
    enabled: false,
    staleTime: 0,
  })
  if (isError) console.log('error loading')


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
          radius: 1000,
          source: google.maps.StreetViewSource.GOOGLE,
          preference: google.maps.StreetViewPreference.BEST
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
          source: google.maps.StreetViewSource.GOOGLE,
        } as google.maps.StreetViewPanoramaOptions & { compassControl: boolean, source: google.maps.StreetViewSource }
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

  // Function to draw polyline between two points
  const drawPolyline = useCallback((point1: {lat: number, lng: number}, point2: {lat: number, lng: number}, map?: google.maps.Map) => {
    if (!window.google) return null;
    
    const polyline = new google.maps.Polyline({
      path: [point1, point2],
      geodesic: true,
      strokeColor: '#3d3d3d',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      zIndex: 1000
    });
    
    // If map is provided, set the polyline on the map
    if (map) {
      polyline.setMap(map);
    }
    
    return polyline;
  }, []);

  useEffect(() => {
    // Initialize when both maps are loaded and we have a current location
    if (mapsLoaded && !isAI) {
      if (!hasLoadedInitialLocation) {
        // Load random location on first load (only for non-AI games)
        loadRandomLocation();
        setHasLoadedInitialLocation(true);
      } else {
        // Normal initialization for subsequent location changes
        initialize();
      }
    }
  }, [initialize, mapsLoaded, hasLoadedInitialLocation, loadRandomLocation, isAI]);

    // Effect to create polylines for final results
  useEffect(() => {
    // Clear existing polylines first
    finalPolylines.forEach(polyline => polyline.setMap(null));
    setFinalPolylines([]);
    
    if (showFinalResults && mapInstance && playerGuesses.length > 0 && correctGuesses.length > 0) {
      console.log('Creating polylines using mapInstance from state...');
      const newPolylines: google.maps.Polyline[] = [];
      
      for (let i = 0; i < Math.min(playerGuesses.length, correctGuesses.length); i++) {
        const guess = playerGuesses[i];
        const correct = correctGuesses[i];
        
        if (guess && correct) {
          const polyline = drawPolyline(guess, correct, mapInstance);
          if (polyline) {
            newPolylines.push(polyline);
            console.log(`Drew polyline ${i} from`, guess, 'to', correct);
          }
        }
      }
      setFinalPolylines(newPolylines);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFinalResults, playerGuesses, correctGuesses, drawPolyline, mapInstance]);

  // Cleanup effect for polylines when component unmounts
  useEffect(() => {
    return () => {
      finalPolylines.forEach(polyline => polyline.setMap(null));
    };
  }, [finalPolylines]);

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
      setDistanceDisplay(Math.floor(distance / 1000)); // Display distance in km

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

      setScoreAlert('+ ' + Math.max(0, 100 - Math.floor(Math.sqrt(distance) / 20)) + ' POINTS');
      setScore((prevScore) => prevScore + Math.max(0, 100 - Math.floor(Math.sqrt(distance) / 20))); // Simple scoring based on distance
      setMapZoom(zoom);
      setShowResultsMap(true);
      //setExpanded(true);
      setMapSize({width: '100%', height: '100%'});
      setPlayerGuesses((prev) => [...prev, marker]);
      setCorrectGuesses((prev) => [...prev, currentLocation]);
    }
    
    // Clear the marker
    setMarker(null);
  };

  const nextRound = () => {
    setRoundNumber((prev) => prev + 1);
    console.log('Round:', roundNumber);
    
    if (roundNumber == 5) {
      endGame();
      console.log('Game Over! Final Score:', score);
      return;
    } 
    
    if (roundNumber > 5) {
      setRoundNumber(1);
      setScore(0);
      setPlayerGuesses([]);
      setCorrectGuesses([]);
      setShowFinalResults(false);
      setIsAI(false);
      setAiLocations([]);
      setCurrentAiLocationIndex(0);
    }

    // Reset everything for next round
    setShowResultsMap(false);
    setLastGuess(null);
    setMapCenter({ lat: 0, lng: 0 });
    setMapZoom(1);
    setExpanded(0);
    setMapSize({width: '400px', height: '300px'});
    setScoreAlert('')
    setMarker(null);
    
    // Load next location based on game type
    if (isAI) {
      loadNextAILocation();
    } else {
      loadRandomLocation();
    }
  };

  const startGame = () => {
    setGameStarted(true)
    setRoundNumber(1);
    setScore(0);
    setPlayerGuesses([]);
    setCorrectGuesses([]);
    loadRandomLocation();
  };

  const startAIGame = () => {
    setGameStarted(true);
    setIsAI(true);
    setRoundNumber(1);
    setScore(0);
    setPlayerGuesses([]);
    setCorrectGuesses([]);
    
    // Function to check if Google Maps is fully loaded
    const checkGoogleMapsReady = () => {
      return window.google && 
             window.google.maps && 
             window.google.maps.Geocoder && 
             window.google.maps.StreetViewPanorama;
    };
    
    // Try to load AI locations with retries
    const attemptLoadAILocations = (retries = 5) => {
      if (checkGoogleMapsReady()) {
        console.log('Google Maps ready, loading AI locations...');
        loadAILocations();
      } else if (retries > 0) {
        console.log(`Google Maps not ready, retrying in 500ms... (${retries} attempts left)`);
        setTimeout(() => attemptLoadAILocations(retries - 1), 500);
      } else {
        console.error('Google Maps failed to load after multiple attempts, falling back to random location');
        setIsAI(false); // Reset AI flag since we're falling back
        loadRandomLocation();
      }
    };
    
    attemptLoadAILocations();
  };

  const endGame = () => {
    setShowFinalResults(true);
    setMapSize({width: '100%', height: '100%'});
    console.log('Game Over! Final Score:', score);
    setShowResultsMap(false);
    setLastGuess(null);
    setMapCenter({ lat: 0, lng: 0 });
    setMapZoom(2);
    setScoreAlert('')
    setMarker(null);
  };

  const restartGame = () => {
    setGameStarted(false);
    setRoundNumber(1);
    setScore(0);
    setPlayerGuesses([]);
    setCorrectGuesses([]);
    setShowFinalResults(false);
    setIsAI(false);
    setAiLocations([]);
    setCurrentAiLocationIndex(0);
    setShowResultsMap(false);
    setLastGuess(null);
    setMapCenter({ lat: 0, lng: 0 });
    setMapZoom(1);
    setExpanded(0);
    setMapSize({width: '400px', height: '300px'});
    setMarker(null);
    setLocation('Anywhere');
    setTheme('');
    setCurrentLocation(null);
    setCurrentHeading(0);
    setIsLoading(false);
    setMapsLoaded(false);
    setHasLoadedInitialLocation(false);
    setDistanceDisplay(0);
    setUserHasTyped(false);
    queryClient.removeQueries({ queryKey: ['maps'] });

  };

  const handleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTheme(value);
    setUserHasTyped(true); // Stop the scrolling when user types
    // Clear cached data when theme changes
    queryClient.removeQueries({ queryKey: ['maps'] });
  }

  const handleLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
    // Clear cached data when location changes  
    queryClient.removeQueries({ queryKey: ['maps'] });
  }

  interface HandleSubmitEvent extends React.MouseEvent<HTMLButtonElement> {
    preventDefault: () => void;
  }

  const handleSubmit = (event: HandleSubmitEvent): void => {
    event.preventDefault();
    // Clear any existing data before refetching
    queryClient.invalidateQueries({ queryKey: ['maps'] });
    refetch();
  };

  const loadAILocations = useCallback(() => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error('Google Maps API components not fully loaded yet');
      // Fallback to random location
      setIsAI(false);
      loadRandomLocation();
      return;
    }

    if (data && data.locations) {
      console.log('Starting to geocode AI locations:', data.locations);
      setIsLoading(true);
      
      // Use Google's Geocoding service to convert addresses to coordinates
      const geocoder = new google.maps.Geocoder();
      const locationPromises = data.locations.map((location, index) => {
        return new Promise<{lat: number, lng: number}>((resolve, reject) => {
          // Add a delay for ALL requests, including the first one
          setTimeout(() => {
            geocoder.geocode({ address: String(location.location) }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const latLng = results[0].geometry.location;
                console.log(`Successfully geocoded location ${index + 1}: ${location.location}`);
                resolve({
                  lat: latLng.lat(),
                  lng: latLng.lng()
                });
              } else {
                console.error('Geocoding failed for:', location.location, status);
                reject(new Error(`Geocoding failed for ${location.location}: ${status}`));
              }
            });
          }, (index + 1) * 300); // Start from 300ms, then 600ms, 900ms, etc.
        });
      });

      // Wait for all addresses to be geocoded
      Promise.all(locationPromises)
        .then(coordinates => {
          console.log('Successfully geocoded AI locations:', coordinates);
          setAiLocations(coordinates);
          setCurrentAiLocationIndex(0);
          
          // Load the first AI location
          if (coordinates.length > 0) {
            setCurrentLocation(coordinates[0]);
            
            // Initialize the panorama with the first AI location
            setTimeout(() => {
              const panorama = new google.maps.StreetViewPanorama(
                document.getElementById("pano") as HTMLElement,
                {
                  position: coordinates[0],
                  pov: {
                    heading: Math.random() * 360,
                    pitch: Math.random() * 40 - 20,
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
                  source: google.maps.StreetViewSource.GOOGLE,
                } as google.maps.StreetViewPanoramaOptions & { compassControl: boolean, source: google.maps.StreetViewSource }
              );

              panorama.addListener('pov_changed', () => {
                const pov = panorama.getPov();
                setCurrentHeading(pov.heading || 0);
              });

              setCurrentHeading(panorama.getPov().heading || 0);
              setIsLoading(false);
            }, 1000);
          }
        })
        .catch(error => {
          console.error('Error geocoding AI locations:', error);
          setIsLoading(false);
          setIsAI(false); // Reset AI flag since we're falling back
          // Fallback to random location if geocoding fails
          loadRandomLocation();
        });
    } else {
      console.log('No AI locations data available, loading random location');
      setIsAI(false);
      loadRandomLocation();
    }
  }, [data, loadRandomLocation]);

  const loadNextAILocation = useCallback(() => {
    if (!isAI || !aiLocations.length) return;
    
    const nextIndex = currentAiLocationIndex + 1;
    
    if (nextIndex < aiLocations.length) {
      setCurrentAiLocationIndex(nextIndex);
      const nextLocation = aiLocations[nextIndex];
      setCurrentLocation(nextLocation);
      setIsLoading(true);
      
      // Update panorama with next AI location
      setTimeout(() => {
        const panorama = new google.maps.StreetViewPanorama(
          document.getElementById("pano") as HTMLElement,
          {
            position: nextLocation,
            pov: {
              heading: Math.random() * 360,
              pitch: Math.random() * 40 - 20,
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
            source: google.maps.StreetViewSource.GOOGLE,
          } as google.maps.StreetViewPanoramaOptions & { compassControl: boolean, source: google.maps.StreetViewSource }
        );

        panorama.addListener('pov_changed', () => {
          const pov = panorama.getPov();
          setCurrentHeading(pov.heading || 0);
        });

        setCurrentHeading(panorama.getPov().heading || 0);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAI, aiLocations, currentAiLocationIndex]);

  useEffect(() => {
      if (divRef.current) {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, []);

    const [themeScroll, setThemeScroll] = useState('Nature');
    const [userHasTyped, setUserHasTyped] = useState(false);

    useEffect(() => {
      if (!userHasTyped) {
        const themeArray = ['Nature?', 'Urban?', 'Historical?', 'Beach?', 'Mountains?', 'Desert?', 'Rural?', 'Restaurants?', 'Bridges?'];
        let currentIndex = 0;
        
        const interval = setInterval(() => {
          currentIndex = (currentIndex + 1) % themeArray.length;
          setThemeScroll(themeArray[currentIndex]);
        }, 2000);

        return () => clearInterval(interval);
      }
    }, [userHasTyped, gameStarted]);

  return (
    <div className='h-screen w-full'>
      { gameStarted && !showFinalResults && <p className='absolute top-0 left-0 p-2 z-50 bg-blue-500 rounded-lg ring-2 ring-white text-white text-2xl translate-x-4 translate-y-4 '>Score: {score}</p> }
      { gameStarted && !showFinalResults && <p className='absolute top-0 right-0 p-2 z-50 bg-blue-500 rounded-lg ring-2 ring-white text-white text-2xl -translate-x-4 translate-y-4 '>Round: {roundNumber}</p> }
      {showResultsMap ? <div className='absolute top-8 left-[50%] p-2 z-50 bg-green-500 rounded-lg ring-2 ring-white text-white text-4xl font-semibold -translate-x-[50%]'>{scoreAlert}<div className='text-xl text-center'>{distanceDisplay} KM AWAY</div></div> : ''}

      {/* Show loading/black screen when no location is loaded or loading */}
      {(!currentLocation || isLoading) && (
        <div className='absolute top-0 left-0 z-20 h-screen w-full bg-black flex items-center justify-center'>
          <div className='text-white text-2xl flex flex-col items-center gap-4'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white'></div>
            <div>{isLoading ? 'Loading next location...' : 'Loading location...'}</div>
          </div>
        </div>
      )}

      {!gameStarted && (
        <div className='absolute top-0 left-0 z-20 h-screen w-full bg-blue-500 flex items-center justify-center' 
        style={{
           background: 'linear-gradient(180deg,rgba(59, 130, 246, 1) 25%, rgba(34, 197, 94, 1) 76%)'
        }}
        >
          <div className='text-white text-2xl flex flex-col items-center gap-4'>
            <h2 className='text-6xl font-bold mb-8'>Geo Guessing Game</h2>
            <p className='text-xl mb-4'>Guess the location based on the street view image!</p>
            <p className='text-lg mb-4'>Score points based on how close your guess is to the actual location.</p>
            <p className='text-lg mb-8'>There are 5 rounds, each with a different location to guess.</p>
          <button onClick={() => startGame()}
            className="p-4 ring-2 ring-white rounded-full z-40 items-center justify-center bg-gradient-to-bl from-lime-400 to-green-600 hover:bg-white hover:bg-opacity-30 transition-colors duration-300 text-white text-2xl font-semibold"
          >Start Random Game</button>

        <p className='text-xl mb-4 mt-8'>Or try an AI generated set of locations:</p>
        <form id="input" className='justify-center items-center'>
          <label className='text-xl'>Location: 
          <input
            onChange={handleLocation}
            value={location}
            type="text"
            name='input'
            className='text-black ring-blue-400  ring-2 rounded-md p-2 m-2 bg-white'
          /></label>
          <label className='text-xl'>Theme: 
          <input
            onChange={handleTheme}
            value={userHasTyped ? theme : themeScroll}
            onFocus={() => setUserHasTyped(true)}
            type="text"
            name='input'
            className={` ring-blue-400 ring-2 rounded-md p-2 m-2 bg-white ${userHasTyped ? 'text-black' : 'text-gray-500'} `}
          /></label>
          <div className="place-self-center m-10">
          { !data && <button className={`bg-gradient-to-bl from-lime-400 to-green-600 font-medium text-2xl rounded-full p-4 ring-white ring-2 m-10 flex items-center gap-3`}
            onClick={handleSubmit}
            disabled={ isFetching }>
            { isFetching && (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            { isFetching ? 'Generating' : 'Generate' }
          </button> }
          { data && 
          <button className={`bg-gradient-to-bl from-lime-400 to-green-600 font-medium text-2xl rounded-full p-4 ring-white ring-2`}
            onClick={startAIGame}
            disabled={ isFetching }>
            Start AI Game
          </button>}
        </div>
        </form>
          </div>
        </div>
      )}
      

      {/* back to start button */}
      {gameStarted && (
      <button onClick={() => initialize()}
        className="absolute bottom-32 left-6 p-1 ring-2 ring-white rounded-lg z-40 items-center justify-center bg-gray-500 bg-opacity-60"
      ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw inline"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Start</button>)}
      
      {/* Custom Compass - only show when location is loaded */}
      {currentLocation && gameStarted && (
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

      {showFinalResults && (<h2 className='text-6xl font-bold absolute top-4 z-50 left-1/2 -translate-x-1/2'>Final Result</h2>)}
      {showFinalResults && (<h2 className='text-4xl font-bold p-4 bg-green-500 ring-2 ring-white rounded-xl absolute bottom-20 z-50 left-1/2 -translate-x-1/2'>Final Score: {score}</h2>)}
      {/* Hidden div for Google Maps API initialization */}
      <div id="map" style={{ display: 'none' }}></div>
      
      {/* Street View Panorama */}
      <div 
        id="pano" 
        className="absolute top-0 left-0 z-10 h-screen w-full"
      ></div>
      
      {/* Regular Map */}
      { gameStarted && (
      <div 
        //className="dark:bg-black dark:text-white bg-white text-black absolute bottom-0 right-0 z-40" 
        style={ showResultsMap || showFinalResults? {
          width: mapSize.width, height: mapSize.height, 
          background: 'linear-gradient(180deg,rgba(59, 130, 246, 1) 25%, rgba(34, 197, 94, 1) 76%)'
        } : { width: mapSize.width, height: mapSize.height }}
        className={showResultsMap || showFinalResults ? 'absolute top-0 left-0 z-40 p-20 h-screen w-full bg-blue-500 flex items-center justify-center' : "dark:bg-black dark:text-white bg-white text-black absolute bottom-0 right-0 z-40" }
      >
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY || ''} onLoad={() => {
          setMapsLoaded(true);
        }}>
          <div className={`relative h-full w-full [&_.gm-style-cc]:hidden [&_.gm-style]:child:[last-child]:hidden mapCursor ${showResultsMap || showFinalResults? ' rounded-[5rem] overflow-hidden ring-2 ring-white' : ''}`}>
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
      gestureHandling={'passive'}
      onClick={handleMapClick}
      onCameraChanged={ (ev: MapCameraChangedEvent) => {
        // Update state when user interacts with map
        setMapCenter(ev.detail.center);
        setMapZoom(ev.detail.zoom);
      }}>
      <MapHelper onMapReady={setMapInstance} />
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
      {!showResultsMap && !showFinalResults && marker && (
        <AdvancedMarker position={marker}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#DC2626" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
        </AdvancedMarker>
      )}
      {showFinalResults && playerGuesses.map((guess, index) => (
          <AdvancedMarker position={guess} key={'guess' + index}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#DC2626" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            <p className='absolute -translate-y-16 translate-x-7 px-2 font-bold bg-white text-black text-lg rounded-full z-50'>{index + 1}</p>
            </AdvancedMarker>
          ))}
      {showFinalResults && correctGuesses.map((correct, index) => (
            <AdvancedMarker position={correct} key={'correct' + index}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#16A34A" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-check-inside-icon lucide-map-pin-check-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m9 10 2 2 4-4"/></svg>
            <p className='absolute -translate-y-16 translate-x-7 px-2 font-bold bg-white text-black text-lg rounded-full z-50'>{index + 1}</p>
            </AdvancedMarker>
          ))
      }
   </Map>
   </div>
        </APIProvider>
        {/* zoom buttons */}
        {expanded === 0 && !showResultsMap && !showFinalResults ? (
          <button className='absolute top-0 left-0 bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
            +
          </button>
        ) : ''}
        {expanded === 1 && !showResultsMap && !showFinalResults ? (
          <div className='flex absolute top-0 left-0'>
          <button className=' bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          +
          </button>
          <button className='bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          -
        </button>
        </div>
        ) : ''}
        {expanded === 2 && !showResultsMap && !showFinalResults ?
        <button className='absolute top-0 left-0 bg-gray-500 bg-opacity-40 text-white  px-2 rounded text-2xl' onClick={expandMap} disabled={showResultsMap}>
          -
        </button> : ''}
        {!showResultsMap && !showFinalResults ? (
          <button 
            className='absolute bottom-1 left-1 bg-gradient-to-bl from-lime-400 to-green-600 text-white px-3 rounded-full text-xl ring-2 ring-white disabled:bg-gray-500 disabled:text-gray-400' 
            onClick={() => submitGuess()}
            disabled={isLoading || !marker}
          >
            Submit
          </button>
        ) : 
          (roundNumber <= 5 ? (
            <button 
              className='absolute bottom-0 block bg-gradient-to-bl from-sky-400 to-blue-600 text-white p-2 px-4 rounded-full text-3xl ring-2 ring-white animate-pulse -translate-y-3' 
              onClick={() => nextRound()}
            >
              { roundNumber < 5 &&  'Next Round' }
              { roundNumber === 5 && 'Finish' }
            </button>
          ) : (
            <button 
              className='absolute bottom-0 block bg-gradient-to-bl from-sky-400 to-blue-600 text-white p-2 px-4 rounded-full text-3xl ring-2 ring-white animate-pulse -translate-y-3' 
              onClick={() => restartGame()}
            >
              End Game
            </button>
          ))
      }
      </div>
      )}
      <div className='bottom-0' ref={divRef}></div>
      </div>
      
  )
}

export default Geo
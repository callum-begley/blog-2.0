// Client-side service to interact with server-side Google Maps API
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResponse {
  success: boolean;
  coordinates?: Coordinates;
  formatted_address?: string;
  error?: string;
  status?: string;
}

export interface StreetViewMetadata {
  status: string;
  location?: {
    lat: number;
    lng: number;
  };
  pano_id?: string;
  date?: string;
}

// Geocode an address using our server-side endpoint
export const geocodeAddress = async (address: string): Promise<GeocodeResponse> => {
  try {
    const response = await fetch(`/api/v1/geocode?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: 'Failed to geocode address'
    };
  }
};

// Check Street View availability using our server-side endpoint
export const checkStreetViewAvailability = async (
  lat: number, 
  lng: number, 
  radius: number = 50000
): Promise<StreetViewMetadata> => {
  try {
    const response = await fetch(
      `/api/v1/streetview/metadata?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Street View metadata error:', error);
    return {
      status: 'REQUEST_DENIED'
    };
  }
};

// Batch geocode multiple addresses
export const batchGeocodeAddresses = async (addresses: string[]): Promise<Coordinates[]> => {
  const promises = addresses.map(address => geocodeAddress(address));
  const results = await Promise.all(promises);
  
  return results
    .filter(result => result.success && result.coordinates)
    .map(result => result.coordinates!);
};

import { useState, useEffect } from 'react';

interface GoogleMapsKeyResponse {
  apiKey: string;
}

export const useGoogleMapsKey = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/maps-key');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Google Maps API key');
        }
        
        const data: GoogleMapsKeyResponse = await response.json();
        setApiKey(data.apiKey);
        setError(null);
      } catch (err) {
        console.error('Error fetching Google Maps API key:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setApiKey('');
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, loading, error };
};

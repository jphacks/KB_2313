
import {useJsApiLoader } from '@react-google-maps/api'
import { useCallback } from 'react';

export type Map = google.maps.Map;

const MAP_API_KEY = import.meta.env.VITE_API_KEY;

export const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: MAP_API_KEY,
  });

  const onLoad = () => {
    // Do something when map is loaded.
  };

  const onUnmount = useCallback(() => {}, []);

  return { isLoaded, onLoad, onUnmount };
};
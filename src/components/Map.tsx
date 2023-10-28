
import {useJsApiLoader } from '@react-google-maps/api'
import { useCallback } from 'react';

export type Map = google.maps.Map;

const MAP_API_KEY = import.meta.env.VITE_API_KEY;

type Props = {
  defaultPosition: { lat: number; lng: number };
};

export const Map = ({ defaultPosition }: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: MAP_API_KEY,
  });

  const onLoad = (map: Map) => {
    // Do something when map is loaded.
  };

  const onUnmount = useCallback(() => {}, []);

  return { isLoaded, onLoad, onUnmount };
};
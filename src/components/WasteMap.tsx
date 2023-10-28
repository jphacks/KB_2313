import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import React, { FC, useEffect, useState } from "react";
import { Map } from "./Map";

interface Props {
  defaultPosition: {
    lat: number;
    lng: number;
  };
}

const Component: FC<Props> = ({ defaultPosition}) => {
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Error: Geolocation is not supported");
    }

  const { isLoaded, onLoad } = Map({
    defaultPosition: currentPosition,
  });

    const containerStyle = {
      height: "75vh",
      width: "100vw",
    };

    return (
      <>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            onLoad={onLoad}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <Marker key={index} position={currentPosition} />
            ))}
          </GoogleMap>
        ) : (
          "loading"
        )}
      </>
    );
  };

  export const WasteMap = Component;
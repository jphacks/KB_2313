import { GoogleMap, MarkerF} from "@react-google-maps/api";
import React, {useState, useEffect } from "react";
import { Map } from "./Map";
import currentMarker from "../assets/map-pin-svgrepo-com.svg";
import { Position } from "../types/position"


export default function WasteMap() {
  const [currentPosition, setCurrentPosition] = useState<Position>({lat: 0, lng: 0});

  useEffect(() => {
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
  }, []);

  const { isLoaded, onLoad } = Map();

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
              <MarkerF position={currentPosition} icon={{ url: currentMarker }}/>
          </GoogleMap>
        ) : (
          "loading"
        )}
      </>
    );
  }

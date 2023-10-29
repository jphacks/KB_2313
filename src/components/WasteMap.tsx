import React, {useState, useEffect} from "react";
import { useLocation } from "react-dom"
import { GoogleMap, MarkerF} from "@react-google-maps/api";

import supabase from "./Supabase";
import { Map } from "./Map";

import { Position } from "../types/position"
import { TrashCanLocation } from "../types/trashCanLocation";

import currentMarker from "../assets/map-pin-svgrepo-com.svg";
import trashCanMarker from "../assets/trash-can-with-cover-from-side-view-svgrepo-com.svg";


export default function WasteMap() {
  const [currentPosition, setCurrentPosition] = useState<Position>({lat: 0, lng: 0});
  const [trashCanLocations, setTrashCanLocations] = useState<TrashCanLocation[]>([]);
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

  useEffect(() => {
    const fetchTrashCanLocations = async () => {
      try {
        const { data, error } = await supabase.from("trash_can_location").select("*");
        if (error) {
          throw error;
        }
        setTrashCanLocations(data.map((item) => ({
          id: item.id,
          created_at: item.created_at,
          lat: item.trash_can_lat,
          lng: item.trash_can_lng
        })));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrashCanLocations();
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
            zoom={17}
            onLoad={onLoad}
          >
            {trashCanLocations.map((trashCanLocation) => (
              <MarkerF key={trashCanLocation.id} position={trashCanLocation} icon={{ url : trashCanMarker }}/>
            ))}
              <MarkerF position={currentPosition} icon={{ url : currentMarker }}/>
          </GoogleMap>
        ) : (
          "loading"
        )}
      </>
    );
  }

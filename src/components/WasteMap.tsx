import { GoogleMap, MarkerF} from "@react-google-maps/api";
import React, {useState, useEffect } from "react";
import { Map } from "./Map";
import currentMarker from "../assets/map-pin-svgrepo-com.svg";
import { Position } from "../types/position"
import supabase from "./Supabase"
import { TrashCanLocation } from "../types/trashCanLocation";

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

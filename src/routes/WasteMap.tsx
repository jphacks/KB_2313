import {useState, useEffect} from "react";
import { GoogleMap, MarkerF} from "@react-google-maps/api";
import { useLocation } from "react-router-dom"

import supabase from "../components/Supabase";
import { Map } from "../components/Map";

import { Position } from "../types/position"
import { TrashCanLocation } from "../types/trashCanLocation";

import trashCanMarkerBlue from "../assets/trash-can-with-cover-from-side-view-svgrepo-com-blue.svg";
import trashCanMarker from "../assets/trash-can-with-cover-from-side-view-svgrepo-com.svg";


export default function WasteMap() {

  const [currentPosition, setCurrentPosition] = useState<Position>({lat: 0, lng: 0});
  const [trashCanLocations, setTrashCanLocations] = useState<TrashCanLocation[]>([]);
  const [isAddtrashcanTrue, setIsAddtrashcanTrue] = useState<boolean>(false);

  // url queryを取得
  const location = useLocation().search;
  const query = new URLSearchParams(location);
  console.log(query.get("isAddtrashcanTrue"));

  // 現在地を取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          console.log("currentPosition is set")
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Error: Geolocation is not supported");
    }
  }, []);

  // DBに登録されたゴミ箱の位置を取得
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
          lng: item.trash_can_lng,
          is_trashcan_is_added: false
        })))
        console.log("trashCanLocations is set");
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrashCanLocations();
  }, []);

  // DBに現在地にあるゴミ箱の位置を登録
  useEffect(() => {
    if (query.get("isAddtrashcanTrue") === "True" && currentPosition.lat !== 0 && currentPosition.lng !== 0) {
      console.log("AddCurrentPosition is called");
      const postCurrentPosition = async () => {
        try {
          const { error } = await supabase.from("trash_can_location").insert([
            {
              trash_can_lat: currentPosition.lat,
              trash_can_lng: currentPosition.lng,
            }
          ]);
          if (error) {
            throw error;
          }
          console.log("currentPosition is posted")
          const { data, error: fetchError } = await supabase.from("trash_can_location").select("*").eq("trash_can_lat", currentPosition.lat).eq("trash_can_lng", currentPosition.lng);
          if (fetchError) {
            throw fetchError;
          }
          console.log("data is re fetched")
          setIsAddtrashcanTrue(true);
          setTrashCanLocations((prevLocations) => [...prevLocations, {
            id: data[0].id,
            created_at: data[0].created_at,
            lat: data[0].trash_can_lat,
            lng: data[0].trash_can_lng,
            is_trashcan_is_added: true
          }]);
        } catch (error) {
          console.error(error);
        }
      }
      postCurrentPosition()
    }
    return () => {
      console.log("AddCurrentPosition is not called");
    }
  }, [currentPosition]);

  const { isLoaded, onLoad } = Map();

  const containerStyle = {
    height: "100vh",
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
              <MarkerF
                title={"trash can"}
                key={trashCanLocation.id}
                position={trashCanLocation}
                icon={{
                  url: trashCanLocation.is_trashcan_is_added ? trashCanMarkerBlue : trashCanMarker
                }}
              />
            ))}
              <MarkerF position={currentPosition}/>
          </GoogleMap>

        ) : (
          "loading"
        )}
        {isAddtrashcanTrue && <h1>Can is added!</h1>}
      </>
    );
  }

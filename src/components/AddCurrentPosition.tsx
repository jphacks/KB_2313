import supabase from "./Supabase"
import { Position } from "../types/position";


export default function AddCurrentPosition(position: Position) {
  const postCurrentPosition = async () => {
    try {
      const { error } = await supabase.from("trash_can_location").insert([
        {
          trash_can_lat: position.lat,
          trash_can_lng: position.lng,
        }
      ]);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  }
  postCurrentPosition()
}
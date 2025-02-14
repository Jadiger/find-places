
import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { Overpass } from "./overpass";


export const Categories = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation xatosi:", error);
          setLocation({ lat: 42.4531, lng: 59.61 });
        }
      );
    } else {
      setLocation({ lat: 42.4531, lng: 59.61 });
    }
  }, []);

  

  return (
    <>
      {!location && (
        <Center>
          <Loader />
        </Center>
      )}
      {location && (
        
          <Overpass lat={location.lat} lng={location.lng} />
        
      )}
    </>
  );
};


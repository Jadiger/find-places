
import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import {  SetCategory } from "./set-category";


export const Categories = ({close}:{close : ()=> void}) => {
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
        
          <SetCategory lat={location.lat} lng={location.lng} close={close}/>
        
      )}
    </>
  );
};


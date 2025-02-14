import { useParams } from "react-router";
import { MapBox } from "./mapbox";
import { useEffect, useState } from "react";

export const MapComponent = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const { category } = useParams();

  console.log(category);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Geolocation xatosi:", error);
          setLocation({ lat: 42.4531, lon: 59.61 });
        }
      );
    } else {
      setLocation({ lat: 42.4531, lon: 59.61 });
    }
  }, []);
  return (
    <>
      {location && (
        <div>
          <MapBox location={location} category={category ? category : ""} />
        </div>
      )}
    </>
  );
};

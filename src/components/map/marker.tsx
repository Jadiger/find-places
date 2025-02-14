import React, { Dispatch, useEffect, useState } from "react";
import { Place } from "../../types";
import mapboxgl from "mapbox-gl";
import { Loader } from "@mantine/core";

export const Marker = ({
  setSelectedPlace,
  location,
  map,
  places,
  open
}: {
  setSelectedPlace: Dispatch<React.SetStateAction<Place | null>>;
  location: { lat: number; lon: number };
  map: mapboxgl.Map;
  places: Place[];
  open : ()=> void
}) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [loading, setIsloading] = useState<boolean>(false);
 

  useEffect(() => {
    setIsloading(true);
    markers.forEach((marker) => marker.remove());
    const newMarkers: mapboxgl.Marker[] = [];

    const userMarker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([location.lon, location.lat])
      .setPopup(new mapboxgl.Popup().setText("Your Location"))
      .addTo(map);

    newMarkers.push(userMarker);

    places.forEach((place) => {
      const popupContent = `
        ${place.name.split('_').join(' ').toUpperCase()}
      `;

      const popup = new mapboxgl.Popup({ offset: 25 ,closeButton : false,className: 'marker_active'}).setHTML(popupContent);

      const marker = new mapboxgl.Marker()
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map);

      newMarkers.push(marker);
      setIsloading(false);

      marker.getElement().addEventListener("click", () => {
        map.flyTo({
          center: [place.lon, place.lat],
          zoom: 15,
          essential: true,
        });

        
          
        
        setSelectedPlace(place);
        open()
      });
    });

    setMarkers(newMarkers);
  }, [map, places]);

  return (
    <>
      {loading && (
        <div
          style={{
            background: "#02020246",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            zIndex: 1000,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          <Loader />
        </div>
      )}
    </>
  );
};

import React, { Dispatch, useEffect, useState } from "react";
import { Place } from "../../types";
import mapboxgl from "mapbox-gl";
import { Loader } from "@mantine/core";

export const Marker = ({
  setSelectedPlace,
  location,
  map,
  places,
  open,
}: {
  setSelectedPlace: Dispatch<React.SetStateAction<Place | null>>;
  location: { lat: number; lon: number };
  map: mapboxgl.Map;
  places: Place[];
  open: () => void;
}) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [loading, setIsloading] = useState<boolean>(false);
  // 🟢 Kategoriya bo‘yicha mos ikonlarni aniqlash funksiyasi
  const getIcon = (category: string) => {
    const icons: Record<string, string> = {
      restaurant: "/icons/restaurant.png",
      cafe: "/icons/cafe.png",
      hospital: "https://cdn-icons-png.flaticon.com/128/3176/3176363.png",
      school: "/icons/school.png",
      shop: "/icons/shop.png",
      default: "/icons/placeholder.png",
    };
    return icons[category] || icons["default"];
  };

  useEffect(() => {
    setIsloading(true);
    markers.forEach((marker) => marker.remove());
    const newMarkers: mapboxgl.Marker[] = [];

    // 🟢 Foydalanuvchi lokatsiyasi (qizil marker)
    const userMarker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([location.lon, location.lat])
      .setPopup(new mapboxgl.Popup().setText("Your Location"))
      .addTo(map);

    newMarkers.push(userMarker);

    // 🟢 Har bir joy uchun mos ikonni o‘rnatish
    places.forEach((place) => {
      const popupContent = `
        ${place.name.split("_").join(" ").toUpperCase()}
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: "marker_active",
      }).setHTML(popupContent);

      // 🟢 Yangi marker element yaratish
      const icon = document.createElement("img");
      icon.src = getIcon(place.category);
      icon.style.width = "25px";
      icon.style.height = "25px";
      icon.style.cursor = "pointer";

      // 🟢 Marker qo‘shish
      const marker = new mapboxgl.Marker({ element: icon })
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map);

      newMarkers.push(marker);
      setIsloading(false);

      // 🟢 Marker bosilganda xaritani joyga olib borish
      marker.getElement().addEventListener("click", () => {
        map.flyTo({
          center: [place.lon, place.lat],
          zoom: 18,
          essential: true,
        });

        setSelectedPlace(place);
        open();
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

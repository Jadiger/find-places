import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: string;
  rating: string;
  opening_hours: string;
  website: string;
  phone: string;
}

interface PlacesProps {
  places: Place[];
  map: mapboxgl.Map; // Mapni props orqali olish
}

export const Places = ({ places, map }: PlacesProps) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  // 📌 Markerlarni qo‘shish
  useEffect(() => {
    if (!map || !places.length) return;

    // 🔵 Eski markerlarni o‘chirish
    markers.forEach((marker) => marker.remove());

    const newMarkers: mapboxgl.Marker[] = [];

    places.forEach((place) => {
      const popupContent = `
        <h3>${place.name ? place.name : "Noma'lum joy"}</h3>
        <p>Kategoriya: ${place.category ? place.category : "Noma'lum"}</p>
        <p>Reyting: ${place.rating ? place.rating : "Reyting mavjud emas"}</p>
        <p>Ochilish vaqti: ${
          place.opening_hours
            ? place.opening_hours
            : "Ochilish vaqti ma'lum emas"
        }</p>
        <p>Veb-sayt: <a href="${place.website}" target="_blank">${
        place.website ? place.website : "Mavjud emas"
      }</a></p>
        <p>Telefon: ${
          place.phone ? place.phone : "Telefon raqami mavjud emas"
        }</p>
      `;
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker()
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map);

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [places, map]);

  return null;
};

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
// import { SelectedPlaceInfo } from "./selected-place-info";
// import { useDisclosure } from "@mantine/hooks";
import { Marker } from "./marker";
import { IOverPassData, IRoute, Place } from "../../types";
import { notifications } from "@mantine/notifications";


mapboxgl.accessToken =
  "pk.eyJ1IjoiamFkaWdlciIsImEiOiJjbTZ6ZnB1M3cwNDFtMmlwZjFqZ2gzOWMwIn0.8XL2yGrchdup7gv3EeVkAg";

interface MapProps {
  location: { lat: number; lon: number };
  category?: string;
}

export const MapBox = ({ location, category }: MapProps) => {
  // const [opened, { open, close }] = useDisclosure(false);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [places, setPlaces] = useState<Place[] | []>([]);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [transportMode, setTransportMode] = useState<
    "driving" | "walking" | "cycling" | "motorcycling"
  >("walking");
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [route, setRoute] = useState<IRoute | null>(null);
  console.log(route);
console.log(route);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/light-v11",
      center: [location.lon, location.lat],
      zoom: 13,
    });

    setMap(mapInstance);

    mapInstance.on("load", () => {
      fetchPlaces(category);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [location, category]);

  const fetchPlaces = async (categoryFilter?: string) => {
    const query = `[out:json];node(around:5000,${location.lat},${
      location.lon
    })${categoryFilter ? `[amenity=${categoryFilter}]` : `[amenity]`};out;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const response = await fetch(url);
      const data : IOverPassData = await response.json();
      console.log(data);
      
      const fetchedPlaces = data.elements.map((item) => ({
        id: item.id,
        name: item.tags.name || "Noma'lum joy",
        lat: item.lat,
        lon: item.lon,
        category: item.tags.amenity || "unknown",
        rating: item.tags.rating || "N/A",
        phone: item.tags.phone || "N/A",
        website: item.tags.website || "N/A",
        address: item.tags.address || "N/A",
      }));

      setPlaces(fetchedPlaces);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    }
  };
  const drawRoute = () => {
    if (!map || !selectedPlace) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${location.lon},${location.lat};${selectedPlace.lon},${selectedPlace.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes.length > 0) {
          const routeLine = data.routes[0].geometry;
          setRoute(routeLine);

          if (map.getSource("route")) {
            map.removeLayer("route");
            map.removeSource("route");
          }

          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: routeLine,
            },
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#007AFF", "line-width": 5 },
          });

          const duration = data.routes[0].duration / 60;
          setTravelTime(`${duration.toFixed(1)} minute`);
        }
      })
      .catch((err) =>
        notifications.show({
          title: "Error loading routing type",
          message: err.message,
          color: "red",
        })
      );
  };

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
        width: "100vw",
        position: "relative",
      }}
    >
      {map && (
        <Marker
          setSelectedPlace={setSelectedPlace}
          map={map}
          location={location}
          places={places}
        />
      )}
      <div id="map-container" style={{ height: "100%", width: "100%" }}></div>

      {/* {selectedPlace && (
        <SelectedPlaceInfo
          place={selectedPlace}
          opened={opened}
          close={close}
        />
      )} */}

      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <label>Type of transport:</label>
        <select
          value={transportMode}
          onChange={(e) => {
            drawRoute();
            setTransportMode(
              e.target.value as
                | "driving"
                | "walking"
                | "cycling"
                | "motorcycling"
            );
          }}
        >
          <option value="walking">🚶 Walking</option>
          <option value="driving">🚗 Car</option>
          <option value="cycling">🚴‍♂️ Bicycle</option>
          <option value="motorcycling">🛵 Bike</option>
        </select>

        <button onClick={drawRoute} disabled={!selectedPlace}>
          🚀 Draw Route
        </button>

        {travelTime && <p>⏳ Arrival Time: {travelTime}</p>}
      </div>
    </div>
  );
};

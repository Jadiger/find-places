import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SelectedPlaceInfo } from "./selected-place-info";
import { useDisclosure } from "@mantine/hooks";
import { Marker } from "./marker";
import { IOverPassData, Place } from "../../types";
import { notifications } from "@mantine/notifications";
import { useCategory } from "../../context-reducer/context";
import { Loader } from "@mantine/core";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFkaWdlciIsImEiOiJjbTZ6ZnB1M3cwNDFtMmlwZjFqZ2gzOWMwIn0.8XL2yGrchdup7gv3EeVkAg";

export const MapBox = ({
  location,
}: {
  location: { lat: number; lon: number };
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [places, setPlaces] = useState<Place[] | []>([]);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [travelTime, setTravelTime] = useState<string | null>(null);
  const { state } = useCategory();
  const category = state.selectedCategory.value;

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/jadiger/cm76dbf2x01vp01qx4kgvawoj",
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
    setLoading(true);
    const query = `[out:json];node(around:2000,${location.lat},${
      location.lon
    })${
      categoryFilter && categoryFilter !== "all"
        ? `[amenity=${categoryFilter}]`
        : `[amenity]`
    };out;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const response = await fetch(url);
      const data: IOverPassData = await response.json();
      console.log(data);

      const fetchedPlaces = data.elements.map((item) => ({
        id: item.id,
        name: item.tags.name || "Belgisiz",
        lat: item.lat,
        lon: item.lon,
        category: item.tags.amenity || "unknown",
        rating: item.tags.rating || "N/A",
        phone: item.tags.phone || "N/A",
        website: item.tags.website || "N/A",
        address: item.tags.address || "N/A",
      }));

      setPlaces(fetchedPlaces);
      // @ts-expect-error
    } catch (error: { message: string }) {
    

      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
       setLoading(false);
    }
   
  };
  const drawRoute = () => {
    if (!map || !map.isStyleLoaded() || !selectedPlace) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/${state.transportMode}/${location.lon},${location.lat};${selectedPlace.lon},${selectedPlace.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes.length === 0) {
          notifications.show({
            title: "Route Not Found",
            message: "No available routes for the selected transport mode.",
            color: "yellow",
          });
          return;
        }

        const routeLine = data.routes[0].geometry;

        if (map.getSource("route")) {
          if (map.getLayer("route")) map.removeLayer("route");
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
      })
      .catch((err) => {
        notifications.show({
          title: "Error loading route",
          message: err.message,
          color: "red",
        });
      });
  };
console.log(map);

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
          open={open}
        />
      )}
      <div id="map-container" style={{ height: "100%", width: "100%" }}></div>

      {selectedPlace && (
        <>
          <SelectedPlaceInfo
            drawRoute={drawRoute}
            place={selectedPlace}
            opened={opened}
            close={close}
            travelTime={travelTime}
          />
        </>
      )}
      {loading && (
        <div className="absolute top-0 left-0 flex justify-center items-center bg-gray-300 w-full h-full">
          <Loader />
        </div>
      )}
    </div>
  );
};

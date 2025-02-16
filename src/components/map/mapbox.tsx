import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SelectedPlaceInfo } from "./selected-place-info";
import { useDisclosure } from "@mantine/hooks";
import { Marker } from "./marker";
import { IOverPassData, Place } from "../../types";
import { notifications } from "@mantine/notifications";
import { useCategory } from "../../context-reducer/context";
import { ActionIcon, Loader, Stack } from "@mantine/core";
import { IconLocation, IconZoomIn, IconZoomOut } from "@tabler/icons-react";

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
  const { state, dispatch } = useCategory();
  const category = state.selectedCategory.value;

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/jadiger/cm76dbf2x01vp01qx4kgvawoj",
      center: [location.lon, location.lat],
      zoom: state.zoom,
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
  }, [location, category, state.radius]);

  const fetchPlaces = async (categoryFilter?: string) => {
    setLoading(true);
    const query = `[out:json];node(around:${state.radius},${location.lat},${
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
      console.log(data.elements);

      const fetchedPlaces = data.elements.map((item) => ({
        id: item.id,
        name: item.tags.name,
        lat: item.lat,
        lon: item.lon,
        category: item.tags.amenity,
        rating: item.tags.rating,
        phone: item.tags.phone,
        website: item.tags.website,
        address: item.tags.address,
        opening_hours: item.tags.opening_hours,
      }));

      setPlaces(fetchedPlaces);
    } catch (error: unknown) {
      let errorMessage = "Unknown Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      notifications.show({
        title: "Error",
        message: errorMessage,
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

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
        width: "100vw",
        position: "relative",
      }}
    >
      <Stack className="absolute top-5 right-5 z-50">
        <ActionIcon
          size={35}
          p={5}
          variant="light"
          radius="md"
          disabled={state.zoom > 20}
          onClick={() => {
            dispatch({ type: "SET_ZOOM", payload: state.zoom + 1 });
            map?.flyTo({ zoom: state.zoom });
          }}
        >
          <IconZoomIn />
        </ActionIcon>
        <ActionIcon
          size={35}
          disabled={state.zoom < 5}
          p={5}
          variant="light"
          radius="md"
          onClick={() => {
            dispatch({ type: "SET_ZOOM", payload: state.zoom - 1 });
            map?.flyTo({ zoom: state.zoom });
            console.log(state.zoom);
          }}
        >
          <IconZoomOut />
        </ActionIcon>
        <ActionIcon
          size={35}
          p={5}
          variant="light"
          radius="md"
          onClick={() => {
            dispatch({ type: "SET_ZOOM", payload: 18 });
            map?.flyTo({
              center: [location.lon, location.lat],
              zoom: state.zoom,
              essential: true,
            });
          }}
        >
          <IconLocation size={20} />
        </ActionIcon>
      </Stack>
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

      {selectedPlace && map && (
        <>
          <SelectedPlaceInfo
            drawRoute={drawRoute}
            place={selectedPlace}
            opened={opened}
            close={close}
            travelTime={travelTime}
            location={location}
            map={map}
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

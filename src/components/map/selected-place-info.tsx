import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Stack,
} from "@mantine/core";
import { Place } from "../../types";
import { IconX } from "@tabler/icons-react";

export const SelectedPlaceInfo = ({
  place,
  opened,
  close,
  drawRoute,
  travelTime,
  location,
  map,
}: {
  place: Place;
  opened: boolean;
  close: () => void;
  drawRoute: () => void;
  travelTime: string | null;
  location: {
    lat: number;
    lon: number;
  };
  map: mapboxgl.Map;
}) => {
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Yer radiusi (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = haversineDistance(
    location.lat,
    location.lon,
    place.lat,
    place.lon
  );
  console.log(distance.toString().slice(0, 4));

  return (
    <>
      {opened && (
        <div className="h-auto w-full sm:w-96  z-50 absolute bottom-[env(safe-area-inset-bottom)]  left-0 p-5 py-6">
          <Stack gap={10} className="bg-white p-4 mb-5 rounded-md relative">
            {travelTime && (
              <Group
                justify="space-between"
                wrap="nowrap"
                bg="white"
                className="absolute w-full top-0 left-0 rounded-md py-3 px-5"
                style={{ transform: "translateY(calc(-100% - 20px))" }}
              >
                <p>Arrivial Time : </p>
                <Badge color="lime.4">{travelTime}</Badge>
              </Group>
            )}
            <Group justify="space-between" wrap="nowrap" align="start">
              <p className="text-xl font-bold">{place.name || "No name"} </p>{" "}
              <ActionIcon variant="transparent" color="#000" onClick={close}>
                <IconX />
              </ActionIcon>
            </Group>
            <Group justify="space-between" align="center" wrap="nowrap">
              <p>Category: </p>
              {place.category ? (
                <Badge color="lime.4">{place.category}</Badge>
              ) : (
                <Badge color="red">Unknown</Badge>
              )}
            </Group>
            <Group justify="space-between">
              <p>Phone :</p>
              {place.phone ? (
                <Badge color="lime.4">{place.phone}</Badge>
              ) : (
                <Badge color="red">Unknown</Badge>
              )}
            </Group>
            <Group justify="space-between">
              <p>Website :</p>
              {place.website ? (
                <Badge color="lime.4">{place.website}</Badge>
              ) : (
                <Badge color="red">Unknown</Badge>
              )}
            </Group>
            <Group justify="space-between">
              <p>Rating :</p>
              {place.website ? (
                <Badge color="lime.4">{place.website}</Badge>
              ) : (
                <Badge color="red">0</Badge>
              )}
            </Group>
            <Group justify="space-between">
              <p>Opening Hours :</p>
              {place.opening_hours ? (
                <Badge color="lime.4">{place.opening_hours}</Badge>
              ) : (
                <Badge color="red">Unknown</Badge>
              )}
            </Group>
            <Group justify="space-between">
              <p>Distance :</p>
              <Badge>
                {distance > 1
                  ? `${distance.toString().slice(0, 4)} km`
                  : `${Number(distance.toString().slice(0, 5)) * 1000} m`}
              </Badge>
            </Group>

            <Divider my={15} />
            <Group justify="space-between" wrap="nowrap">
              <Button fullWidth onClick={drawRoute}>
                Draw Route
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  map.flyTo({
                    center: [place.lon, place.lat],
                    zoom: 18,
                    essential: true,
                  });
                }}
              >
                Location
              </Button>
            </Group>
          </Stack>
        </div>
      )}
    </>
  );
};

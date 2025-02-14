import { Button } from "@mantine/core";
import { Place } from "../../types";

export const SelectedPlaceInfo = ({
  place,
  opened,
  close,
  drawRoute,
  travelTime,
}: {
  place: Place;
  opened: boolean;
  close: () => void;
  drawRoute: () => void;
  travelTime: string | null;
}) => {
  return (
    <>
      {opened && (
        <div className="h-80 md:h-auto w-full md:w-80  z-50 absolute bottom-[env(safe-area-inset-bottom)] right-0 p-4 md:bottom-auto md:top-0">
          <div className=" w-full h-full p-5 bg-white  shadow-sm shadow-black/35">
            <h2>{place.name}</h2>
            <p>
              <strong>Kategoriya:</strong> {place.category}
            </p>
            {place.rating && (
              <p>
                <strong>Reyting:</strong> {place.rating}
              </p>
            )}
            {place.phone && (
              <p>
                <strong>Telefon:</strong> {place.phone}
              </p>
            )}
            {place.website && (
              <p>
                <strong>Vebsayt:</strong>{" "}
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {place.website}
                </a>
              </p>
            )}
            {place.address && (
              <p>
                <strong>Manzil:</strong> {place.address}
              </p>
            )}
            {travelTime && (
              <p>
                <strong>Travel Time:</strong> {travelTime}
              </p>
            )}
            <Button onClick={close} style={{ marginTop: "10px" }}>
              Yopish
            </Button>
            <Button onClick={drawRoute}>Draw Route</Button>
          </div>
        </div>
      )}
    </>
  );
};

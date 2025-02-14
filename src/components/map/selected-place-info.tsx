import { Button, Drawer } from "@mantine/core";

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: string;
  rating?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export const SelectedPlaceInfo = ({
  place,
  opened,
  close,
}: {
  place: Place;
  opened: boolean;
  close: () => void;
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      withCloseButton={false}
      position="right"
      className="custom-drawer" // ✅ CSS class qo‘shamiz
    >
      <div style={{ padding: "16px" }}>
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
            <a href={place.website} target="_blank" rel="noopener noreferrer">
              {place.website}
            </a>
          </p>
        )}
        {place.address && (
          <p>
            <strong>Manzil:</strong> {place.address}
          </p>
        )}
        <Button onClick={close} style={{ marginTop: "10px" }}>
          Yopish
        </Button>
      </div>
    </Drawer>
  );
};

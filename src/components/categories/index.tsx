
import { Button, Center, Group, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import {  SetCategory } from "./set-category";
import { useDisclosure } from "@mantine/hooks";
import { IconCategory, IconChevronDown, IconChevronUp } from "@tabler/icons-react";


export const Categories = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setLocation({ lat: 42.4531, lng: 59.61 });
        }
      );
    } else {
      setLocation({ lat: 42.4531, lng: 59.61 });
    }
  }, []);

  

  return (
    <>
      {!location && (
        <Center>
          <Loader />
        </Center>
      )}
      {location && (
        <div
          className="z-50 absolute left-0 bottom-0 w-full px-5"
          style={{ transform: "translateY(calc(100% + 20px))" }}
        >
          <Button
          
            onClick={() => {
              if (opened) {
                close();
              } else {
                open();
              }
            }}
          >
            <Group justify="space-between">
              <Group wrap="nowrap" gap={8}>
                <IconCategory /> <p>Categories</p>
              </Group>
              {opened && <IconChevronDown size={20}/>}
              {!opened && <IconChevronUp size={20}/>}
            </Group>
          </Button>
          {opened && <SetCategory lat={location.lat} lng={location.lng} close={close}/>}
        </div>
      )}
    </>
  );
};


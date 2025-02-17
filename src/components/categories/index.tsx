import { Button, Center, Group, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { SetCategory } from "./set-category";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCategory,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useCategory } from "../../context-reducer/context";

export const Categories = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [opened, { open, close }] = useDisclosure(false);

  const { state } = useCategory();

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
            w={180}
            px={10}
            py={5}
            onClick={() => {
              if (opened) {
                close();
              } else {
                open();
              }
            }}
          >
            <Group
              justify="space-between"
              align="center"
              wrap="nowrap"
              w={150}
            >
              <Group
              className=" grow-1"
                wrap="nowrap"
                gap={8}
                style={{ flexShrink: 1, minWidth: 0 }}
              >
                <IconCategory />
                <p
                  style={{
                    flexShrink : 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    margin: 0,
                  }}
                >
                  {state.selectedCategory
                    ? state.selectedCategory.label
                    : "Categories"}
                </p>
              </Group>
              <div className="shrink-0">
                {opened ? (
                  <IconChevronDown size={20} />
                ) : (
                  <IconChevronUp size={20} />
                )}
              </div>
            </Group>
          </Button>

          {
            <SetCategory
              lat={location.lat}
              lng={location.lng}
              close={close}
              opened={opened}
            />
          }
        </div>
      )}
    </>
  );
};

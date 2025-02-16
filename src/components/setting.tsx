import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Drawer,
  Group,
  Select,
  Slider,
} from "@mantine/core";

import { IconSettings, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useCategory } from "../context-reducer/context";
import { useState } from "react";

export const Setting = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { state, dispatch } = useCategory();

  const transportData = [
    {
      label: "Driving",
      value: "driving",
    },
    {
      label: "Walking",
      value: "walking",
    },
    {
      label: "Cycling",
      value: "cycling",
    },
    {
      label: "Motorcycling",
      value: "motorcycling",
    },
  ];
  const [data, setData] = useState<{ transportMode: string; radius: number }>({
    transportMode: state.transportMode,
    radius: state.radius,
  });
  console.log(data);
  
  return (
    <>
      <ActionIcon
        size={35}
        variant={!opened ? "light" : "filled"}
        onClick={open}
      >
        <IconSettings />
      </ActionIcon>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size="xs"
        styles={{
          content: {
            marginTop: "64px",
            marginRight: "20px",
            height: "auto",
          },
        }}
      >
        <Group justify="space-between" align="center" mb={20}>
          <p className="text-xl font-semibold">Setting</p>
          <ActionIcon variant="transparent" color="#000" onClick={close}>
            <IconX />
          </ActionIcon>
        </Group>
        <p className="my-2 font-semibold">Transport Mode :</p>
        <Select
          data={transportData}
          defaultValue={data.transportMode}
          onChange={(e) => e && setData({ ...data, transportMode: e })}
        />
        <Divider my="10" />
        <p className="my-2 font-semibold">
          Radius : <Badge color='lime.4'>{state.radius} m</Badge>
        </p>
        <Slider
          value={data.radius}
          min={0}
          max={10000}
          onChange={(e) => setData({ ...data, radius: e })}
        />
        <Group justify="space-between" wrap="nowrap" mt={20}>
          <Button fullWidth color="red" onClick={close}>
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={() => {
              dispatch({
                type: "SET_TRANSPORT_TYPE",
                payload: data.transportMode,
              });
              dispatch({ type: "SET_RADIUS", payload: data.radius });
              close();
            }}
          >
            Set
          </Button>
        </Group>
      </Drawer>
    </>
  );
};

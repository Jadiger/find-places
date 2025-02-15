import { Accordion, Button, Drawer, Group, Title } from "@mantine/core";

import { IconAdjustments, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { TranspoertNode } from "./transport-mode";

export const Filter = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button px="xs" variant="light" color="#000" onClick={open}>
        <IconAdjustments size={25} />
      </Button>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size="xs"
      >
        <Group justify="space-between">
          <Title order={4}>Filter</Title> <IconX onClick={close} />
        </Group>
        <Accordion>
          <Accordion.Item value="transport">
            <Accordion.Control>TransPort Mode</Accordion.Control>
            <TranspoertNode />
          </Accordion.Item>
        </Accordion>
      </Drawer>
    </>
  );
};

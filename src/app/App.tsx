import { Group, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { IconMapPinSearch } from "@tabler/icons-react";

import { MapComponent } from "../components/map";

import { CategoryProvider } from "../context-reducer/context";
import { Setting } from "../components/setting";
import { Categories } from "../components/categories";

export default function App() {
  const queryClient = new QueryClient({});

  return (
    <CategoryProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <header className="h-16 px-5 shadow-md z-50 relative">
            <Group
              justify="space-between"
              align="center"
              h={"100%"}
              wrap="nowrap"
            >
              <Group gap={4} wrap="nowrap">
                <IconMapPinSearch size={30} />
                <h2 className="text-2xl font-semibold">Find Places</h2>
              </Group>

              <Setting />
            </Group>
            <Categories/>
          </header>

          <MapComponent />

          <Notifications position="top-right" />
        </MantineProvider>
      </QueryClientProvider>
    </CategoryProvider>
  );
}

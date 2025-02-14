import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "../routes";
import { Notifications } from "@mantine/notifications";

export default function App() {
  const queryClient = new QueryClient({});
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Router />
        
        <Notifications position="top-right" />
      </MantineProvider>
    </QueryClientProvider>
  );
}

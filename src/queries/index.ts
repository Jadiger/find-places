import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useOverpass = ({ lat, lng }: { lat: number; lng: number }) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.overpass({ lat, lng }),
    staleTime : 30_000
  });
};

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useOverpass = ({ lat, lng ,radius}: { lat: number; lng: number,radius:number }) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.overpass({ lat, lng,radius }),
    staleTime : 30_000
  });
};

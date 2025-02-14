import { http } from "../constatnts/axiosIntance";
import { IOverPassData } from "../types";

export const api = {
  overpass: async ({ lat, lng }: { lat: number; lng: number }) => {
    const { data } = await http<IOverPassData>(
      `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"](around:2000,${lat},${lng}););out body;`
    );

    return data;
  },
};

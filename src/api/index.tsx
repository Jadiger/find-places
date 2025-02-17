import { http } from "../constants/axiosIntance";
import { IOverPassData } from "../types";

export const api = {
  overpass: async ({
    lat,
    lng,
    radius,
  }: {
    lat: number;
    lng: number;
    radius: number;
  }) => {
    const { data } = await http<IOverPassData>(
      `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"](around:${radius},${lat},${lng}););out body;`
    );

    return data;
  },
};

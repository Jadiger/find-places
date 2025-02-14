export interface IOverPassData {
  elements: IElements[];
}
interface IElements {
  id: number;
  lat: number;
  lon: number;
  tags: ITags;
}

interface ITags {
  name: string;
  amenity: string;
  category: string;
  rating: string;
  phone: string;
  website: string;
  address: string;
}

export interface Place {
  id: number;
  name: string;
  lat: number;
  lon: number;
  category: string;
  rating?: string;
  phone?: string;
  website?: string;
  address?: string;
}
export interface IRoute {
  coordinates: number[][];
  type: string;
}

export interface SelectedCategory {
  label: string;
  value: string;
}
export type TransportMode = "driving" | "walking" | "cycling" | "motorcycling";
export interface State {
  categories: SelectedCategory[] | [];
  selectedCategory: SelectedCategory;
  transportMode: "driving" | "walking" | "cycling" | "motorcycling";
}
export type Action =
  | { type: "SET_CATEGORIES"; payload: SelectedCategory[] }
  | { type: "SET_CATEGORY"; payload: SelectedCategory }
  | { type: "SET_TRANSPORT_TYPE"; payload: TransportMode };

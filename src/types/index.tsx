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

  opening_hours?: string;
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
  opening_hours?: string;
}
export interface IRoute {
  coordinates: number[][];
  type: string;
}

export interface SelectedCategory  {
  label: string;
  value: string;
}

export type TransportMode = string;

export interface State {
  categories: SelectedCategory[] | [];
  selectedCategory: SelectedCategory;
  transportMode: string;
  radius: number;
  zoom: number;
  selectedPlace : Place | null
}
export type Action =
  | { type: "SET_CATEGORIES"; payload: SelectedCategory[] }
  | { type: "SET_CATEGORY"; payload: SelectedCategory }
  | { type: "SET_TRANSPORT_TYPE"; payload: TransportMode }
  | { type: "SET_RADIUS"; payload: number }
  | { type: "SET_ZOOM"; payload: number }
  | {type : 'SET_SELECTED_PLACE', payload : Place | null}

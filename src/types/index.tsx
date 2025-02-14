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

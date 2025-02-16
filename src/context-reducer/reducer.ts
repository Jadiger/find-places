import { Action, State } from "../types";

export const initialState: State = {
  categories: [],
  selectedCategory: { label: "All", value: "all" },
  transportMode: "walking",
  radius: 3000,
  zoom : 13
};
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_RADIUS":
      return { ...state, radius: action.payload };
    case 'SET_TRANSPORT_TYPE':
      return { ...state, transportMode : action.payload}
    case 'SET_ZOOM' :
      return {...state, zoom : action.payload}
    default:
      return state;
  }
}

import { Action, State } from "../types";

export const initialState: State = {
  categories: [],
  selectedCategory: { label: "All", value: "all" } ,
  transportMode: "walking"
};
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

export interface Recipe {
  id: string;
  type: Route;
  title: string;
  portions: string;
  time: string;
  tags: string[];
  ingredients: Ingredient[];
  preparation: string[];
  image: string;
  source?: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export type Route =
  | "repas"
  | "entrees"
  | "desserts"
  | "boissons"
  | "autres"
  | "all";

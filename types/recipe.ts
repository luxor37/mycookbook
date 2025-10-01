export interface Recipe {
    id: string
    type: CATEGORY
    title: string
    portions: string
    time: string
    tags: string[]
    ingredients: Ingredient[]
    preparation: string[]
    image: string
    source?: string
}

export interface Ingredient {
    name: string,
    quantity: string
    unit: string
}

export enum CATEGORY {
    REPAS = "REPAS",
    ENTREES = "ENTREES",
    DESSERTS = "DESSERTS",
    BOISSONS = "BOISSONS",
    AUTRES = "AUTRES",
    ALL = "ALL"
}

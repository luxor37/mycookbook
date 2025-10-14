export interface Recipe {
    id: string
    type: Category
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


export const categories = {
    REPAS: "REPAS",
    ENTREES: "ENTREES",
    DESSERTS: "DESSERTS",
    BOISSONS: "BOISSONS",
    AUTRES: "AUTRES",
    ALL: "ALL"
} as const

export type Category = keyof typeof categories

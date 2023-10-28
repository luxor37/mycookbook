export default interface Recipe {
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

interface Ingredient {
    name: string,
    quantity: string
    unit: string
}

export type CATEGORY =
    | "REPAS"
    | "ENTREES"
    | "DESSERTS"
    | "BOISSONS"
    | "AUTRES"
    | "ALL";
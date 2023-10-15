export default interface Recipe {
    type: "REPAS" | "ENTREES" | "DESSERTS" | "BOISSONS" | "AUTRES"
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
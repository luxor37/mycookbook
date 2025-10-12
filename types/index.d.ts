type Type = 'repas' | 'entrees' | 'desserts' | 'boissons' | 'autres' | 'all'

interface Recipe {
  id: string
  type: Type
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
  name: string
  quantity: string
  unit: string
}

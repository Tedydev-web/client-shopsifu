export interface Product {
  id: string
  image: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  sold: number
  tags: string[]
  createdAt: string
  updatedAt: string
  salePrice: number
  discount: number
  type: string
  Isfavorite?: boolean
}
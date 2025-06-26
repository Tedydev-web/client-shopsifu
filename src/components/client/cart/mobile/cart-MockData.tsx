// app/cart/data/mockCartItems.ts

export interface ProductItem {
  id: string
  name: string
  image: string
  variation: string
  price: number
  originalPrice?: number
  quantity: number
  soldOut?: boolean
}

export interface CartGroup {
  shop: string
  items: ProductItem[]
}

export const mockCartItems: CartGroup[] = [
  {
    shop: "Gia Dụng Việt !",
    items: [
      {
        id: "1",
        name: "Vòi lavabo, Vòi chậu rửa mặt lavab...",
        image: "/mock/voi.png",
        variation: "Thân trúc 30 cm+dây",
        price: 335000,
        originalPrice: 580000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "Gia Dụng Việt !",
    items: [
      {
        id: "2",
        name: "test 1",
        image: "/mock/voi.png",
        variation: "Thân trúc 30 cm+dây",
        price: 335000,
        originalPrice: 580000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "Gia Dụng Việt !",
    items: [
      {
        id: "3",
        name: "test 2",
        image: "/mock/voi.png",
        variation: "Thân trúc 30 cm+dây",
        price: 335000,
        originalPrice: 580000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "HEMERA JEWELRY",
    items: [
      {
        id: "4",
        name: "Khuyên tai nụ Hemera hạt trai nuôi …",
        image: "/mock/khuyen.png",
        variation: "1 đôi,Hồng cam 9 - 9,5mm",
        price: 95000,
        quantity: 1,
        soldOut: true,
      },
    ],
  },
]

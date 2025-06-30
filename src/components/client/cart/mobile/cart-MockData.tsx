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
    items: Array.from({ length: 10 }, (_, i) => ({
      id: `gdv-${i + 1}`,
      name: `Sản phẩm Gia Dụng #${i + 1}`,
      image: "/mock/voi.png",
      variation: `Phiên bản ${i + 1}`,
      price: 100000 + i * 10000,
      originalPrice: 150000 + i * 10000,
      quantity: 1,
    })),
  },
  {
    shop: "HEMERA JEWELRY",
    items: Array.from({ length: 6 }, (_, i) => ({
      id: `hmr-${i + 1}`,
      name: `Khuyên tai Hemera #${i + 1}`,
      image: "/mock/khuyen.png",
      variation: `Màu ${["Hồng", "Xanh", "Trắng", "Tím", "Vàng", "Đen"][i]}`,
      price: 95000 + i * 5000,
      quantity: 1,
      soldOut: i % 2 === 0,
    })),
  },
  {
    shop: "FASHION123",
    items: Array.from({ length: 8 }, (_, i) => ({
      id: `fs-${i + 1}`,
      name: `Áo thun nam F123 #${i + 1}`,
      image: "/mock/shirt.png",
      variation: `Size ${["S", "M", "L", "XL"][i % 4]}`,
      price: 199000,
      originalPrice: 299000,
      quantity: 1,
    })),
  },
]

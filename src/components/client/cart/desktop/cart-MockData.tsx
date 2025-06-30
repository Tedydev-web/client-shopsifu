// app/cart/data/mockCartItems.ts

// Cart item types & mock data
export interface ProductItem {
  id: string;
  name: string;
  image: string;
  variation: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  soldOut?: boolean;
}

export interface CartGroup {
  shop: string;
  items: ProductItem[];
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
];

// Search & category types & mock data
export interface TrendingSearch {
  id: string;
  text: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const trendingSearches: TrendingSearch[] = [
  { id: '1', text: 'điện thoại', category: 'Đồ điện tử' },
  { id: '2', text: 'tai nghe bluetooth', category: 'Phụ kiện' },
  { id: '3', text: 'áo croptop', category: 'Thời trang nữ' },
  { id: '4', text: 'bàn học gỗ', category: 'Nội thất' },
  { id: '5', text: 'khuyên tai bạc', category: 'Trang sức' },
];

export const popularCategories: Category[] = [
  { id: 'electronics', name: 'Điện tử', image: '/mock/category/electronics.png' },
  { id: 'fashion', name: 'Thời trang', image: '/mock/category/fashion.png' },
  { id: 'home', name: 'Gia dụng', image: '/mock/category/home.png' },
  { id: 'beauty', name: 'Làm đẹp', image: '/mock/category/beauty.png' },
  { id: 'baby', name: 'Mẹ & Bé', image: '/mock/category/baby.png' },
  { id: 'sports', name: 'Thể thao', image: '/mock/category/sports.png' },
  { id: 'jewelry', name: 'Trang sức', image: '/mock/category/jewelry.png' },
  { id: 'pets', name: 'Thú cưng', image: '/mock/category/pets.png' },
];

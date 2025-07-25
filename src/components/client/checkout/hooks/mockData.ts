export const mockShopCarts = [
  {
    shop: {
      id: "shop1",
      name: "Shop Thời Trang ABC",
      avatar: "/images/shop1.jpg"
    },
    cartItems: [
      {
        id: "item1",
        quantity: 2,
        isSelected: true,
        skuId: "sku1",
        sku: {
          id: "sku1",
          value: "Đen - XL",
          price: 299000,
          stock: 50,
          image: "https://picsum.photos/200/300",
          product: {
            id: "prod1",
            name: "Áo Thun Nam Cotton Cao Cấp",
            description: "Áo thun nam cotton 100%, form regular fit",
            images: [
              "https://picsum.photos/200/300",
              "https://picsum.photos/200/301"
            ],
            virtualPrice: 399000
          }
        }
      },
      {
        id: "item2",
        quantity: 1,
        isSelected: true,
        skuId: "sku2",
        sku: {
          id: "sku2",
          value: "Trắng - L",
          price: 279000,
          stock: 30,
          image: "https://picsum.photos/200/301",
          product: {
            id: "prod2",
            name: "Áo Polo Nam Premium",
            description: "Áo polo nam chất liệu cao cấp, form slim fit",
            images: [
              "https://picsum.photos/200/302",
              "https://picsum.photos/200/303"
            ],
            virtualPrice: 359000
          }
        }
      }
    ]
  },
  {
    shop: {
      id: "shop2",
      name: "Shop Giày XYZ",
      avatar: "/images/shop2.jpg"
    },
    cartItems: [
      {
        id: "item3",
        quantity: 1,
        isSelected: true,
        skuId: "sku3",
        sku: {
          id: "sku3",
          value: "Đen - 42",
          price: 899000,
          stock: 15,
          image: "https://picsum.photos/200/304",
          product: {
            id: "prod3",
            name: "Giày Sneaker Nam Cao Cấp",
            description: "Giày sneaker nam phong cách thể thao, đế cao su chống trượt",
            images: [
              "https://picsum.photos/200/304",
              "https://picsum.photos/200/305"
            ],
            virtualPrice: 1199000
          }
        }
      }
    ]
  }
];

// Mock data cho thông tin đơn hàng
export const mockOrderSummary = {
  subtotal: 1477000, // Tổng tiền hàng
  shipping: 30000,   // Phí vận chuyển
  discount: 50000,   // Giảm giá
  total: 1457000     // Tổng thanh toán
};

// Mock data cho vouchers
export const mockVouchers = [
  {
    id: "voucher1",
    code: "SUMMER2024",
    discount: 50000,
    minSpend: 500000,
    description: "Giảm 50K cho đơn hàng từ 500K"
  },
  {
    id: "voucher2",
    code: "FREESHIP",
    discount: 30000,
    minSpend: 300000,
    description: "Miễn phí vận chuyển cho đơn hàng từ 300K"
  }
];

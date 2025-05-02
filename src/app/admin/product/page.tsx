'use client'

import Image from 'next/image'

const mockProducts = [
  {
    id: 1,
    name: 'Áo thun nam',
    price: 199000,
    image: '/images/products/shirt1.jpg'
  },
  {
    id: 2,
    name: 'Quần jean nữ',
    price: 299000,
    image: '/images/products/jeans1.jpg'
  },
  {
    id: 3,
    name: 'Giày thể thao',
    price: 499000,
    image: '/images/products/shoes1.jpg'
  }
]

export default function ProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl shadow-sm p-4 flex flex-col gap-3 
              hover:shadow-lg hover:scale-105 transition-transform duration-300 #042940"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-[#D0201C] font-bold">
              {product.price.toLocaleString()}₫
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

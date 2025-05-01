export default function ProductPage() {
    const products = [
      {
        id: 'P001',
        name: 'Áo thun nam basic',
        price: 199000,
        stock: 120,
        category: 'Thời trang nam'
      },
      {
        id: 'P002',
        name: 'Giày sneaker nữ',
        price: 499000,
        stock: 85,
        category: 'Giày dép'
      },
      {
        id: 'P003',
        name: 'Túi đeo chéo mini',
        price: 259000,
        stock: 40,
        category: 'Phụ kiện'
      },
      {
        id: 'P004',
        name: 'Quần jean ống rộng',
        price: 349000,
        stock: 64,
        category: 'Thời trang nữ'
      }
    ]
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>
        <div className="overflow-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b text-gray-700">
              <tr>
                <th className="px-4 py-3">Mã SP</th>
                <th className="px-4 py-3">Tên sản phẩm</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3">Danh mục</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{product.id}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2 text-red-600 font-semibold">{product.price.toLocaleString()}₫</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
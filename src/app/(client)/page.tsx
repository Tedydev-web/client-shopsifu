import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Thời Trang Nam Cao Cấp
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá bộ sưu tập thời trang nam mới nhất với thiết kế độc đáo và chất lượng cao cấp
          </p>
          <Button size="lg" className="text-lg">
            Mua sắm ngay
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    id: 1,
    name: "Áo sơ mi",
    image: "/images/categories/shirts.jpg",
  },
  {
    id: 2,
    name: "Quần jean",
    image: "/images/categories/jeans.jpg",
  },
  {
    id: 3,
    name: "Áo khoác",
    image: "/images/categories/jackets.jpg",
  },
  {
    id: 4,
    name: "Phụ kiện",
    image: "/images/categories/accessories.jpg",
  },
];

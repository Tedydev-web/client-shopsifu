import Link from 'next/link';

export function ProductSubItems() {
  return (
    <div className="ml-6 mt-1 space-y-1 text-sm">
      <Link
        href="/admin/product"
        className="block px-3 py-1 rounded hover:bg-white hover:text-[#D0201C] transition"
      >
        Product List
      </Link>
      <Link
        href="/admin/products/add"
        className="block px-3 py-1 rounded hover:bg-white hover:text-[#D0201C] transition"
      >
        Add Products
      </Link>
      <Link
        href="/admin/product/categories"
        className="block px-3 py-1 rounded hover:bg-white hover:text-[#D0201C] transition"
      >
        Categories
      </Link>
    </div>
  );
}

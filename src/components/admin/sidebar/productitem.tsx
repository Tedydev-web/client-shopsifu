import Link from 'next/link';

export function ProductSubItems() {
  return (
    <div className="ml-6 space-y-1 mt-1">
      <Link href="/admin/products" className="block px-2 py-1 hover:text-white">
        Product List
      </Link>
      <Link href="/admin/products/add" className="block px-2 py-1 hover:text-white">
        Add Products
      </Link>
      <Link href="/admin/products/categories" className="block px-2 py-1 hover:text-white">
        Categories
      </Link>
    </div>
  );
}

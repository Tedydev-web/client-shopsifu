import { ClientProduct } from '@/types/client.products.interface';

import ProductItem from '@/components/ui/product-component/product-Item';
import { mockSearchProducts } from './search-MockData';

export default function SearchProductGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mockSearchProducts.map((product: ClientProduct) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}

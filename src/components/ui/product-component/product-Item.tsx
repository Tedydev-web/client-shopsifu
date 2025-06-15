import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product.interface';
import { formatCurrency, formatSold } from '@/utils/formatter';
import { ROUTES } from '@/constants/route';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductItemProps {
  product?: Product; // Dữ liệu sản phẩm, có thể không có khi đang loading
  isLoading?: boolean; // Trạng thái loading
}

// Skeleton UI cho ProductItem
export const ProductItemSkeleton: React.FC = () => {
  return (
    <div className="group block w-full bg-gray-200 rounded-sm shadow-sm overflow-hidden">
      <Skeleton className="w-full aspect-square rounded-none" />
      <div className="p-2 flex flex-col justify-between" style={{ minHeight: '100px' }}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

const ProductItem: React.FC<ProductItemProps> = ({ product, isLoading }) => {
  // Nếu đang loading hoặc không có dữ liệu sản phẩm, hiển thị skeleton
  if (isLoading || !product) {
    return <ProductItemSkeleton />;
  }

  const hasDiscount = product.discount > 0;
  const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;

  return (
    <Link href={`${ROUTES.PRODUCT}/${product.id}`} passHref>
      <div className="group block w-full bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer overflow-hidden">
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-auto object-cover aspect-square"
          />
          {hasDiscount && (
            <div className="absolute top-0 right-0 bg-[#FEEEEA] text-red-600 text-[10px] font-semibold px-2 py-1 flex flex-col items-center justify-center">
              <span>{`-${product.discount}%`}</span>
            </div>
          )}
        </div>
        <div className="p-2 flex flex-col justify-between" style={{ minHeight: '100px' }}>
          <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">
            {product.Isfavorite && (
              <span className="bg-[#EE4D2D] text-white text-[10px] font-semibold mr-1.5 px-1 py-0.5 rounded-xs">
                Yêu thích+
              </span>
            )}
            {product.name}
          </h3>
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="text-base font-medium text-red-600">
                {formatCurrency(displayPrice)}
              </span>
              <span>Đã bán {formatSold(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
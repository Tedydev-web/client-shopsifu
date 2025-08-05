import { useState, useEffect } from 'react';
import { ClientProduct } from '@/types/client.products.interface';
import { clientProductsService } from '@/services/clientProductsService';
import ProductItem from '@/components/ui/product-component/product-Item';
import { mockSearchProducts } from './search-MockData';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchProductGridProps {
  categoryId?: string | null;
}

export default function SearchProductGrid({ categoryId }: SearchProductGridProps) {
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        // Chuẩn bị params để truyền vào API
        const params: any = {
          page: 1,
          limit: 20,
        };
        
        // Thêm categoryId vào params nếu có
        if (categoryId) {
          params.categories = categoryId;
        }
        
        // Gọi API để lấy sản phẩm
        const response = await clientProductsService.getProducts(params);
        
        // Kiểm tra và cập nhật state
        if (response && response.data) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        // Fallback sử dụng mock data trong trường hợp lỗi
        setProducts(mockSearchProducts);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [categoryId]); // Re-fetch khi categoryId thay đổi

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10).fill(null).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Hiển thị khi không có sản phẩm
  if (products.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-black text-lg mb-2">Không tìm thấy kết quả nào</div>
      </div>
    );
  }

  // Hiển thị danh sách sản phẩm
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product: ClientProduct) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
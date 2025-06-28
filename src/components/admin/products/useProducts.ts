import { useState, useCallback, useEffect } from "react";
import { Product } from "./products-Columns";
import { useDebounce } from "@/hooks/useDebounce";

// Mock data for products
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Áo Thun Nam Cotton Compact', images: [{url: '/images/product-1.jpg'}], price: 199000, stock: 120, status: 'active', category: 'Áo Thun' },
  { id: '2', name: 'Quần Jeans Nam Slim-fit', images: [{url: '/images/product-2.jpg'}], price: 499000, stock: 80, status: 'active', category: 'Quần Jeans' },
  { id: '3', name: 'Áo Sơ Mi Nữ Tay Dài', images: [{url: '/images/product-3.jpg'}], price: 349000, stock: 50, status: 'inactive', category: 'Áo Sơ Mi' },
  { id: '4', name: 'Váy Đầm Nữ Dáng Chữ A', images: [{url: '/images/product-4.jpg'}], price: 599000, stock: 30, status: 'active', category: 'Váy Đầm' },
  { id: '5', name: 'Giày Sneaker Nam Da', images: [{url: '/images/product-5.jpg'}], price: 799000, stock: 45, status: 'archived', category: 'Giày' },
  { id: '6', name: 'Túi Xách Nữ Da Thật', images: [{url: '/images/product-6.jpg'}], price: 1299000, stock: 25, status: 'active', category: 'Phụ Kiện' },
  { id: '7', name: 'Áo Khoác Dù Nam 2 Lớp', images: [{url: '/images/product-7.jpg'}], price: 450000, stock: 60, status: 'active', category: 'Áo Khoác' },
];

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const getAllProducts = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setAllProducts(MOCK_PRODUCTS);
    setProducts(MOCK_PRODUCTS);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      const filteredData = allProducts.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setProducts(filteredData);
      setIsSearching(false);
    } else {
      setProducts(allProducts);
    }
  }, [debouncedSearch, allProducts]);

  const createProduct = async (data: Omit<Product, 'id'>) => {
    console.log("Creating product", data);
    // Add logic to call API
    await getAllProducts(); // Refresh list
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    console.log("Updating product", id, data);
    // Add logic to call API
    await getAllProducts(); // Refresh list
  };

  const deleteProduct = async (id: string) => {
    console.log("Deleting product", id);
    // Add logic to call API
    await getAllProducts(); // Refresh list
    return true; // Simulate success
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleOpenModal = useCallback((product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  return {
    products,
    loading,
    isSearching,
    search,
    handleSearch,
    isModalOpen,
    selectedProduct,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    handleOpenModal,
    handleCloseModal,
  };
}
import { useState, useCallback, useEffect } from "react";
import { Product } from "./products-Columns";
import { useDebounce } from "@/hooks/useDebounce";

import { MOCK_PRODUCTS } from "./products-Mockdata";

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
      const filteredData = allProducts.filter((product) => {
        const searchTerm = debouncedSearch.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.slug.toLowerCase().includes(searchTerm)
        );
      });
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
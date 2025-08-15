"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { clientProductsService } from "@/services/clientProductsService";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientSearchResultItem } from "@/types/client.products.interface";
import { createCategorySlug } from "@/utils/slugify";

export function MobileSearchInput({ categories }: { categories: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<ClientSearchResultItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Giống desktop: fetch + abort signal
  const fetchSearchSuggestions = useCallback(
    async (term: string, signal: AbortSignal) => {
      if (term.length < 2) {
        setSearchSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);

      try {
        const response = await clientProductsService.getSearchSuggestions(term, 5, { signal });
        setSearchSuggestions(response.data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching search suggestions:", error);
          setSearchSuggestions([]);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    []
  );

  // Gọi API khi debouncedSearch thay đổi
  useEffect(() => {
    const controller = new AbortController();
    fetchSearchSuggestions(debouncedSearch, controller.signal);
    return () => controller.abort();
  }, [debouncedSearch, fetchSearchSuggestions]);

  return (
    <div className="mb-0">
      {!searchTerm ? (
        <div>
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="px-4 py-2">
                    <div className="w-full flex items-center">
                      <div className="w-9 h-9 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                ))
            : categories.slice(0, 5).map((category) => (
                <motion.div key={category.value} className="cursor-pointer">
                  <div className="px-4 py-2">
                    <Link
                      href={createCategorySlug(category.label, [category.value])}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-9 h-9 relative overflow-hidden rounded-full border border-gray-100 mr-3">
                          {category.icon ? (
                            <Image
                              src={category.icon}
                              alt={category.label}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              {category.label.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-800">{category.label}</span>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>
      ) : (
        <div>
          {isLoadingSuggestions ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="px-4 py-2">
                  <div className="w-full flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
          ) : searchSuggestions.length > 0 ? (
            searchSuggestions.map((item) => (
              <motion.div
                key={item.productId}
                className="cursor-pointer"
                onClick={() => setSearchTerm(item.productName)}
              >
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-800">{item.productName}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.categoryNames[0] || "Sản phẩm"}
                  </span>
                </div>
              </motion.div>
            ))
          ) : searchTerm.length > 1 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500">Không tìm thấy kết quả cho "{searchTerm}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { clientProductsService } from "@/services/clientProductsService";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientSearchResultItem } from "@/types/client.products.interface";
import { createCategorySlug } from "@/utils/slugify";

export function MobileSearchInput({ categories }: { categories: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<ClientSearchResultItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    const controller = new AbortController();
    fetchSearchSuggestions(debouncedSearch, controller.signal);
    return () => controller.abort();
  }, [debouncedSearch, fetchSearchSuggestions]);

  const navigateToSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      setIsFocused(false);
      const isOnSearchPage = window.location.pathname === "/search";
      const urlParams = new URLSearchParams(window.location.search);
      const currentSearchTerm = urlParams.get("q");
      if (isOnSearchPage && currentSearchTerm === term) {
        router.push(`/search?q=${encodeURIComponent(term)}&_t=${Date.now()}`);
      } else if (isOnSearchPage) {
        router.push(`/search?q=${encodeURIComponent(term)}&_t=${Date.now()}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(term)}`);
      }
    },
    [router]
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-all duration-300 ${isFocused ? "opacity-50 visible z-40" : "opacity-0 invisible"}`}
        onClick={() => setIsFocused(false)}
      />

      <div className="relative w-full z-50">
        <div className="flex items-center gap-2 bg-[#f8f8f8] rounded-md border border-gray-200 h-10 px-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={() => {
                setSearchTerm("");
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute top-[calc(100%+8px)] bg-white rounded-lg shadow-lg border border-gray-100 w-full"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pt-3">
                {!searchTerm ? (
                  <h3 className="text-sm font-semibold text-gray-800 pb-2 border-b border-gray-100">
                    Danh mục phổ biến
                  </h3>
                ) : (
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    Kết quả liên quan
                  </h3>
                )}
              </div>

              <div className="pb-3">
                {!searchTerm ? (
                  loading
                    ? Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className="px-4 py-2 flex items-center">
                            <div className="w-9 h-9 bg-gray-200 rounded-full mr-3 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                          </div>
                        ))
                    : categories.slice(0, 5).map((category) => (
                        <Link
                          key={category.value}
                          href={createCategorySlug(category.label, [category.value])}
                          className="px-4 py-2 flex items-center hover:bg-gray-50"
                          onClick={() => setIsFocused(false)}
                        >
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
                        </Link>
                      ))
                ) : isLoadingSuggestions ? (
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="px-4 py-2 flex items-center">
                        <div className="w-5 h-5 bg-gray-200 rounded-full mr-3 animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-1" />
                          <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    ))
                ) : searchSuggestions.length > 0 ? (
                  searchSuggestions.map((item) => (
                    <div
                      key={item.productId}
                      className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigateToSearch(item.productName)}
                    >
                      <div className="flex items-center">
                        <Search className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-800">{item.productName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.categoryNames[0] || "Sản phẩm"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    Không tìm thấy kết quả cho "{searchTerm}"
                  </div>
                )}
              </div>

              {searchTerm && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <button
                    className="flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium p-2.5 rounded-lg"
                    onClick={() => navigateToSearch(searchTerm)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm theo từ khóa "{searchTerm}"
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { clientProductsService } from "@/services/clientProductsService";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientSearchResultItem } from "@/types/client.products.interface";
import { createCategorySlug } from "@/utils/slugify";
import { set } from "date-fns";

interface MobileSearchInputProps {
  categories: { value: string; label: string; icon?: string }[];
}

export function MobileSearchInput({ categories }: MobileSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchSuggestions, setSearchSuggestions] = useState<
    ClientSearchResultItem[]
  >([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load lịch sử từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  // Hàm lưu lịch sử vào localStorage
  const saveSearchHistory = useCallback((term: string) => {
    if (!term.trim()) return;

    setSearchHistory((prev) => {
      // Bỏ trùng lặp, thêm term mới lên đầu
      const newHistory = [term, ...prev.filter((t) => t !== term)];
      // Giới hạn 10 từ khóa gần nhất
      const limitedHistory = newHistory.slice(0, 10);

      localStorage.setItem("searchHistory", JSON.stringify(limitedHistory));
      return limitedHistory;
    });
  }, []);

  // Build URL cho search
  const buildSearchUrl = (term: string, withTimestamp = false) => {
    const ts = withTimestamp ? `&_t=${Date.now()}` : "";
    return `/search?q=${encodeURIComponent(term)}${ts}`;
  };

  const navigateToSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;

      saveSearchHistory(term);

      // Kiểm tra xem hiện tại có đang ở trang search không
      const isOnSearchPage = window.location.pathname === "/search";

      // Lấy thông tin search term hiện tại từ URL để so sánh
      const urlParams = new URLSearchParams(window.location.search);
      const currentSearchTerm = urlParams.get("q");

      // Nếu search term không thay đổi và đang ở trang search, thêm/cập nhật timestamp
      if (isOnSearchPage && currentSearchTerm === term) {
        // Tạo timestamp mới cho mỗi lần search để đảm bảo không bị cache
        const timestamp = new Date().getTime();
        router.push(`/search?q=${encodeURIComponent(term)}&_t=${timestamp}`);
      }
      // Nếu search term thay đổi hoặc không ở trang search
      else {
        if (isOnSearchPage) {
          // Nếu đã ở trang search và search term khác, thêm timestamp
          const timestamp = new Date().getTime();
          router.push(`/search?q=${encodeURIComponent(term)}&_t=${timestamp}`);
        } else {
          // Chuyển hướng đến route gốc /search (không thêm timestamp lần đầu)
          router.push(`/search?q=${encodeURIComponent(term)}`);
        }
      }
    },
    [router, saveSearchHistory]
  );

  // Fetch gợi ý
  const fetchSearchSuggestions = useCallback(
    async (term: string, signal: AbortSignal) => {
      if (term.length < 2) {
        setSearchSuggestions([]);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const response = await clientProductsService.getSearchSuggestions(
          term,
          5,
          { signal }
        );
        setSearchSuggestions(response.data);
        setTotalItems(response.metadata?.totalItems || 0);
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

  // Skeletons
  const SkeletonCategory = () => (
    <div className="px-4 py-2 flex items-center">
      <div className="w-9 h-9 bg-gray-200 rounded-full mr-3 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
    </div>
  );

  const SkeletonSuggestion = () => (
    <div className="px-4 py-2 flex items-center">
      <div className="w-5 h-5 bg-gray-200 rounded-full mr-3 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-1" />
        <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-all duration-300 ${
          isFocused ? "opacity-50 visible z-40" : "opacity-0 invisible"
        }`}
        onClick={() => setIsFocused(false)}
      />

      <div className="relative w-full z-50">
        {/* Input */}
        <div className="flex items-center gap-2 bg-[#f8f8f8] rounded-md border border-gray-200 h-10 px-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigateToSearch(searchTerm);
              if (e.key === "Escape") {
                if (searchTerm) setSearchTerm("");
                else setIsFocused(false);
              }
            }}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 bg-transparent text-sm text-black placeholder-gray-400 focus:outline-none"
            role="combobox"
            aria-expanded={isFocused}
            aria-controls="mobile-search-suggestions"
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
              id="mobile-search-suggestions"
              className="absolute top-[calc(100%+8px)] bg-white rounded-lg shadow-lg border border-gray-100 w-full"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              role="listbox"
            >
              <div className="px-4 pt-3">
                <h3 className="text-sm font-semibold text-gray-800 pb-2 border-b border-gray-100">
                  {!searchTerm ? "Tìm kiếm gần đây" : "Kết quả liên quan"}
                </h3>
              </div>

              <div className="pb-3">
                {!searchTerm ? (
                  // Lịch sử tìm kiếm
                  searchHistory.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">
                      Chưa có lịch sử tìm kiếm
                    </div>
                  ) : (
                    searchHistory.map((term, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigateToSearch(term)}
                        role="option"
                      >
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-800">{term}</span>
                      </div>
                    ))
                  )
                ) : isLoadingSuggestions ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => <SkeletonSuggestion key={i} />)
                ) : searchSuggestions.length > 0 ? (
                  searchSuggestions.map((item) => (
                    <div
                      key={item.productId}
                      className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigateToSearch(item.productName)}
                      role="option"
                    >
                      <div className="px-5 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={item.skuImage || "/static/no-image.png"}
                              alt={item.productName}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-800 line-clamp-1">
                            {item.productName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    Không tìm thấy kết quả cho "{searchTerm}"
                  </div>
                )}
              </div>

              {searchTerm && (
                <div className="px-5 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <div
                      className="flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium p-3 rounded-lg transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        navigateToSearch(searchTerm);
                      }}
                    >
                      <Search className="h-4 w-4 mr-2.5" />
                      <span>
                        Xem tất cả{" "}
                        <span className="font-bold text-red-600">
                          "{totalItems}"
                        </span>{" "}
                        kết quả theo từ khóa{" "}
                        <span className="font-bold text-red-600">
                          "{searchTerm}"
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

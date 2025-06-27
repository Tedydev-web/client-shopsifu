'use client';

import { Search, ArrowLeft, X, History, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import { allSuggestions, popularCategories } from '@/components/client/layout/header/moblie/searchData';

const SEARCH_HISTORY_KEY = 'searchHistory';

const removeAccents = (str: string) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export function MobileSearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Xử lý tìm kiếm gợi ý
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim()) {
      const normalizedInput = removeAccents(value.toLowerCase().trim());
      const filtered = allSuggestions.filter(item => {
        const normalizedItem = removeAccents(item.toLowerCase());
        return normalizedItem.includes(normalizedInput);
      });
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
    setSuggestions([]);
    document.body.style.overflow = '';
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Cập nhật lịch sử tìm kiếm
      const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));

      // Chuẩn hóa từ khóa tìm kiếm
      const searchNormalized = removeAccents(term.toLowerCase().trim());
      
      // TODO: Implement actual search with normalized term
      console.log('Search term:', term);
      console.log('Normalized term:', searchNormalized);
      
      handleCloseSearch();
    }
  };

  const handleSelectSuggestion = (term: string) => {
    handleSearch(term);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return (
    <>
      {/* Search Trigger */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={handleOpenSearch}
      >
        <div className="flex items-center gap-2 bg-[#f8f8f8] rounded-sm border border-gray-200 py-2.5 px-3">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400 text-sm">Tìm kiếm sản phẩm...</span>
        </div>
      </div>

      {/* Full Screen Search Interface */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            {/* Search Header */}
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-red-700 via-red-600 to-red-700">
              <button 
                onClick={handleCloseSearch}
                className="p-1.5 hover:bg-red-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full py-2 pl-4 pr-12 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:bg-white/20"
                  placeholder="Tìm kiếm sản phẩm..."
                  autoFocus
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-1.5 hover:bg-white/10 rounded-full mr-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleSearch(searchTerm)}
                    className="p-1.5 hover:bg-white/10 rounded-full"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {searchTerm ? (
                // Hiển thị gợi ý khi có từ khóa tìm kiếm
                <div className="p-4 bg-white">
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectSuggestion(term)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 group"
                        >
                          <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                          <span className="text-gray-700 group-hover:text-gray-900">{term}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Search className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
                      <p className="text-gray-400 text-sm mt-1">Vui lòng thử với từ khóa khác</p>
                    </div>
                  )}
                </div>
              ) : (
                // Hiển thị lịch sử và danh mục phổ biến khi không có từ khóa
                <>
                  {/* Lịch sử tìm kiếm */}
                  {searchHistory.length > 0 && (
                    <div className="p-4 bg-white mb-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <History className="h-5 w-5 text-gray-500" />
                          <h3 className="font-medium text-gray-900">Tìm kiếm gần đây</h3>
                        </div>
                        <button 
                          onClick={handleClearHistory}
                          className="p-1.5 hover:bg-gray-100 rounded-full"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectSuggestion(term)}
                            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                          >
                            <History className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}                  {/* Danh mục phổ biến */}
                  <div className="p-4 bg-white">
                    <h3 className="font-medium text-gray-900 mb-3">Danh mục phổ biến</h3>                    <div className="grid grid-cols-1 gap-2">
                      {popularCategories.map((category) => (
                        <button
                          key={category.order}
                          onClick={() => handleSelectSuggestion(category.name)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all text-left w-full",
                            category.order <= 3 
                              ? "bg-white hover:bg-gray-50 shadow-sm" 
                              : "bg-gray-50 hover:bg-gray-100"
                          )}
                        >                          {category.order <= 3 ? (
                            <span className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold",
                              category.order === 1 && "bg-red-100 text-red-600",
                              category.order === 2 && "bg-orange-100 text-orange-600",
                              category.order === 3 && "bg-yellow-100 text-yellow-600"
                            )}>
                              {category.order}
                            </span>
                          ) : (
                            <span className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-500 rounded-full text-sm">
                              {category.order}
                            </span>
                          )}
                          <span className={cn(
                            "font-medium",
                            category.order <= 3 && "text-gray-900"
                          )}>
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
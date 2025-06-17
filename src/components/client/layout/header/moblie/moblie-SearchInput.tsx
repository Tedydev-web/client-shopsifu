'use client';

import { Search, ArrowLeft, X, History, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for recent searches and popular searches
const recentSearches = ['Điện thoại iPhone', 'Laptop gaming', 'Tai nghe bluetooth'];
// Danh sách gợi ý tìm kiếm
const allSuggestions = [
  'Điện thoại Samsung',
  'Điện thoại iPhone',
  'Điện thoại Xiaomi',
  'MacBook Pro M2',
  'MacBook Air M1',
  'Tai nghe Sony WH-1000XM4',
  'Tai nghe Apple AirPods Pro',
  'iPad Pro 2023',
  'iPad Air 5',
  'Apple Watch Series 8',
  'Apple Watch SE',
  'Bàn phím cơ',
  'Bàn phím gaming',
  'Chuột gaming',
  'Chuột không dây',
  'Màn hình Dell',
  'Màn hình gaming',
  'Laptop gaming',
  'Laptop văn phòng',
  'PC gaming'
];

const popularSearches = [
  'Điện thoại Samsung',
  'MacBook Pro M2',
  'Tai nghe Sony WH-1000XM4',
  'iPad Pro 2023',
  'Apple Watch Series 8',
  'Bàn phím cơ',
  'Chuột gaming',
  'Màn hình Dell'
];

const removeAccents = (str: string) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export function MobileSearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSearchHistory, setLocalSearchHistory] = useState<string[]>(recentSearches);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Xử lý tìm kiếm gợi ý
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim()) {
      const normalizedInput = removeAccents(value.toLowerCase().trim());
      const filtered = allSuggestions.filter(item => {
        const normalizedItem = removeAccents(item.toLowerCase());
        return normalizedItem.includes(normalizedInput);
      });
      setSuggestions(filtered.slice(0, 5)); // Giới hạn 5 gợi ý
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
    document.body.style.overflow = '';
  };  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Thêm từ khóa vào lịch sử tìm kiếm
      const newHistory = [term, ...localSearchHistory.filter(item => item !== term)].slice(0, 5);
      setLocalSearchHistory(newHistory);

      // Chuẩn hóa từ khóa tìm kiếm
      const searchNormalized = removeAccents(term.toLowerCase().trim());
      
      // TODO: Implement actual search with normalized term
      // Ví dụ: searchProducts(term, searchNormalized);
      console.log('Search term:', term);
      console.log('Normalized term:', searchNormalized);
      
      handleCloseSearch();
    }
  };

  const handleSelectTerm = (term: string) => {
    setSearchTerm(term);
  };


  
  const handleClearHistory = () => {
    setLocalSearchHistory([]);
  };

  return (
    <>
      {/* Search Trigger */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={handleOpenSearch}
      >
        <div className="flex items-center gap-2 bg-[#f8f8f8] rounded-lg border border-gray-200 py-1.5 px-3">
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
              </button>              <div className="flex-1 relative">
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

            {/* Live Search Suggestions - Second */}
              {searchTerm && suggestions.length > 0 && (
                <div className="p-4 bg-white mb-2">
                  <h3 className="font-medium text-gray-900 mb-3">Gợi ý tìm kiếm</h3>
                  <div className="space-y-2">
                    {suggestions.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectTerm(term)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}


            {/* Search Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {/* Recent Searches - Always First */}
              {localSearchHistory.length > 0 && (
                <div className="p-4 bg-white mb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-gray-500" />
                      <h3 className="font-medium text-gray-900">Tìm kiếm gần đây</h3>
                    </div>
                    <button 
                      onClick={handleClearHistory}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {localSearchHistory.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectTerm(term)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <History className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              
              {/* Popular Searches - Last */}
              {(!searchTerm || !suggestions.length) && (
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-gray-900 mb-3">Xu hướng tìm kiếm</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {popularSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectTerm(term)}
                        className={cn(
                          "p-3 text-left rounded-lg transition-colors flex items-center",
                          index < 3 
                            ? "bg-red-50/50 text-red-600 hover:bg-red-50" 
                            : "bg-gray-50 hover:bg-gray-100"
                        )}
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white mr-3 text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
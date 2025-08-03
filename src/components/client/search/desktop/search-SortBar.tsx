'use client';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function SearchSortBar() {
  const [sort, setSort] = useState('Liên Quan');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [priceSort, setPriceSort] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Giả sử có 10 trang
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPriceDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    // Kiểm tra giới hạn trang
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-xs mb-2">
      {/* Phần sort options */}
      <div className="flex items-center gap-3">
        {['Liên Quan', 'Mới Nhất', 'Bán Chạy'].map((option) => (
          <button
            key={option}
            className={`text-sm px-3 py-1.5 border rounded-md transition-colors duration-200 ${
              sort === option ? 'bg-primary text-white border-primary' : 'text-gray-700 hover:border-primary hover:text-primary'
            }`}
            onClick={() => setSort(option)}
          >
            {option}
          </button>
        ))}
        
        {/* Dropdown giá */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className={`text-sm px-3 py-1.5 border rounded-md flex items-center gap-1 transition-colors duration-200 ${
              priceSort ? 'bg-primary text-white border-primary' : 'text-gray-700 hover:border-primary hover:text-primary'
            }`}
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          >
            {priceSort || 'Giá'} <ChevronDown size={14} className={`transition-transform duration-200 ${showPriceDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown menu */}
          {showPriceDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-md z-10">
              <button 
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  setPriceSort('Giá: Cao đến Thấp');
                  setShowPriceDropdown(false);
                }}
              >
                Giá: Cao đến Thấp
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  setPriceSort('Giá: Thấp đến Cao');
                  setShowPriceDropdown(false);
                }}
              >
                Giá: Thấp đến Cao
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Phần pagination */}
      <div className="flex items-center gap-2">
        <button 
          className="p-1.5 border rounded-md hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700">{currentPage}</span>
          <span className="text-sm text-gray-500">/</span>
          <span className="text-sm text-gray-500">{totalPages}</span>
        </div>
        
        <button 
          className="p-1.5 border rounded-md hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

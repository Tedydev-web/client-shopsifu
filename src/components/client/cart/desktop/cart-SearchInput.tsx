'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Clock, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import '../style.css';
import { trendingSearches, popularCategories} from './cart-MockData';
import { useDropdown } from '../dropdown-context';
// Dữ liệu mẫu cho các trending searches


export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoverEffect, setHoverEffect] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openDropdown, setOpenDropdown } = useDropdown();
  
  // Chuyển trạng thái focus thành dựa vào context
  const isFocused = openDropdown === 'search';
  
  const handleFocus = () => {
    setOpenDropdown('search');
  };
  
  const handleBlur = () => {
    // Không đóng dropdown ngay lập tức khi blur để cho phép click vào dropdown
    // Việc đóng sẽ được xử lý bởi DropdownProvider khi click ngoài
  };
  // Cập nhật từ khóa tìm kiếm và giữ focus
  const handleSearchTermClick = (term: string) => {
    setSearchTerm(term);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        // Nếu đang nhập text và modal chưa mở, mở modal
        if (newSearchTerm && openDropdown !== 'search') {
            setOpenDropdown('search');
        }
    };

  return (
    <>
      {/* Background overlay khi search focused */}			
      <div
        className={cn(
          'fixed top-[75px] left-0 right-0 bottom-0 bg-black transition-all duration-300 search-backdrop',
          isFocused ? 'opacity-50 visible z-40' : 'opacity-0 invisible'
        )}
        onClick={() => setOpenDropdown('none')}
      />
      <div className='relative w-full z-50 search-container' ref={searchRef}>
        <motion.div
          className='flex items-center bg-white rounded-full overflow-hidden shadow-sm flex-grow text-black'
          animate={{
            boxShadow: isFocused ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
            scale: isFocused || hoverEffect ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setHoverEffect(true)}
          onMouseLeave={() => setHoverEffect(false)}
        >
          <Input
            ref={inputRef}
            type='text'
            placeholder='Tìm sản phẩm, thương hiệu, và tên shop'
            className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-4 text-[13px] rounded-l-lg'
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            onChange={handleInputChange}
          />
          {searchTerm && (
            <motion.button
              className='absolute right-[70px] top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100'
              onClick={() => setSearchTerm('')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 220, 220, 0.6)' }}
            >
              <X className='h-4 w-4 text-gray-400' />
            </motion.button>
          )}
          <Link
            href={searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : '#'}
            onClick={(e) => {
              if (!searchTerm) e.preventDefault();
              if (searchTerm) setOpenDropdown('none');
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Button
                type='button'
                size='sm'
                className='h-9 rounded-full px-6 m-1 bg-red-500 hover:bg-red-600'
              >
                <Search className='h-5 w-5 text-white' />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Search dropdown with AnimatePresence for smooth enter/exit */}
        <AnimatePresence>
          {isFocused && (							
            <motion.div
              className='absolute top-[calc(100%+12px)] search-dropdown bg-white rounded-lg shadow-xl z-50 border border-gray-100 w-full max-w-[800px] left-1/2 transform -translate-x-1/2'
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: 'easeOut',
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: {
                  duration: 0.2,
                  ease: 'easeIn',
                },
              }}
            >
              {/* Bubble arrow pointing to the search bar */}
              <div className='absolute search-dropdown-arrow w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-200' style={{ left: 'calc(50% - 6px)', top: '-6px' }}></div>
              
              <div>
                {/* Header section with padding */}
                <div className='px-5 pt-5'>
                  {!searchTerm ? (
                    <h3 className='text-[16px] font-semibold text-gray-800 border-b border-gray-100 pb-2'>Danh mục phổ biến</h3>
                  ) : (
                    <div className='flex items-center mb-2'>
                      {/* <Search className='h-4 w-4 text-red-500 mr-2' /> */}
                      <h3 className='text-[16px] font-semibold text-black'>Kết quả liên quan</h3>
                    </div>
                  )}
                </div>
                
                {/* Content section with full-width hover backgrounds */}
                <div className='mb-0'> {/* Changed mb-5 to mb-0 to remove extra space at bottom */}
                  {!searchTerm ? (
                    <>
                      {/* Layout khi chưa nhập gì - Chỉ hiển thị danh mục phổ biến */}
                      <div>
                        {popularCategories.slice(0, 8).map((category) => (
                          <motion.div
                            key={category.id}
                            className='cursor-pointer modal-input' /* Fixed class name syntax */
                            onClick={() => setOpenDropdown('none')}
                          >
                            <div className='px-5 py-2.5'> {/* Standardized padding */}
                              <Link
                                href={`/category/${category.id}`}
                                className='w-full flex items-center justify-between'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className='flex items-center'>
                                  <div className='w-10 h-10 relative overflow-hidden rounded-full border border-gray-100 mr-3'>
                                    <Image
                                      src={category.image}
                                      alt={category.name}
                                      layout='fill'
                                      objectFit='cover'
                                      className='transition-transform duration-300'
                                    />
                                  </div>
                                  <span className='text-sm text-gray-800'>{category.name}</span>
                                </div>
                                {/* <Tag className='h-4 w-4 text-gray-500' /> */}
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Layout khi đã nhập - Hiển thị kết quả liên quan */}
                      <div>
                        {/* Filtered results based on search term */}
                        <div>
                          {trendingSearches
                            .filter(item => 
                              item.text.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .slice(0, 5)
                            .map((item) => (
                              <motion.div
                                key={item.id}
                                className='cursor-pointer modal-input' /* Applied same class for consistency */
                                onClick={() => handleSearchTermClick(item.text)}
                              >
                                <div className='px-5 py-2.5 flex items-center justify-between'>
                                  <div className='flex items-center'>
                                    <Search className='h-4 w-4 text-gray-500 mr-2.5' />
                                    <span className='text-sm font-medium text-gray-800'>{item.text}</span>
                                  </div>
                                  <span className='text-xs text-gray-500'>{item.category}</span>
                                </div>
                              </motion.div>
                            ))
                          }
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Footer section with padding - added pt-5 to create proper spacing */}
                {searchTerm && (
                  <div className='px-5 pb-5 pt-5'>
                    <div className='border-t border-gray-100 pt-4'>
                      <Link
                        href={`/search?q=${encodeURIComponent(searchTerm)}`}
                        className='flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium p-3.5 rounded-lg transition-colors duration-200'
                        onClick={() => setOpenDropdown('none')}
                      >
                        <Search className='h-4 w-4 mr-2.5' />
                        <span>Tìm kiếm theo từ khóa "{searchTerm}"</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

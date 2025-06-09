'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileSearchInput() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleSearch}
        className="p-2"
      >
        <Search className="h-5 w-5 text-white" />
      </motion.button>

      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-0 top-[60px] w-screen bg-white p-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-2 px-3 text-gray-800 text-sm rounded-l-md border focus:outline-none focus:border-red-500"
                placeholder="Tìm kiếm..."
                autoFocus
              />
              <Link
                href={searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : '#'}
                onClick={(e) => !searchTerm && e.preventDefault()}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-r-md"
              >
                <Search className="h-4 w-4" />
              </Link>
              <button onClick={toggleSearch} className="p-2">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
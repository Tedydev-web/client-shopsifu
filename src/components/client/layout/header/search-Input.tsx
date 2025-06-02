'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Clock, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import './style.css';
import { trendingSearches, popularCategories} from './header-MockData';
import { useDropdown } from './dropdown-context';
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

	return (
		<>
			{/* Background overlay khi search focused */}			<div
				className={cn(
					'fixed top-[75px] left-0 right-0 bottom-0 bg-black transition-all duration-300 search-backdrop',
					isFocused ? 'opacity-50 visible z-40' : 'opacity-0 invisible'
				)}
				onClick={() => setOpenDropdown('none')}
			/><div className='relative w-4/5 max-w-[500px] z-50 search-container' ref={searchRef}>
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
						onChange={(e) => setSearchTerm(e.target.value)}
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
					)}					<Link
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
				</motion.div>				{/* Search dropdown with AnimatePresence for smooth enter/exit */}
				<AnimatePresence>
					{isFocused && (
						<motion.div
							className='absolute top-[calc(100%+12px)] left-0 w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-xl z-50 border border-gray-100'
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
							<div className='absolute left-[70px] top-[-7px] w-3 h-3 bg-white transform rotate-45 border-t-1 border-l-1 border-gray-200'></div>

							<div className='p-4'>
								{!searchTerm ? (
									<>
										{/* Layout khi chưa nhập gì - Hiển thị danh mục phổ biến */}
										{/* Trending searches */}
										<div className='mb-4'>
											<div className='flex items-center mb-2'>
												<TrendingUp className='h-4 w-4 text-red-500 mr-2' />
												<h3 className='text-sm font-medium'>Xu hướng tìm kiếm</h3>
											</div>
											<div className='space-y-2'>
												{trendingSearches.map((item) => (
													<div
														key={item.id}
														className='flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer'
														onClick={() => handleSearchTermClick(item.text)}
													>
														<div className='flex items-center'>
															<Clock className='h-4 w-4 text-gray-400 mr-2' />
															<span className='text-sm'>{item.text}</span>
														</div>
														<span className='text-xs text-gray-400'>{item.category}</span>
													</div>
												))}
											</div>
										</div>

										{/* Popular categories */}
										<div>
											<h3 className='text-sm font-medium mb-3'>Danh mục phổ biến</h3>
											<div className='grid grid-cols-5 gap-3'>
												{popularCategories.map((category) => (
													<Link
														href={`/category/${category.id}`}
														key={category.id}
														className='group text-center'
														onClick={() => setOpenDropdown('none')}
													>
														<div className='w-full aspect-square relative mb-2 rounded-full overflow-hidden border border-gray-100'>
															<Image
																src={category.image}
																alt={category.name}
																layout='fill'
																objectFit='cover'
																className='transition-transform duration-300 group-hover:scale-110'
															/>
														</div>
														<span className='text-xs text-gray-700 group-hover:text-red-500 line-clamp-1'>
															{category.name}
														</span>
													</Link>
												))}
											</div>
										</div>
									</>
								) : (
									<>
										{/* Layout khi đã nhập - Hiển thị kết quả liên quan */}
										<div className='mb-4'>
											<div className='flex items-center mb-2'>
												<Search className='h-4 w-4 text-red-500 mr-2' />
												<h3 className='text-sm font-medium'>Kết quả liên quan</h3>
											</div>
											
											{/* Filtered results based on search term */}
											<div className='space-y-2'>
												{trendingSearches
													.filter(item => 
														item.text.toLowerCase().includes(searchTerm.toLowerCase())
													)
													.slice(0, 5)
													.map((item) => (
														<div
															key={item.id}
															className='flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer'
															onClick={() => handleSearchTermClick(item.text)}
														>
															<div className='flex items-center'>
																<Search className='h-4 w-4 text-gray-400 mr-2' />
																<span className='text-sm'>{item.text}</span>
															</div>
															<span className='text-xs text-gray-400'>{item.category}</span>
														</div>
													))
												}
											</div>
										</div>
										
										{/* Filtered categories */}
										<div className='mb-4'>
											<h3 className='text-sm font-medium mb-3'>Danh mục liên quan</h3>
											<div className='flex flex-wrap gap-2'>
												{popularCategories
													.filter(cat => 
														cat.name.toLowerCase().includes(searchTerm.toLowerCase())
													)
													.slice(0, 4)
													.map((category) => (
														<Link
															href={`/category/${category.id}`}
															key={category.id}
															className='flex items-center bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-700'
															onClick={() => setOpenDropdown('none')}
														>
															<span className='mr-1.5'>{category.name}</span>
														</Link>
													))
												}
											</div>
										</div>
										
										{/* "Tìm kiếm theo từ khóa" button */}
										<div className='mt-4 border-t pt-3'>
											<Link
												href={`/search?q=${encodeURIComponent(searchTerm)}`}
												className='flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-red-600 font-medium p-3 rounded-lg'
												onClick={() => setOpenDropdown('none')}
											>
												<Search className='h-4 w-4 mr-2' />
												<span>Tìm kiếm theo từ khóa "{searchTerm}"</span>
											</Link>
										</div>
									</>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}

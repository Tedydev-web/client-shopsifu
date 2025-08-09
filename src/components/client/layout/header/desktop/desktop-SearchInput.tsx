'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../style.css';
import { useDropdown } from '../dropdown-context';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { createCategorySlug } from '@/utils/slugify';
import { clientProductsService } from '@/services/clientProductsService';
import { useDebounce } from '@/hooks/useDebounce';
import { ClientSearchResultItem } from '@/types/client.products.interface';


export function SearchInput() {
	const [searchTerm, setSearchTerm] = useState('');
	const [hoverEffect, setHoverEffect] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const { openDropdown, setOpenDropdown } = useDropdown();
	
	// State cho kết quả tìm kiếm
	const [searchSuggestions, setSearchSuggestions] = useState<ClientSearchResultItem[]>([]);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
	
	// Sử dụng hook để lấy danh mục từ API
	const { categories, loading } = useCbbCategory(null);
	
	// Debounce search term để tránh gọi API quá nhiều
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	
	// Chuyển trạng thái focus thành dựa vào context
	const isFocused = openDropdown === 'search';
	
	// Tối ưu các handlers bằng useCallback để tránh re-render không cần thiết
	const handleFocus = useCallback(() => {
		setOpenDropdown('search');
	}, [setOpenDropdown]);
	
	const handleBlur = useCallback(() => {
		// Không đóng dropdown ngay lập tức khi blur để cho phép click vào dropdown
		// Việc đóng sẽ được xử lý bởi DropdownProvider khi click ngoài
	}, []);
	
	// Tách function fetchSearchSuggestions thành useCallback để tối ưu hiệu năng
	const fetchSearchSuggestions = useCallback(async (term: string) => {
		// Chỉ tìm kiếm khi có ít nhất 2 ký tự
		if (term.length < 2) {
			setSearchSuggestions([]);
			return;
		}
		
		setIsLoadingSuggestions(true);
		
		try {
			// Sử dụng AbortController để có thể hủy request nếu có một request mới
			const controller = new AbortController();
			const signal = controller.signal;
			
			// Đánh dấu request này là từ suggestions để dễ debug
			console.log("Fetching search suggestions for:", term, "(limit: 5)");
			
			// Gọi API tìm kiếm với signal để có thể cancel nếu cần
			// Gọi API gợi ý tìm kiếm (khác với API search chính)
			const response = await clientProductsService.getSearchSuggestions(term, 5);
			
			// Kiểm tra nếu request đã bị hủy
			if (signal.aborted) return;
			
			setSearchSuggestions(response.data);
		} catch (error) {
			// Kiểm tra nếu lỗi là do request bị hủy thì không xử lý
			if ((error as Error).name === 'AbortError') return;
			
			console.error("Error fetching search suggestions:", error);
			setSearchSuggestions([]);
		} finally {
			setIsLoadingSuggestions(false);
		}
	}, []);
	
	// Effect để gọi API search khi searchTerm thay đổi
	useEffect(() => {
		if (debouncedSearchTerm.length < 2) {
			setSearchSuggestions([]);
			return;
		}
		
		// Gọi hàm fetchSearchSuggestions đã được tối ưu
		fetchSearchSuggestions(debouncedSearchTerm);
		
		// Cleanup function để hủy request khi component unmount hoặc debouncedSearchTerm thay đổi
		return () => {
			// Nếu có controller để abort request, thực hiện ở đây
		};
	}, [debouncedSearchTerm, fetchSearchSuggestions]);
	
	// Chuyển đến trang tìm kiếm - được tách ra để tái sử dụng
	const navigateToSearch = useCallback((term: string) => {
		if (!term.trim()) return;
		
		setOpenDropdown('none');
		
		// Kiểm tra xem hiện tại có đang ở trang search không
		const isOnSearchPage = window.location.pathname === '/search';
		
		// Lấy thông tin search term hiện tại từ URL để so sánh
		const urlParams = new URLSearchParams(window.location.search);
		const currentSearchTerm = urlParams.get('q');
		
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
	}, [router, setOpenDropdown]);
	
	// Cập nhật từ khóa tìm kiếm và giữ focus
	const handleSearchTermClick = useCallback((term: string) => {
		setSearchTerm(term);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        // Nếu đang nhập text và modal chưa mở, mở modal
        if (newSearchTerm && openDropdown !== 'search') {
            setOpenDropdown('search');
        }
    }, [openDropdown, setOpenDropdown]);
    
    // Xử lý sự kiện khi người dùng nhấn phím
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            navigateToSearch(searchTerm);
        } else if (e.key === 'Escape') {
            // Đóng dropdown khi nhấn Escape
            e.preventDefault();
            setOpenDropdown('none');
        } else if (e.key === 'ArrowDown' && searchSuggestions.length > 0) {
            // Có thể thêm logic chọn gợi ý bằng phím mũi tên
            e.preventDefault();
            // Chức năng nâng cao - sẽ triển khai sau nếu cần
        }
    }, [searchTerm, searchSuggestions.length, navigateToSearch, setOpenDropdown]);

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
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						aria-label="Tìm kiếm"
						aria-expanded={isFocused}
						aria-controls="search-suggestions"
						role="combobox"
						autoComplete="off"
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
					<div 
						onClick={() => {
							if (searchTerm) {
								navigateToSearch(searchTerm);
							}
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
								aria-label="Tìm kiếm"
								onClick={() => searchTerm && navigateToSearch(searchTerm)}
							>
								<Search className='h-5 w-5 text-white' />
							</Button>
						</motion.div>
					</div>
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
							<div className='absolute search-dropdown-arrow w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-200'></div>
							
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
											{/* Layout khi chưa nhập gì - Chỉ hiển thị danh mục phổ biến từ API */}
											<div>
												{loading ? (
													// Hiển thị skeleton loading khi đang tải danh mục
													Array(5).fill(0).map((_, index) => (
														<div key={index} className='px-5 py-2.5'>
															<div className='w-full flex items-center'>
																<div className='w-10 h-10 bg-gray-200 rounded-full mr-3 animate-pulse'></div>
																<div className='h-4 bg-gray-200 rounded w-40 animate-pulse'></div>
															</div>
														</div>
													))
												) : (
													// Hiển thị 5 danh mục từ API
													categories.slice(0, 5).map((category) => (
														<motion.div
															key={category.value}
															className='cursor-pointer modal-input'
															onClick={() => setOpenDropdown('none')}
														>
															<div className='px-5 py-2.5'>
																<Link
																	href={createCategorySlug(category.label, [category.value])}
																	className='w-full flex items-center justify-between'
																	onClick={(e) => e.stopPropagation()}
																>
																	<div className='flex items-center'>
																		<div className='w-10 h-10 relative overflow-hidden rounded-full border border-gray-100 mr-3'>
																			{category.icon ? (
																				<Image
																					src={category.icon}
																					alt={category.label}
																					fill
																					sizes="40px"
																					className='object-cover transition-transform duration-300'
																				/>
																			) : (
																				<div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400'>
																					{category.label.charAt(0)}
																				</div>
																			)}
																		</div>
																		<span className='text-sm text-gray-800'>{category.label}</span>
																	</div>
																</Link>
															</div>
														</motion.div>
													))
												)}
											</div>
										</>
									) : (
										<>
											{/* Layout khi đã nhập - Hiển thị kết quả liên quan */}
											<div>
												{/* Hiển thị kết quả tìm kiếm từ API */}
												{isLoadingSuggestions ? (
													// Hiển thị skeleton loading khi đang tải kết quả
													Array(3).fill(0).map((_, index) => (
														<div key={index} className='px-5 py-2.5'>
															<div className='w-full flex items-center'>
																<div className='w-6 h-6 bg-gray-200 rounded-full mr-3 animate-pulse'></div>
																<div className='flex-1'>
																	<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-1'></div>
																	<div className='h-3 bg-gray-100 rounded w-1/2 animate-pulse'></div>
																</div>
															</div>
														</div>
													))
												) : searchSuggestions.length > 0 ? (
													// Hiển thị kết quả tìm kiếm nếu có
													searchSuggestions.map((item) => (
														<motion.div
															key={item.productId}
															className='cursor-pointer modal-input'
															onClick={() => handleSearchTermClick(item.productName)}
														>
															<div className='px-5 py-2.5 flex items-center justify-between'>
																<div className='flex items-center'>
																	<Search className='h-4 w-4 text-gray-500 mr-2.5' />
																	<span className='text-sm font-medium text-gray-800'>{item.productName}</span>
																</div>
																<span className='text-xs text-gray-500'>{item.categoryNames[0] || 'Sản phẩm'}</span>
															</div>
														</motion.div>
													))
												) : searchTerm.length > 1 ? (
													// Hiển thị thông báo không có kết quả
													<div className='px-5 py-6 text-center'>
														<p className='text-gray-500'>Không tìm thấy kết quả cho "{searchTerm}"</p>
													</div>
												) : null}
											</div>
										</>
									)}
								</div>
								
								{/* Footer section with padding - added pt-5 to create proper spacing */}
								{searchTerm && (
									<div className='px-5 pb-5 pt-5'>
										<div className='border-t border-gray-100 pt-4'>
											<div
												className='flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium p-3.5 rounded-lg transition-colors duration-200 cursor-pointer'
												onClick={() => {
													setOpenDropdown('none');
													navigateToSearch(searchTerm);
												}}
											>
												<Search className='h-4 w-4 mr-2.5' />
												<span>Tìm kiếm theo từ khóa "{searchTerm}"</span>
											</div>
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

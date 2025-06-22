'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const banners = [
	{
		title: 'Thời Trang Nam',
		description: 'Khám phá phong cách thời thượng cho phái mạnh',
		image: '/images/demo/Thoitrangnam.webp',
		link: '/category/men',
		gradient: 'to-blue-950/60',
	},
	{
		title: 'Thời Trang Nữ',
		description: 'Xu hướng thời trang mới nhất cho phái đẹp',
		image: '/images/demo/Thoitrangnu.webp',
		link: '/category/women',
		gradient: 'to-rose-950/60',
	},
	{
		title: 'Phụ Kiện',
		description: 'Điểm nhấn hoàn hảo cho set đồ của bạn',
		image: '/images/demo/Phukien.jpg',
		link: '/category/accessories',
		gradient: 'to-purple-950/60',
	},
];

const categories = [
	{
		title: 'Đề xuất',
		icon: '🌟',
		link: '/recommended'
	},
	{
		title: 'Làm đẹp & Sức khỏe',
		icon: '💄',
		link: '/beauty-health'
	},
	{
		title: 'Thời trang Nữ',
		icon: '👗',
		link: '/women-clothing'
	},
	{
		title: 'Gia dụng & Bếp',
		icon: '🏠',
		link: '/home-kitchen'
	},
	{
		title: 'Thời trang Nam',
		icon: '👔',
		link: '/men-clothing'
	},
	{
		title: 'Giày Nữ',
		icon: '👠',
		link: '/women-shoes'
	},
	{
		title: 'Đồ lót Nam',
		icon: '🩲',
		link: '/men-underwear'
	},
	{
		title: 'Thể thao & Ngoài trời',
		icon: '⚽',
		link: '/sports-outdoors'
	},
	{
		title: 'Phụ kiện',
		icon: '👜',
		link: '/accessories'
	},
	{
		title: 'Điện tử',
		icon: '📱',
		link: '/electronics'
	}
];

function Particles({ className = "" }: { className?: string }) {
	return (
		<div className={cn("absolute inset-0 pointer-events-none", className)}>
			{[...Array(20)].map((_, i) => (
				<motion.span
					key={i}
					className="absolute block w-1 h-1 bg-white/30 rounded-full"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
					}}
					animate={{
						scale: [0.5, 1, 0.5],
						opacity: [0.3, 0.8, 0.3],
						y: [0, -30, 0],
					}}
					transition={{
						duration: Math.random() * 3 + 2,
						repeat: Infinity,
						ease: "easeInOut",
						delay: Math.random() * 2,
					}}
				/>
			))}
		</div>
	);
}

export function CategoriesSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const categoriesRef = useRef<HTMLDivElement>(null);
	const [currentBanner, setCurrentBanner] = useState(0);
	const [isAutoplay, setIsAutoplay] = useState(true);
	const [direction, setDirection] = useState(0);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	useEffect(() => {
		if (!isAutoplay) return;
		const timer = setInterval(() => {
			setDirection(1);
			setCurrentBanner((prev) => (prev + 1) % banners.length);
		}, 5000);

		return () => clearInterval(timer);
	}, [isAutoplay]);

	const handlePrevious = () => {
		setIsAutoplay(false);
		setDirection(-1);
		setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
	};

	const handleNext = () => {
		setIsAutoplay(false);
		setDirection(1);
		setCurrentBanner((prev) => (prev + 1) % banners.length);
	};

	const scrollCategories = (direction: 'left' | 'right') => {
		if (!categoriesRef.current) return;
		
		const container = categoriesRef.current;
		const itemWidth = container.firstElementChild?.clientWidth || 0;
		const gap = 8; // gap-2 = 8px
		const containerWidth = container.clientWidth;
		const scrollAmount = Math.floor(containerWidth / (itemWidth + gap)) * (itemWidth + gap);
		
		const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
		
		container.scrollTo({
			left: targetScroll,
			behavior: 'smooth'
		});

		const maxScroll = container.scrollWidth - container.clientWidth;

		// Animate scroll buttons
		if (direction === 'left') {
			setCanScrollRight(true);
			setCanScrollLeft(targetScroll > 0);
		} else {
			setCanScrollLeft(true);
			setCanScrollRight(targetScroll < maxScroll);
		}
	};

	useEffect(() => {
		const checkScroll = () => {
			if (!categoriesRef.current) return;
			const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		};

		checkScroll();
		window.addEventListener('resize', checkScroll);
		return () => window.removeEventListener('resize', checkScroll);
	}, []);

	const slideVariants: Variants = {
		enter: (direction: number) => ({
			y: direction > 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.9,
			rotateX: direction > 0 ? 15 : -15,
		}),
		center: {
			zIndex: 1,
			y: 0,
			opacity: 1,
			scale: 1,
			rotateX: 0,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			y: direction < 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.9,
			rotateX: direction < 0 ? 15 : -15,
		}),
	};

	const titleVariants: Variants = {
		hidden: { 
			opacity: 0,
			scale: 1.02,
		},
		visible: (i: number) => ({
			opacity: 1,
			scale: 1,
			transition: {
				staggerChildren: 0.03,
				delayChildren: 0.02 * i,
				ease: [0.2, 0.8, 0.2, 1],
				duration: 0.4,
			},
		}),
		exit: {
			opacity: 0,
			scale: 0.98,
			transition: {
				staggerChildren: 0.02,
				staggerDirection: -1,
				ease: [0.6, 0, 0.4, 1],
				duration: 0.3,
			},
		},
	};

	const letterVariants: Variants = {
		hidden: { 
			opacity: 0,
			y: 10,
			rotateX: -60,
			scale: 0.9,
		},
		visible: {
			opacity: 1,
			y: 0,
			rotateX: 0,
			scale: 1,
			textShadow: '1px 1px 0 rgba(0,0,0,0.5), 2px 4px 6px rgba(0,0,0,0.3)',
			transition: {
				type: "spring",
				damping: 15,
				stiffness: 120,
				mass: 0.2,
				ease: [0.2, 0.8, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			y: -10,
			rotateX: 60,
			scale: 0.9,
			transition: {
				type: "spring",
				damping: 15,
				stiffness: 120,
				mass: 0.2,
				ease: [0.6, 0, 0.4, 1],
			},
		},
	};
	return (		<section className="w-full py-2">
			<div className="container mx-auto px-4">
				<div ref={containerRef}
					className="relative h-[150px] md:h-[175px] overflow-hidden rounded-xl group perspective-[2000px] hover:shadow-2xl hover:shadow-black/20 transition-all duration-500"
				>
					<motion.div
						initial={{ scale: 1 }}
						animate={{ 
							scale: [1, 1.02, 1],
						}}
						transition={{
							repeat: Infinity,
							duration: 8,
							ease: "easeInOut",
							times: [0, 0.5, 1],
						}}
						className="absolute inset-0"
					>
					<AnimatePresence
						initial={false}
						mode="popLayout"
						custom={direction}
						onExitComplete={() => setIsAutoplay(true)}
					>
						{banners.map((banner, index) => (
							index === currentBanner && (
								<motion.div
									key={banner.title}
									className="absolute inset-0"
									custom={direction}
									variants={slideVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{
										y: { 
											type: "spring", 
											stiffness: 150, 
											damping: 20, 
											mass: 0.8,
										},
										opacity: { duration: 0.6 },
										scale: { duration: 0.6 },
										rotateX: { 
											type: "spring",
											stiffness: 100,
											damping: 12,
											mass: 0.8,
										},
									}}
									style={{
										perspective: "2000px",
										transformStyle: 'preserve-3d',
									}}
								>
									<Particles className="opacity-50" />
									<motion.div 
										className="absolute inset-0 overflow-hidden"
									>
										<Image
											src={banner.image}
											alt={banner.title}
											fill
											className="object-cover object-center will-change-transform"
											priority={index === 0}
											sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
										/>
									</motion.div>
									<motion.div
										initial={{ opacity: 0.4 }}
										animate={{ 
											opacity: [0.4, 0.5, 0.4],
										}}
										transition={{
											repeat: Infinity,
											duration: 20,
											ease: "easeInOut",
											times: [0, 0.5, 1],
										}}
										className={cn(
											"absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent",
											`${banner.gradient} after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:via-transparent after:to-black/10`
										)}
									/>

									<div className="absolute inset-0 flex items-center">
										<div className="w-full md:w-3/5 px-6 md:px-10 space-y-2.5">
											<motion.div
												variants={titleVariants}
												initial="hidden"
												animate="visible"
												exit="exit"
												custom={0}
												className="text-2xl md:text-3xl font-bold text-white tracking-tight overflow-hidden perspective-[1000px] will-change-transform"
											>
												{Array.from(banner.title).map((char, i) => (
													<motion.span
														key={i}
														variants={letterVariants}
														style={{ 
															display: 'inline-block',
															transformStyle: 'preserve-3d',
															backfaceVisibility: 'hidden',
														}}
														className={cn(
															"relative",
															char === ' ' ? 'mr-1.5' : '',
															"after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/20 after:to-transparent after:opacity-0 after:hover:opacity-100 after:transition-opacity after:duration-300"
														)}
													>
														{char}
													</motion.span>
												))}
											</motion.div>
											<motion.div
												variants={titleVariants}
												initial="hidden"
												animate="visible"
												exit="exit"
												custom={1}
												className="text-sm text-white/90 font-medium max-w-[280px] md:max-w-[320px] overflow-hidden perspective-[1000px] will-change-transform"
											>
												{Array.from(banner.description).map((char, i) => (
													<motion.span
														key={i}
														variants={letterVariants}
														style={{ 
															display: 'inline-block',
															transformStyle: 'preserve-3d',
															backfaceVisibility: 'hidden',
														}}
														className={char === ' ' ? 'mr-0.5' : ''}
													>
														{char}
													</motion.span>
												))}
											</motion.div>
											<motion.div
												initial={{ opacity: 0, y: 15, scale: 0.9 }}
												animate={{ 
													opacity: 1, 
													y: 0,
													scale: 1,
													transition: {
														delay: 0.5,
														duration: 0.8,
														ease: [0.25, 1, 0.5, 1],
													}
												}}
												exit={{ 
													opacity: 0, 
													y: -15,
													scale: 0.9,
													transition: {
														duration: 0.4,
														ease: [0.6, 0, 0.4, 1],
													}
												}}
											>
												<Button
													asChild
													size="sm"
													variant="destructive"
													className="relative rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-500 hover:to-red-600 text-white hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-500 overflow-hidden group/btn"
												>
													<Link href={banner.link} className="inline-flex items-center gap-1.5">
														<span className="relative z-10 font-medium">Khám phá</span>
														<motion.span
															className="relative z-10"
															animate={{ 
																x: [0, 5, 0],
																opacity: [1, 0.8, 1],
																transition: {
																	repeat: Infinity,
																	duration: 1.5,
																	ease: "easeInOut",
																}
															}}
														>
															<ArrowRight className="h-3.5 w-3.5" />
														</motion.span>
														<motion.div
															className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-400/40 to-red-600/0"
															animate={{
																x: ['-200%', '200%'],
																transition: {
																	repeat: Infinity,
																	duration: 2.5,
																	ease: "easeInOut",
																}
															}}
														/>
													</Link>
												</Button>
											</motion.div>
										</div>
									</div>
								</motion.div>
							)
						))}
					</AnimatePresence>

					<Particles className="opacity-50" />
					</motion.div>						</div>
				{/* Categories Grid */}
				<div className="mt-5">							
				<h2 className="text-lg font-bold text-gray-800 mb-3.5 flex items-center justify-center gap-1.5">
						<span className="tracking-tight relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-500/20">KHÁM PHÁ DANH MỤC</span>
					</h2>
					<div className="relative group">
						<div 
							ref={categoriesRef}
							className="flex items-center gap-2 overflow-x-hidden scroll-smooth transition-transform duration-500 ease-out py-1 px-2 -mx-2"
						>
							{categories.map((category, index) => (
								<Link
									key={category.title}
									href={category.link}
									className="flex-shrink-0 group/item transition-transform duration-300"
								>
									<motion.div
										initial={{ scale: 1 }}
										whileHover={{ scale: 1.03 }}										className="px-4 py-2 rounded-full bg-white/95 border border-gray-200/80 hover:border-red-500 hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] transition-all duration-300 backdrop-blur-[2px]"
									>
										<span className="text-sm font-medium text-gray-600 whitespace-nowrap group-hover/item:text-red-500 transition-colors duration-300 tracking-wide">
											{category.title}
										</span>
									</motion.div>
								</Link>
							))}
						</div>
						
						{/* Navigation Buttons */}
						<motion.button
							initial={{ opacity: 0, x: 10 }}
							animate={{ 
								opacity: canScrollLeft ? 1 : 0,
								x: canScrollLeft ? -8 : 10
							}}
							transition={{
								duration: 0.2,
								ease: "easeOut"
							}}
							onClick={() => scrollCategories('left')}
							className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] backdrop-blur-[2px] flex items-center justify-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
							disabled={!canScrollLeft}
						>
							<ArrowRight className="w-4 h-4 text-gray-600 rotate-180" />
						</motion.button>

						<motion.button
							initial={{ opacity: 0, x: -10 }}
							animate={{ 
								opacity: canScrollRight ? 1 : 0,
								x: canScrollRight ? 8 : -10
							}}
							transition={{
								duration: 0.2,
								ease: "easeOut"
							}}
							onClick={() => scrollCategories('right')}
							className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] backdrop-blur-[2px] flex items-center justify-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
							disabled={!canScrollRight}
						>
							<ArrowRight className="w-4 h-4 text-gray-600" />
						</motion.button>
					</div>
				</div>
			</div>
		</section>
	);
}

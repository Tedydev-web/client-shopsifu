'use client';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
	const [currentBanner, setCurrentBanner] = useState(0);
	const [isAutoplay, setIsAutoplay] = useState(true);
	const [direction, setDirection] = useState(0);

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

	const slideVariants: Variants = {
		enter: (direction: number) => ({
			y: direction > 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.8,
			filter: 'blur(16px) brightness(1.2) contrast(1.2)',
			rotateX: direction > 0 ? 25 : -25,
		}),
		center: {
			zIndex: 1,
			y: 0,
			opacity: 1,
			scale: 1,
			filter: 'blur(0px) brightness(1) contrast(1)',
			rotateX: 0,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			y: direction < 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.8,
			filter: 'blur(16px) brightness(1.2) contrast(1.2)',
			rotateX: direction < 0 ? 25 : -25,
		}),
	};

	const titleVariants: Variants = {
		hidden: { 
			opacity: 0,
			filter: 'blur(12px)',
			scale: 1.2,
		},
		visible: (i: number) => ({
			opacity: 1,
			filter: 'blur(0px)',
			scale: 1,
			transition: {
				staggerChildren: 0.05,
				delayChildren: 0.04 * i,
				ease: [0.2, 0.8, 0.2, 1],
				duration: 0.8,
			},
		}),
		exit: {
			opacity: 0,
			filter: 'blur(12px)',
			scale: 0.9,
			transition: {
				staggerChildren: 0.03,
				staggerDirection: -1,
				ease: [0.6, 0, 0.4, 1],
				duration: 0.6,
			},
		},
	};

	const letterVariants: Variants = {
		hidden: { 
			opacity: 0,
			y: 20,
			rotateX: -120,
			scale: 0.7,
			textShadow: '0 0 0px rgba(255,255,255,0)',
		},
		visible: {
			opacity: 1,
			y: 0,
			rotateX: 0,
			scale: 1,
			textShadow: '0 0 30px rgba(255,255,255,0.3)',
			transition: {
				type: "spring",
				damping: 10,
				stiffness: 80,
				mass: 0.3,
				ease: [0.2, 0.8, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			y: -20,
			rotateX: 120,
			scale: 0.7,
			textShadow: '0 0 0px rgba(255,255,255,0)',
			transition: {
				type: "spring",
				damping: 10,
				stiffness: 80,
				mass: 0.3,
				ease: [0.6, 0, 0.4, 1],
			},
		},
	};

	return (
		<section className="w-full py-6">
			<div className="container mx-auto px-4">
				<div ref={containerRef} className="relative h-[150px] md:h-[175px] overflow-hidden rounded-xl group perspective-[2000px] hover:shadow-2xl hover:shadow-black/20 transition-shadow duration-500">
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
											stiffness: 120, 
											damping: 25, 
											mass: 1,
										},
										opacity: { duration: 1 },
										scale: { duration: 1 },
										filter: { duration: 1 },
										rotateX: { 
											type: "spring",
											stiffness: 80,
											damping: 15,
											mass: 1.2,
										},
									}}
									style={{
										perspective: "2000px",
										transformStyle: 'preserve-3d',
									}}
									whileHover={{
										scale: 1.02,
										transition: { duration: 0.5 },
									}}
								>
									<Particles className="opacity-50" />
									<motion.div 
										className="absolute inset-0"
										animate={{ 
											scale: [1, 1.15, 1],
											filter: ["brightness(0.85) contrast(1.2)", "brightness(1.1) contrast(1.3)", "brightness(0.85) contrast(1.2)"],
										}}
										transition={{
											repeat: Infinity,
											duration: 25,
											ease: "easeInOut",
											times: [0, 0.5, 1],
										}}
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
										initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
										animate={{ 
											opacity: [0.75, 0.9, 0.75],
											backdropFilter: ["blur(1px)", "blur(3px)", "blur(1px)"],
										}}
										transition={{
											repeat: Infinity,
											duration: 25,
											ease: "easeInOut",
											times: [0, 0.5, 1],
										}}
										className={cn(
											"absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent",
											`${banner.gradient} after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/30 after:via-transparent after:to-black/20`
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

					<motion.div
						initial={false}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="pointer-events-none"
					>
						<Button
							onClick={handlePrevious}
							variant="secondary"
							size="icon"
							className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-br from-white/95 to-white/80 hover:from-white hover:to-white/90 hover:shadow-xl hover:shadow-black/10 hover:scale-125 backdrop-blur-md"
							aria-label="Previous slide"
						>
							<ChevronLeft className="h-4 w-4 text-gray-800" />
						</Button>
						<Button
							onClick={handleNext}
							variant="secondary"
							size="icon"
							className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-br from-white/95 to-white/80 hover:from-white hover:to-white/90 hover:shadow-xl hover:shadow-black/10 hover:scale-125 backdrop-blur-md"
							aria-label="Next slide"
						>
							<ChevronRight className="h-4 w-4 text-gray-800" />
						</Button>
					</motion.div>

					<div className="absolute bottom-3 right-6 flex items-center gap-1.5">
						{banners.map((_, index) => (
							<motion.div
								key={index}
								whileHover={{ scale: 1.5 }}
								whileTap={{ scale: 0.8 }}
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 17,
								}}
							>
								<Button
									onClick={() => {
										setIsAutoplay(false);
										setDirection(index > currentBanner ? 1 : -1);
										setCurrentBanner(index);
									}}
									variant="ghost"
									size="icon"
									className={cn(
										"w-1.5 h-1.5 p-0 rounded-full transition-all duration-700",
										currentBanner === index
											? "bg-gradient-to-r from-white to-white/90 scale-150 shadow-lg shadow-white/20"
											: "bg-white/50 hover:bg-white/70 hover:shadow-md hover:shadow-white/10"
									)}
									aria-label={`Go to slide ${index + 1}`}
								/>
							</motion.div>
						))}
					</div>

					<Particles className="opacity-50" />
				</div>
			</div>
		</section>
	);
}

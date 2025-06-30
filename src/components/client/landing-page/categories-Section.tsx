'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { categories } from './landing-Mockdata';
import { BannerSection } from './banner-Section';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export function CategoriesSection() {
	return (
		<section className="w-full pt-8">
			<div className="container mx-auto">
				<BannerSection />

				{/* Categories Section */}
				<div className="mt-5">
					<h2 className="text-lg font-bold text-gray-800 mb-3.5 flex items-center justify-center gap-1.5">
						<span className="tracking-tight relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-500/20">
							KHÁM PHÁ DANH MỤC
						</span>
					</h2>
					<div className="mt-6">
						<Carousel
							opts={{
								align: "start",
								dragFree: true,
							}}
							className="w-full relative group"
						>
							<CarouselContent className="-ml-4">
								{categories.map((category) => (
									<CarouselItem key={category.title} className="pl-4 basis-auto">
										<Link
											href={category.link}
											className="group/item transition-transform duration-300 block"
										>
											<motion.div
												className="px-6 py-3 rounded-full border border-gray-300 hover:border-red-500 hover:bg-white hover:shadow-md transition-all duration-300"
											>
												<span className="text-sm font-medium text-gray-600 whitespace-nowrap group-hover/item:text-red-500 transition-colors duration-300 tracking-wide">
													{category.title}
												</span>
											</motion.div>
										</Link>
									</CarouselItem>
								))}
							</CarouselContent>
							<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed" />
								<CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed" />
							</div>
						</Carousel>
					</div>
				</div>
			</div>
		</section>
	);
}
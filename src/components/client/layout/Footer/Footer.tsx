'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { SocialIcon } from '@/components/ui/social-icons/SocialIcon';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PaymentIcon } from '@/components/ui/payment-icons/PaymentIcon';
import { PaymentType, PAYMENT_TYPES } from '@/types/payment';
import { ModernPaymentIcon } from '@/components/ui/payment-icons/ModernPaymentIcon';

type FooterLink = {
  text: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerLinks: FooterSection[] = [
  {
    title: 'Về chúng tôi',
    links: [
      { text: 'Giới thiệu ShopSiFu', href: '/about' },
      { text: 'Blog', href: '/blog' },
      { text: 'ShopSiFu Careers', href: '/careers' },
      { text: 'Tuyển dụng', href: '/jobs' },
      { text: 'Chính sách bảo mật', href: '/privacy' },
      { text: 'Điều khoản dịch vụ', href: '/terms' }
    ]
  },
  {
    title: 'Hỗ trợ & Dịch vụ',
    links: [
      { text: 'Trung tâm hỗ trợ', href: '/support' },
      { text: 'Giao hàng & Vận chuyển', href: '/shipping' },
      { text: 'Trả hàng & Hoàn tiền', href: '/returns' },
      { text: 'Phương thức thanh toán', href: '/payment' },
      { text: 'Liên hệ', href: '/contact' },
      { text: 'Báo cáo sản phẩm', href: '/report' }
    ]
  },
  {
    title: 'Thanh toán & Vận chuyển',
    links: [
      { text: 'Chính sách vận chuyển', href: '/shipping-policy' },
      { text: 'Chính sách đổi trả', href: '/return-policy' },
      { text: 'Chính sách hoàn tiền', href: '/refund-policy' },
      { text: 'Theo dõi đơn hàng', href: '/track-order' },
      { text: 'Phí vận chuyển', href: '/shipping-fees' },
      { text: 'Chính sách khiếu nại', href: '/complaints' }
    ]
  },
  {
    title: 'Kiếm tiền với ShopSiFu',
    links: [
      { text: 'Trở thành người bán', href: '/seller' },
      { text: 'Affiliate Program', href: '/affiliate' },
      { text: 'Chiết khấu & Ưu đãi', href: '/promotions' },
      { text: 'Chương trình giới thiệu', href: '/referral' },
      { text: 'Đối tác vận chuyển', href: '/logistics' },
      { text: 'Đại lý bán hàng', href: '/wholesale' }
    ]
  }
];

const paymentTypes: PaymentType[] = [
	PAYMENT_TYPES.VISA,
	PAYMENT_TYPES.MASTERCARD,
	PAYMENT_TYPES.JCB,
	PAYMENT_TYPES.UNIONPAY,	PAYMENT_TYPES.MOMO,
];

const paymentBorderColors = {
	[PAYMENT_TYPES.VISA]: '#1A1F71',
	[PAYMENT_TYPES.MASTERCARD]: '#FF5F00',
	[PAYMENT_TYPES.JCB]: '#0F4C97',
	[PAYMENT_TYPES.UNIONPAY]: '#E21836',
	[PAYMENT_TYPES.MOMO]: '#AF1A72',
	[PAYMENT_TYPES.ZALOPAY]: '#0068FF',
};

export function Footer() {
	const [mobileMenus, setMobileMenus] = useState<string[]>([]);
	const [email, setEmail] = useState('');

	const toggleMobileMenu = (title: string) => {
		setMobileMenus((prev) =>
			prev.includes(title)
				? prev.filter((t) => t !== title)
				: [...prev, title]
		);
	};

	const handleSubscribe = () => {
		// TODO: Implement newsletter subscription
		console.log('Subscribe:', email);
		setEmail('');
	};

	return (
		<footer className="bg-white border-t text-sm">
			{/* Newsletter Section */}
			<div className="border-b bg-gray-50/50">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="text-center md:text-left max-w-md">
							<h3 className="text-lg font-bold mb-1">
								Đăng ký nhận thông tin mới
							</h3>
							<p className="text-gray-600 text-sm">
								Nhận ngay <span className="font-medium text-primary">voucher 50K</span> khi đăng ký
							</p>
						</div>
						<div className="w-full md:w-auto">							
							<div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto md:mx-0">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Nhập email của bạn"
									className="flex-1 min-w-[350px] px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white"
								/>
								<button 
									onClick={handleSubscribe}
									className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
								>
									Đăng ký
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer Content */}			
			<div className=" mx-auto px-4 py-6">				
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 xl:gap-x-8 gap-y-6 justify-between">
						{footerLinks.map((section) => (
							<div key={section.title} className="flex-1 min-w-[200px]">
								{/* Desktop View */}
								<div className="hidden md:block">									
									<h3 className="font-medium mb-4 text-gray-900">{section.title}</h3>
									<ul className="space-y-2.5">
										{section.links.map((link) => (
											<li key={link.text}>
												<Link
													href={link.href}
													className="text-gray-500 hover:text-primary transition-colors"
												>
													{link.text}
												</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Mobile View */}
								<div className="md:hidden">
									<button
										onClick={() => toggleMobileMenu(section.title)}
										className="flex items-center justify-between w-full py-2"
									>
										<span className="font-medium text-gray-900">{section.title}</span>
										<ChevronDown
											className={cn(
												'w-4 h-4 text-gray-500 transition-transform duration-200',
												mobileMenus.includes(section.title) && 'rotate-180'
											)}
										/>
									</button>
									<div className={cn(
										'grid transition-all duration-200',
										mobileMenus.includes(section.title) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
									)}>
										<div className="overflow-hidden">
											<ul className="space-y-2 py-2">
												{section.links.map((link) => (
													<li key={link.text}>
														<Link
															href={link.href}
															className="text-gray-500 hover:text-primary transition-colors block"
														>
															{link.text}
														</Link>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Payment Methods & Social Links */}				
				<div className="mt-6 pt-6 border-t bg-gray-50/50">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-6 container mx-auto px-4">{/* Payment Methods */}
						<div className="text-center sm:text-left sm:flex-1">
							<h3 className="font-medium mb-4 text-gray-900 text-base">Phương thức thanh toán</h3>
							<div className="inline-flex flex-wrap justify-center sm:justify-start gap-3">							
								{paymentTypes.map((type) => (
									<ModernPaymentIcon
										key={type}
										type={type}
										size={44}
										className="w-[72px] h-11"
									/>
								))}
							</div>
							<p className="mt-2 text-xs text-gray-500">Thanh toán an toàn & bảo mật</p>
						</div>						{/* Social Links */}
						<div className="text-center sm:text-left">
							<h3 className="font-medium mb-4 text-gray-900 text-base">Kết nối với chúng tôi</h3>
							<div className="inline-flex items-center justify-center sm:justify-start gap-3">
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="w-11 h-11 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md hover:border-[#1877F2]/30 transition-all duration-300 group relative overflow-hidden"
								>
									<SocialIcon type="facebook" size={24} className="text-[#1877F2] relative z-10" />
									<div className="absolute inset-0 bg-gradient-to-r from-[#1877F2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</a>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="w-11 h-11 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md hover:border-[#E4405F]/30 transition-all duration-300 group relative overflow-hidden"
								>
									<SocialIcon type="instagram" size={24} className="text-[#E4405F] relative z-10" />
									<div className="absolute inset-0 bg-gradient-to-r from-[#E4405F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</a>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="w-11 h-11 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md hover:border-[#FF0000]/30 transition-all duration-300 group relative overflow-hidden"
								>
									<SocialIcon type="youtube" size={24} className="text-[#FF0000] relative z-10" />
									<div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</a>
								<a
									href="mailto:support@shopsifu.com"
									className="w-11 h-11 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md hover:border-[#EA4335]/30 transition-all duration-300 group relative overflow-hidden"
								>
									<SocialIcon type="mail" size={24} className="text-[#EA4335] relative z-10" />
									<div className="absolute inset-0 bg-gradient-to-r from-[#EA4335]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</a>
							</div>
							<p className="mt-2 text-xs text-gray-500">Theo dõi chúng tôi trên mạng xã hội</p>
						</div>
					</div>

					{/* Copyright */}
					<div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
						© {new Date().getFullYear()} ShopSiFu. Tất cả các quyền được bảo lưu.
						<br />
						<span className="mt-1 block">
							Địa chỉ: Tầng 6, Tòa nhà QTSC 9, Công viên phần mềm Quang Trung, P. Tân Chánh Hiệp, Q.12, TP.HCM
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function AuthHeader() {
  const pathname = usePathname()

  // Hàm chuyển path thành tiêu đề
  const getTitle = () => {
    if (pathname.includes('sign-up')) return 'Đăng ký'
    if (pathname.includes('forgot-password')) return 'Quên mật khẩu'
    if (pathname.includes('verify-otp')) return 'Xác minh OTP'
    return 'Đăng nhập'
  }

  return (
    <header className="w-full py-2 px-6 md:px-40 lg:px-90 flex items-center justify-between bg-white/80 backdrop-blur-sm fixed top-0 z-50 border-b">
      {/* Logo + Tiêu đề bên trái */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <a href="/" className="flex items-center">
          <Image
            src="/images/logo/logofullred.png"
            alt="Shopsifu Logo"
            width={220}
            height={220}
            className="h-18 w-auto"
            priority
          />
        </a>
        <h1 className="text-2xl font-small text-black whitespace-nowrap hidden md:inline">
          {getTitle()}
        </h1>
      </motion.div>

      {/* Hỗ trợ bên phải */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-primary cursor-pointer"
      >
        Bạn cần giúp đỡ?
      </motion.div>
    </header>
  )
}

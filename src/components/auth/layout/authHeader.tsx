'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function AuthHeader() {
  return (
    <header className="w-full py-2 px-6 md:px-40 lg:px-90 flex items-center justify-between bg-white/80 backdrop-blur-sm fixed top-0 z-50 border-b">
      {/* Logo + Đăng nhập bên trái */}
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
        {/* Ẩn chữ đăng nhập trên mobile */}
        <h1 className="text-2xl font-small text-black whitespace-nowrap hidden md:inline">
          Đăng nhập
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider"
import { Toast } from "@/components/ui/toastify"
import { Inter } from 'next/font/google';


// Import font Inter từ Google Fonts (subset 'latin' là đủ)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // dùng biến CSS để gắn Tailwind
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Shopsifu",
  description: "Mua sắm dễ dàng cùng Shopsifu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.variable} antialiased`}
      >
        <StoreProvider>
          <Toast/>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

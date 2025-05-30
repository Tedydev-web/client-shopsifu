import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import StoreProvider from "@/store/StoreProvider"
import { Toast } from "@/components/ui/toastify"
import ClientLayout from "./client-layout";
import { I18nextProvider } from "react-i18next";
import i18nextInstance from "@/i18n/i18n";
import { TrustDeviceModal } from "@/components/auth/layout/trustDevice-Modal";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="vi">
      <body className={`${inter.variable} antialiased`}>
          <StoreProvider>
            <ClientLayout>
              <Toast/>
              <TrustDeviceModal />
              {children}
            </ClientLayout>
          </StoreProvider>
      </body>
    </html>
  );
}

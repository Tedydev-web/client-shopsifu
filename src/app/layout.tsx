import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import StoreProvider from "@/store/StoreProvider"
import { Toast } from "@/components/ui/toastify"
import ClientLayout from "./client-layout";
import { TrustDeviceModal } from "@/components/auth/layout/trustDevice-Modal";
import { Toaster } from '@/components/ui/sonner';
import { TokenManager } from "./token-manager";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Shopsifu",
  description: "Mua sắm dễ dàng cùng Shopsifu",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider>
          <StoreProvider>
              <ClientLayout>
                <Toast/>
                <TrustDeviceModal />
                <TokenManager />
                {children}
              </ClientLayout>
              <Toaster position="bottom-right" />
            </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

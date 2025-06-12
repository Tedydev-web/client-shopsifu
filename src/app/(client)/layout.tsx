import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/client/layout/header/header-Main";
import { Footer } from "@/components/client/layout/Footer";
import { ScrollLock } from "@/components/client/layout/ScrollLock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopsifu Việt Nam- Mua và Bán Trên Website",
  description: "Thời trang nam cao cấp với chất lượng tốt nhất",
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <ScrollLock />
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1350px] w-full mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
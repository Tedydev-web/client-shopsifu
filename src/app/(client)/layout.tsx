import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/client/layout/header/header-Main";
import { Footer } from "@/components/client/layout/Footer/Footer";
import { HeroSection } from "@/components/client/landing-page/hero-Section";

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
      <Header />
      <main className="flex-grow bg-[#F5F5FA]">
      <HeroSection/>
        <div className="max-w-[1250px] w-full mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

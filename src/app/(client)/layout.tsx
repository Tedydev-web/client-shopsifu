import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ScrollLock } from "@/components/client/layout/ScrollLock";
import { Footer } from "@/components/client/layout/Footer/Footer";
import HeroSectionWrapper from "@/components/client/landing-page/wrapper/hero-Wrapper";
import { Header } from "@/components/client/layout/header/header-Main";
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
      <Header   />
      <main className="flex-grow bg-[#F5F5FA]">
      <HeroSectionWrapper/>
        <div className="max-w-[1250px] w-full mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
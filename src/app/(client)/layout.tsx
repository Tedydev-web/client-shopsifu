import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper"; // 👈 Tách wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopsifu Việt Nam - Mua và Bán Trên Website",
  description: "Thời trang nam cao cấp với chất lượng tốt nhất",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={inter.className}>{children}</div>;
}

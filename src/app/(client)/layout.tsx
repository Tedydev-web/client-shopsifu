import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

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
  return (
    <ReactQueryProvider>
      <div className={inter.className}>{children}</div>
    </ReactQueryProvider>
  );
}

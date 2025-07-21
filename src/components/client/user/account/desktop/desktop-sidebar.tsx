"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { sidebarItems } from "./desktop-MockSidebar";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="bg-white rounded-xl shadow-sm w-full md:w-[260px]">
      <nav className="flex flex-col py-3">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-4 py-2 my-1 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#FDEDEF] text-[#D70018] border-l-4 border-[#D70018]"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div
                  className={cn(
                    "mr-2",
                    isActive ? "text-[#D70018]" : "text-gray-600"
                  )}
                >
                  {item.icon}
                </div>
                <span>{t(item.labelKey)}</span>
              </div>
            </Link>
          );
        })}

        {/* Optional: QR hoặc Logout Section */}
        <div className="px-4 mt-4 text-xs text-gray-500">
          <p>Đăng nhập qua ứng dụng</p>
          <p>CellphoneS để tận hưởng ưu đãi đặc quyền</p>
          <div className="mt-2">
            <img src="/static/qr-app.png" alt="QR" className="w-20 h-20" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarItems } from "./desktop-MockSidebar";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="bg-white rounded-xl shadow-sm w-full md:w-[280px] h-[85vh]">
      <nav className="flex flex-col py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-5 py-3 my-[6px] text-base font-medium transition-all",
                  isActive
                    ? "bg-[#FDEDEF] text-[#D70018] border-l-4 border-[#D70018]"
                    : "text-gray-800 hover:text-[#D70018] hover:border-l-4 hover:border-[#D70018] hover:bg-[#FDEDEF]"
                )}
              >
                <div
                  className={cn(
                    "text-xl",
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
        <div className="px-5 mt-6">
          <Link
            href="/logout" // hoặc gọi API logout nếu cần
            className="block text-center w-full bg-gray-100 text-sm text-gray-800 py-2 rounded hover:bg-gray-200 transition"
          >
            {t("auth.common.logout")}
          </Link>
        </div>
      </nav>
    </aside>
  );
}

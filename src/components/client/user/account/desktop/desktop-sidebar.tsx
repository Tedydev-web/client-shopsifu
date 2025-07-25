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
    <aside className="bg-white rounded-xl shadow-sm w-full md:w-[340px] h-[85vh]">
      <nav className="flex flex-col py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center px-6 py-4 text-base font-medium transition-all",
                  isActive
                    ? "bg-[#FDEDEF] text-[#D70018]"
                    : "text-gray-800 hover:text-[#D70018] hover:bg-[#FDEDEF]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#D70018] rounded-r-lg" />
                )}
                <div
                  className={cn(
                    "text-xl mr-3",
                    isActive ? "text-[#D70018]" : "text-gray-600"
                  )}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{t(item.labelKey)}</span>
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

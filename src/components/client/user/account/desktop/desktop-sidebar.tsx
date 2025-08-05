"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarItems } from "./desktop-MockSidebar";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react"; // bạn có thể thay icon khác
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { handleLogout, loading: logoutLoading } = useLogout();

  return (
    <aside className="bg-white rounded-xl shadow-sm w-full md:w-[340px] h-full flex flex-col">
      <nav className="flex flex-col py-4 flex-grow">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const isPolicy = item.labelKey === "user.account.profile.policy";

          return (
            <Link
              key={item.href}
              href={item.href}
              {...(isPolicy && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <div
                className={cn(
                  "relative flex items-center px-6 py-4 text-base font-medium transition-all group",
                  isActive
                    ? "bg-[#FDEDEF] text-[#D70018]"
                    : "text-gray-800 hover:bg-[#FDEDEF]"
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 transition-all",
                    isActive
                      ? "bg-[#D70018] rounded-r-lg"
                      : "group-hover:bg-[#D70018] group-hover:rounded-r-lg"
                  )}
                />
                <div
                  className={cn(
                    "text-xl mr-3 transition-colors",
                    isActive
                      ? "text-[#D70018]"
                      : "text-gray-600 group-hover:text-[#D70018]"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isActive ? "text-[#D70018]" : "group-hover:text-[#D70018]"
                  )}
                >
                  {t(item.labelKey)}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout item dưới cùng */}
      <div className="pb-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutLoading}
          className={cn(
            "relative flex items-center w-full justify-start px-6 py-4 h-14 text-base font-medium transition-all group",
            "text-gray-800 hover:bg-[#FDEDEF]"
          )}
        >
          <div className="absolute left-0 top-0 h-full w-1 group-hover:bg-[#D70018] group-hover:rounded-r-lg transition-all" />
          <div className="text-xl mr-3 text-gray-600 group-hover:text-[#D70018] transition-colors">
            <LogOut className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="group-hover:text-[#D70018] transition-colors">
            {t("auth.common.logout")}
          </span>
        </Button>
      </div>
    </aside>
  );
}

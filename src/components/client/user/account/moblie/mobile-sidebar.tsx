"use client";

import { useSettingsMockData } from "./mobile-MockData";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import MobileHeader from "./moblie-Header";
import { useLogout } from "@/hooks/useLogout";

export default function MobileSettings() {
  const { header, sections, signOut } = useSettingsMockData();
  const { handleLogout, loading: logoutLoading } = useLogout();

  return (
    <div className="fixed inset-0 bg-white">
      <div className="h-full flex flex-col overflow-y-auto pb-safe">
        {/* Header - Fixed at top */}
        <MobileHeader title={header.title} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Account status */}
          <div className="px-4 py-3">
            <p className="text-green-600 font-bold">{header.statusTitle}</p>
            <p className="text-sm text-gray-600">{header.statusDesc}</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {header.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm font-medium"
                >
                  <span className="text-green-600">{item.icon}</span>
                  <span className="text-green-600 text-xs font-medium text-gray-900 leading-tight whitespace-nowrap">
                    {item.label}
                  </span>

                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="divide-y divide-gray-100 text-sm font-medium">
            {sections.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex justify-between items-center px-4 py-4 hover:bg-gray-50 active:bg-gray-100"
              >
                <span>{item.label}</span>
                <div className="flex items-center gap-2 text-gray-400">
                  {item.value && (
                    <span className="text-gray-500">{item.value}</span>
                  )}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!logoutLoading) {
                handleLogout();
              }
            }}
            disabled={logoutLoading}
            className={`w-full text-center text-red-600 py-4 text-sm font-semibold
      ${
        logoutLoading
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-50 active:bg-gray-100"
      }`}
          >
            {signOut.label}
          </button>
        </div>

        {/* Floating home icon */}
        <div className="fixed bottom-6 right-4 z-50">
          <Link
            href="/"
            className="flex items-center justify-center w-12 h-12 bg-white border rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <Home className="w-5 h-5 text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}

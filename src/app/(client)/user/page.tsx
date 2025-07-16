"use client";

import MobileSidebar from "@/components/client/user/account/moblie/mobile-sidebar";
import AccountLayout from "./layout";

export default function AccountPage() {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <MobileSidebar />
    </div>
  );
}

"use client";

import DashboardBanner from "./dashboard-Banner";
import DashboardFavorites from "./dashboard-Favourites";
import DashboardNotices from "./dashboard-Notices";
import DashboardOrders from "./dashboard-Orders";
import DashboardPromotions from "./dashboard-Promotions";
import DashboardUser from "./dashboard-User";

import { useUserData } from "@/hooks/useGetData-UserLogin";

export default function DashboardIndex() {
  const user = useUserData();

  return (
    <div className="px-4 bg-[#f5f5f7] min-h-screen space-y-6">
      <DashboardUser
          name={user?.name || "Khách"}
          email={user?.email || "Chưa có email"}
          phone={user?.phoneNumber || "Chưa có số điện thoại"}
          // birthday={user?.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : undefined}
          avatar={user?.avatar || ""}
        />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        
        <DashboardOrders />
        <DashboardPromotions />
        <DashboardFavorites />
      </div>

      <DashboardBanner />
    </div>
  );
}


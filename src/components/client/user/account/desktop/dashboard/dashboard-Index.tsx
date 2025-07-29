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
    <div className="pr-4 bg-[#f5f5f7] min-h-screen space-y-4">
      {/* <DashboardUser
        name={user?.name || "Khách"}
        email={user?.email || "Chưa có email"}
        phone={user?.phoneNumber || "Chưa có số điện thoại"}
        // birthday={user?.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : undefined}
        avatar={user?.avatar || ""}
      /> */}

      {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-4"> */}
        {/* Hàng 1 - Đơn hàng gần đây (2/3 chiều rộng) */}
        {/* <div className="xl:col-span-2">
          <DashboardOrders />
        </div> */}

        {/* Hàng 1 - Ưu đãi của bạn (1/3 chiều rộng) */}
        {/* <div>
          <DashboardPromotions />
        </div> */}

        {/* Hàng 2 - Sản phẩm yêu thích (full width) */}
        {/* <div className="xl:col-span-3">
          <DashboardFavorites />
        </div>
      </div> */}
      <DashboardOrders />

      {/* <DashboardBanner /> */}
    </div>
  );
}

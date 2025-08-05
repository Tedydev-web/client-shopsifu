"use client";

import { useResponsive } from "@/hooks/useResponsive";
import DashboardBanner from "./dashboard-Banner";
import DashboardFavorites from "./dashboard-Favourites";
import DashboardNotices from "./dashboard-Notices";
import DashboardOrders from "./dashboard-Orders";
import DashboardPromotions from "./dashboard-Promotions";
import DashboardUser from "./dashboard-User";

import { useUserData } from "@/hooks/useGetData-UserLogin";
import ProfileHeader from "../../profile/profile-Header";

export default function DashboardIndex() {
  const { isMobile } = useResponsive();
  const userData = useUserData();

  return (
    <div className="bg-[#f5f5f7] h-full space-y-4">
      {isMobile && (
        <ProfileHeader
          name={userData?.name ?? ""}
          email={userData?.email ?? ""}
          phone={userData?.phoneNumber ?? ""}
          // birthday={userData?.dob ?? ""}
          avatar={userData?.avatar ?? ""}
          totalOrders={userData?.statistics?.totalOrders ?? 0}
          totalSpent={userData?.statistics?.totalSpent ?? 0}
          memberSince={userData?.statistics?.memberSince ?? ""}
        />
      )}

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

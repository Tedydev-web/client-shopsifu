"use client";

import { useTranslations } from "next-intl";
import DashboardEmptyGrids from "./profile-DashBoardGrids";
import DashboardBanner from "./profile-Banner";
import { useUserData } from "@/hooks/useGetData-UserLogin";

export default function Dashboard() {
  const t = useTranslations();
  const user = useUserData();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "---";
  const phone = user?.phoneNumber ? user.phoneNumber.replace(/(\d{3})(\d{4})(\d{2})/, "$1****$3") : "---";
  const email = user?.email || "---";
  const address = user?.address || "---";
  const avatar = user?.avatar || "";
  const avatarText = fullName[0]?.toUpperCase() || "U";
  const tier = user?.tier || "S-NULL";
  const orderCount = user?.orderCount || 0;
  const accumulated = user?.accumulated || 0;
  const nextTierAmount = user?.nextTierAmount || 3000000;
  const tierDeadline = user?.tierDeadline || "01/01/2026";
  const accumulatedFrom = user?.accumulatedFrom || "01/01/2024";
  const passwordLastUpdated = user?.passwordLastUpdated || "---";
  const isGoogleLinked = user?.linkedAccounts?.google || false;
  const isZaloLinked = user?.linkedAccounts?.zalo || false;

  return (
    <div className="py-6 px-4 space-y-6 bg-[#f5f5f7] min-h-screen">
      {/* Tổng quan người dùng */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Left: User info */}
          <div className="flex items-center space-x-4">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 border">
                {avatarText}
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">{fullName}</h2>
              <p className="text-sm text-gray-600">{phone}</p>
              <p className="text-sm text-gray-600">{email}</p>
              <p className="text-sm text-gray-600">{address}</p>
              <div className="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-[#FDEDEF] text-[#D70018] rounded">
                {tier}
              </div>
              <p className="text-xs text-gray-500 mt-1">Cập nhật lại sau {tierDeadline}</p>
            </div>
          </div>

          {/* Middle: Order Count */}
          <div className="text-center md:border-l md:border-r md:px-8">
            <p className="text-lg font-semibold text-[#D70018]">{orderCount}</p>
            <p className="text-sm text-gray-600">Tổng số đơn hàng đã mua</p>
          </div>

          {/* Right: Accumulated */}
          <div className="text-center">
            <p className="text-lg font-semibold text-[#D70018]">
              {accumulated.toLocaleString()}đ
            </p>
            <p className="text-sm text-gray-600">
              Tổng tiền tích lũy · Từ {accumulatedFrom}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Cần chi tiêu thêm <span className="font-semibold">{nextTierAmount.toLocaleString()}đ</span> để lên hạng <span className="font-semibold">S-NEW</span>
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 text-xs text-gray-500 border-t pt-2">
          Tổng tiền và số đơn hàng được tính chung từ CellphoneS và Điện Thoại Vui.
        </div>
      </div>

      {/* Thông tin tài khoản chi tiết */}
      <div className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Mật khẩu</h3>
          <p className="text-sm text-gray-600">Cập nhật lần cuối lúc: {passwordLastUpdated}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Tài khoản liên kết</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">Google: {isGoogleLinked ? "Đã liên kết" : "Chưa liên kết"}</p>
            <p className="text-sm text-gray-700">Zalo: {isZaloLinked ? "Đã liên kết" : "Chưa liên kết"}</p>
          </div>
        </div>
      </div>

      {/* Lưới hiển thị đơn hàng gần đây, ưu đãi, sản phẩm yêu thích */}
      <DashboardEmptyGrids />

      {/* Banner chương trình nổi bật */}
      <DashboardBanner />
    </div>
  );
}

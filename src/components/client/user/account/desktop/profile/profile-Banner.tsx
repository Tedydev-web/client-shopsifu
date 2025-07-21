// components/client/user/dashboard/DashboardBanner.tsx
"use client";

export default function DashboardBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <img
        src="/images/banner-voucher.jpg"
        alt="Banner Voucher Combo"
        className="w-full h-auto rounded-xl shadow-sm object-cover"
      />
      <img
        src="/images/banner-app.jpg"
        alt="Banner Mua hàng qua App"
        className="w-full h-auto rounded-xl shadow-sm object-cover"
      />
      <img
        src="/images/banner-student.jpg"
        alt="Banner Ưu đãi Student & Teacher"
        className="w-full h-auto rounded-xl shadow-sm object-cover"
      />
    </div>
  );
}

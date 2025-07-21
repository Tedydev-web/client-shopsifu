"use client";

export default function DashboardEmptyGrids() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Đơn hàng gần đây */}
      <div className="bg-white rounded-xl shadow-sm p-4 text-center">
        <img
          src="/images/empty-orders.png"
          alt="empty orders"
          className="w-20 h-20 mx-auto mb-2"
        />
        <p className="text-sm text-gray-700 mb-1">
          Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào!
        </p>
        <a href="/" className="text-sm text-[#D70018] font-medium hover:underline">
          Mua sắm ngay
        </a>
      </div>

      {/* Ưu đãi của bạn */}
      <div className="bg-white rounded-xl shadow-sm p-4 text-center">
        <img
          src="/images/empty-discounts.png"
          alt="empty discounts"
          className="w-20 h-20 mx-auto mb-2"
        />
        <p className="text-sm text-gray-700 mb-1">Bạn chưa có ưu đãi nào.</p>
        <a href="/" className="text-sm text-[#D70018] font-medium hover:underline">
          Xem sản phẩm
        </a>
      </div>

      {/* Sản phẩm yêu thích */}
      <div className="bg-white rounded-xl shadow-sm p-4 text-center">
        <img
          src="/images/empty-favorites.png"
          alt="empty favorites"
          className="w-20 h-20 mx-auto mb-2"
        />
        <p className="text-sm text-gray-700 mb-1">
          Bạn chưa có sản phẩm nào yêu thích?
        </p>
        <a href="/" className="text-sm text-[#D70018] font-medium hover:underline">
          Mua sắm ngay
        </a>
      </div>
    </div>
  );
}

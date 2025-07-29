import Image from "next/image";
import Link from "next/link";

export default function DashboardOrders() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-center h-full max-h-full">
      <Image
        src="/static/order-empty.png"
        alt="Đơn hàng"
        width={120}
        height={120}
        className="mx-auto"
      />
      <p className="text-gray-600 mt-2 text-sm">
        Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào!
      </p>
      <Link
        href="#"
        className="text-[#D70018] text-sm font-medium mt-1 inline-block hover:underline"
      >
        Mua sắm ngay
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function DashboardPromotions() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
      <Image src="/static/promo-empty.png" alt="Ưu đãi" width={120} height={120} className="mx-auto" />
      <p className="text-gray-600 mt-2 text-sm">Bạn chưa có ưu đãi nào.</p>
      <Link href="#" className="text-[#D70018] text-sm font-medium mt-1 inline-block hover:underline">
        Xem sản phẩm
      </Link>
    </div>
  );
}

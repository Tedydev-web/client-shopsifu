import Image from "next/image";
import Link from "next/link";

export default function DashboardFavorites() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-center col-span-1 md:col-span-2 xl:col-span-1">
      <Image src="/static/favorite-empty.png" alt="Yêu thích" width={120} height={120} className="mx-auto" />
      <p className="text-gray-600 mt-2 text-sm">
        Bạn chưa có sản phẩm nào yêu thích? Hãy bắt đầu mua sắm ngay nào!
      </p>
      <Link href="#" className="text-[#D70018] text-sm font-medium mt-1 inline-block hover:underline">
        Mua sắm ngay
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function DashboardNotices() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center bg-[#e7f1ff] px-4 py-3 rounded-md text-sm text-[#004085]">
        <span>Đăng ký S-Student/ S-Teacher để nhận thêm ưu đãi tới 600k/sản phẩm</span>
        <Link href="#" className="text-blue-600 hover:underline font-medium">Đăng ký ngay</Link>
      </div>
      <div className="flex justify-between items-center bg-[#e7f1ff] px-4 py-3 rounded-md text-sm text-[#004085]">
        <span>Đăng ký Tân sinh viên để nhận mã giảm giá đến 10%</span>
        <Link href="#" className="text-blue-600 hover:underline font-medium">Đăng ký ngay</Link>
      </div>
    </div>
  );
}

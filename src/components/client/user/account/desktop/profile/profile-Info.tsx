import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ProfileInfo() {
  const info = [
    { label: "Họ và tên", value: "Trương Hùng Anh" },
    { label: "Số điện thoại", value: "0398618568" },
    { label: "Giới tính", value: "Nam" },
    { label: "Email", value: "teamofsgh@gmail.com" },
    { label: "Ngày sinh", value: "06/11/2006" },
    {
      label: "Địa chỉ mặc định",
      value: "Chung cư A2, Phường Quang Vinh, Thành phố Biên Hòa, Đồng Nai",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-xl">Thông tin cá nhân</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <Pencil size={16} />
          Cập nhật
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 text-sm text-gray-800">
        {/* Dòng 1 */}
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Họ và tên:</span>
          <span className="font-medium">{info[0].value}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Số điện thoại:</span>
          <span className="font-medium">{info[1].value}</span>
        </div>

        {/* Dòng 2 */}
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Giới tính:</span>
          <span className="font-medium">{info[2].value}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Email:</span>
          <span className="font-medium">{info[3].value}</span>
        </div>

        {/* Dòng 3 */}
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Ngày sinh:</span>
          <span className="font-medium">{info[4].value}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Địa chỉ mặc định:</span>
          <span className="font-medium text-right">{info[5].value}</span>
        </div>
      </div>
    </div>
  );
}

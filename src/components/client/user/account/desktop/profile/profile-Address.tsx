"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddressBook() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl">Sổ địa chỉ</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <Plus size={18} /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Địa chỉ 1 */}
        <div className="bg-gray-50 rounded-lg p-4 border space-y-2 relative">
          {/* Tags ở góc phải */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded flex items-center">
              🏠 Nhà
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
              Mặc định
            </span>
          </div>

          {/* Thông tin người nhận */}
          <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
            <span>Trương Hùng Anh</span>
            <span className="text-gray-400">|</span>
            <span>0398618568</span>
          </div>

          {/* Địa chỉ */}
          <div className="text-sm text-gray-500">
            Chung cư A2, Phường Quang Vinh, Thành phố Biên Hòa, Đồng Nai
          </div>

          {/* Hành động */}
          <div className="flex justify-end gap-4 mt-2 text-sm">
            <Button
              variant="ghost"
              className="text-red-500 hover:underline px-0"
            >
              Xoá
            </Button>
            <Button
              variant="ghost"
              className="text-blue-500 hover:underline px-0"
            >
              Cập nhật
            </Button>
          </div>
        </div>

        {/* Địa chỉ 2 */}
        <div className="bg-gray-50 rounded-lg p-4 border space-y-2 relative">
          {/* Tags ở góc phải */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded flex items-center">
              🏢 Công ty
            </span>
          </div>

          <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
            <span>Nguyễn Văn B</span>
            <span className="text-gray-400">|</span>
            <span>0987654321</span>
          </div>

          <div className="text-sm text-gray-500">
            123 Nguyễn Trãi, Quận 1, TP.HCM
          </div>

          <div className="flex justify-end gap-4 mt-2 text-sm">
            <Button
              variant="ghost"
              className="text-red-500 hover:underline px-0"
            >
              Xoá
            </Button>
            <Button
              variant="ghost"
              className="text-blue-500 hover:underline px-0"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

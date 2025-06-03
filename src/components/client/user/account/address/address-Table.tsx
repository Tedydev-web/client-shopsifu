"use client";

import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Plus } from "lucide-react"; // Thêm icon Plus

export default function AddressesTable() {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Tiêu đề và nút thêm địa chỉ */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          {t("user.account.address.myAddresses")}
        </h2>
        <Button className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("user.account.address.addNewAddress")}
        </Button>
      </div>

      {/* Đường kẻ ngăn cách */}
      <div className="border-b border-gray-200 mb-6"></div>

      {/* Nội dung khi chưa có địa chỉ */}
      <div className="p-4 text-center text-gray-500 mb-8 min-h-32">
        {t("user.account.address.noAddress")}
      </div>
    </div>
  );
}

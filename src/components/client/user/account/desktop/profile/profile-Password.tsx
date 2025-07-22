import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function PasswordSection() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4 py-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl">Mật khẩu</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <Pencil size={18} /> Thay đổi mật khẩu
        </Button>
      </div>
      <p className="text-gray-600 text-sm">
        Cập nhật lần cuối lúc:{" "}
        <span className="font-medium text-end">21/07/2025 21:12</span>
      </p>
    </div>
  );
}

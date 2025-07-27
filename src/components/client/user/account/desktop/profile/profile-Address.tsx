"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

type Address = {
  name: string;
  phone: string;
  address: string;
  tag?: string;
  isDefault?: boolean;
};

export default function AddressBook() {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      name: "Trương Hùng Anh",
      phone: "0398618568",
      address: "Chung cư A2, Phường Quang Vinh, Thành phố Biên Hòa, Đồng Nai",
      tag: "🏠 Nhà",
      isDefault: true,
    },
    {
      name: "Nguyễn Văn B",
      phone: "0987654321",
      address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
      tag: "🏢 Công ty",
    },
  ]);

  const form = useForm<Address>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    form.reset(addr);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    form.reset({ name: "", phone: "", address: "" });
    setOpen(true);
  };

  const handleSave = (data: Address) => {
    if (editingAddress) {
      // Cập nhật địa chỉ
      setAddresses((prev) =>
        prev.map((item) =>
          item === editingAddress ? { ...editingAddress, ...data } : item
        )
      );
    } else {
      // Thêm địa chỉ mới
      setAddresses((prev) => [...prev, data]);
    }

    setOpen(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-base text-[#121214]">Sổ địa chỉ</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#D70019] hover:text-red-600 hover:bg-red-50 transition"
          onClick={handleAdd}
        >
          <Plus size={18} /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="relative bg-[#F9F9F9] border rounded-xl p-4 flex flex-col"
          >
            {/* Dòng 1: tag và mặc định */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1D1D20]">
                {addr.tag ? addr.tag.replace(/^🏠|🏢/, "").trim() : "Địa chỉ"}
              </span>
              {addr.isDefault && (
                <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-[#193767] rounded">
                  Mặc định
                </span>
              )}
            </div>

            {/* Dòng 2 */}
            <div className="text-sm font-semibold text-[#1D1D20] flex flex-wrap items-center gap-1">
              <span>{addr.name}</span>
              <span className="text-[#000000]">|</span>
              <span>{addr.phone}</span>
            </div>

            {/* Dòng 3 */}
            <p className="text-sm text-[#71717A]">{addr.address}</p>

            {/* Dòng 4 */}
            <div className="mt-auto pt-4 flex justify-end items-center gap-3 text-sm">
              <button className="text-[#1D1D20] hover:underline transition">
                Xoá
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleEdit(addr)}
                className="text-[#3B82F6] hover:underline transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SheetRework để thêm/cập nhật địa chỉ */}
      <SheetRework
        open={open}
        onOpenChange={setOpen}
        title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
        subtitle="Thay đổi thông tin địa chỉ nhận hàng"
        onCancel={() => setOpen(false)}
        onConfirm={form.handleSubmit(handleSave)}
        confirmText="Lưu"
        cancelText="Hủy"
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ cụ thể" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </SheetRework>
    </div>
  );
}

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
        <h2 className="font-semibold text-xl">Sổ địa chỉ</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition"
          onClick={handleAdd}
        >
          <Plus size={18} /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg p-4 border space-y-2 relative"
          >
            {/* Tags ở góc phải */}
            <div className="absolute top-4 right-4 flex gap-2">
              {addr.tag && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded flex items-center">
                  {addr.tag}
                </span>
              )}
              {addr.isDefault && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                  Mặc định
                </span>
              )}
            </div>

            {/* Thông tin người nhận */}
            <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
              <span>{addr.name}</span>
              <span className="text-gray-400">|</span>
              <span>{addr.phone}</span>
            </div>

            {/* Địa chỉ */}
            <div className="text-sm text-gray-500">{addr.address}</div>

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
                onClick={() => handleEdit(addr)}
              >
                Cập nhật
              </Button>
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

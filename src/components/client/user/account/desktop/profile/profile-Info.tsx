"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InfoState {
  name: string;
  phone: string;
  gender: string;
  email: string;
  dob: string;
  address: string;
}

export default function ProfileInfo() {
  const [info, setInfo] = useState<InfoState>({
    name: "Trương Hùng Anh",
    phone: "0398618568",
    gender: "Nam",
    email: "teamofsgh@gmail.com",
    dob: "2006-11-06",
    address: "Chung cư A2, Phường Quang Vinh, Thành phố Biên Hòa, Đồng Nai",
  });

  const [open, setOpen] = useState(false);

  const form = useForm<InfoState>({
    defaultValues: info,
  });

  const onSubmit = (data: InfoState) => {
    setInfo(data);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-xl">Thông tin cá nhân</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition"
          onClick={() => setOpen(true)}
        >
          <Pencil size={16} />
          Cập nhật
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 text-sm text-gray-800">
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Họ và tên:</span>
          <span className="font-medium">{info.name}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Số điện thoại:</span>
          <span className="font-medium">{info.phone}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Giới tính:</span>
          <span className="font-medium">{info.gender}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Email:</span>
          <span className="font-medium">{info.email}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Ngày sinh:</span>
          <span className="font-medium">{info.dob}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Địa chỉ mặc định:</span>
          <span className="font-medium text-right">{info.address}</span>
        </div>
      </div>

      {/* Modal: SheetRework */}
      <SheetRework
        open={open}
        onOpenChange={setOpen}
        title="Cập nhật thông tin cá nhân"
        subtitle=""
        onCancel={() => form.reset()}
        onConfirm={form.handleSubmit(onSubmit)}
        confirmText="Cập nhật thông tin"
        cancelText="Thiết lập lại"
      >
        <Form {...form}>
          <form className="space-y-5">
            {(
              [
                ["name", "Họ và tên"],
                ["gender", "Giới tính"],
                ["dob", "Ngày sinh"],
                ["phone", "Số điện thoại"],
                ["email", "Email"],
                ["address", "Địa chỉ mặc định"],
              ] as [keyof InfoState, string][]
            ).map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{label}</FormLabel>
                    <FormControl>
                      {name === "dob" ? (
                        <Input
                          type="date"
                          {...field}
                          className="w-full h-12 text-[15px] px-4"
                        />
                      ) : name === "gender" ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full h-12 text-[15px] px-4 flex items-center border rounded-md">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="Nam">Nam</SelectItem>
                            <SelectItem value="Nữ">Nữ</SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : name === "address" ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full h-12 text-[15px] px-4 flex items-center border rounded-md">
                            <SelectValue placeholder="Chọn địa chỉ" />
                          </SelectTrigger>

                          <SelectContent className="max-w-[90vw]">
                            <SelectItem value="Chung cư A2, Phường Quang Vinh, Thành phố Biên Hòa, Đồng Nai">
                              Chung cư A2, Phường Quang Vinh, Thành phố Biên
                              Hòa, Đồng Nai
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                          disabled={["phone", "email"].includes(name)}
                          className="w-full h-12 text-[15px] px-4"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
      </SheetRework>
    </div>
  );
}

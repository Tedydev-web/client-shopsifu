"use client";

import { useEffect, useState } from "react";
import { Pencil, UploadCloud } from "lucide-react";
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
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { useUpdateProfile } from "@/components/client/user/account/profile/useProfile-Update";
import { UpdateProfileRequest } from "@/types/auth/profile.interface";
import Image from "next/image";
import useUploadMedia from "@/hooks/useUploadMedia";

interface InfoState {
  name: string;
  phoneNumber: string;
  gender: string;
  email: string;
  dob: string;
  address: string;
  avatar: string;
}

export default function ProfileInfo() {
  const userData = useUserData();
  const [open, setOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const form = useForm<Partial<InfoState>>({
    defaultValues: {
      name: userData?.name || "",
      phoneNumber: userData?.phoneNumber || "",
      avatar: userData?.avatar || "",
      // gender: userData.gender || "",
      // dob: userData.dob || "",
      // address: userData.address || "",
    },
  });

  const { updateProfile, loading } = useUpdateProfile(() => {
    setOpen(false);
  });

  const {
    handleAddFiles,
    uploadedUrls,
    files,
    uploadFiles,
    reset: resetUpload,
  } = useUploadMedia();

  const onSubmit = async (data: Partial<UpdateProfileRequest>) => {
    try {
      let avatarUrl = userData?.avatar;

      // Nếu có ảnh đại diện mới thì upload
      if (selectedAvatar) {
        const urls = await uploadFiles();
        if (urls.length > 0) {
          avatarUrl = urls[0];
        }
      }

      const payload: Partial<UpdateProfileRequest> = {
        ...data,
        avatar: avatarUrl,
      };

      updateProfile(payload);
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
    }
  };

  if (!userData) return null;

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
          <span className="font-medium">{userData.name}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Số điện thoại:</span>
          <span className="font-medium">{userData.phoneNumber}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-gray-500">Email:</span>
          <span className="font-medium">{userData.email}</span>
        </div>
      </div>

      {/* Modal: SheetRework */}
      <SheetRework
        open={open}
        onOpenChange={setOpen}
        title="Cập nhật thông tin cá nhân"
        subtitle=""
        onCancel={() => {
          form.reset();
          setSelectedAvatar(null);
          resetUpload();
        }}
        onConfirm={form.handleSubmit(onSubmit)}
        confirmText="Cập nhật thông tin"
        cancelText="Thiết lập lại"
        loading={loading}
      >
        {/* Avatar chọn ảnh */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="relative w-24 h-24">
            <Image
              src={
                selectedAvatar
                  ? URL.createObjectURL(selectedAvatar)
                  : userData.avatar || "/default-avatar.png"
              }
              alt="avatar"
              fill
              className="rounded-full object-cover border"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 text-sm gap-2"
            onClick={() => document.getElementById("avatarUpload")?.click()}
          >
            <UploadCloud size={16} />
            Đổi ảnh đại diện
          </Button>
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleAddFiles([file]);
                setSelectedAvatar(file);
              }
            }}
          />
        </div>

        <Form {...form}>
          <form className="space-y-5">
            {(
              [
                ["name", "Họ và tên"],
                ["gender", "Giới tính"],
                ["dob", "Ngày sinh"],
                ["phoneNumber", "Số điện thoại"],
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
                          disabled={["phoneNumber", "email"].includes(name)}
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

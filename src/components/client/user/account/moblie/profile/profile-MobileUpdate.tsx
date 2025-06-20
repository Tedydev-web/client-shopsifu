"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { UpdateProfileSchema } from "@/utils/schema";
import { z } from "zod";
import { showToast } from "@/components/ui/toastify";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { useUpdateProfile } from "./../../profile/useProfile-Update";

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    avatar: string;
  };
}

export function ProfileUpdateSheet({
  open,
  onOpenChange,
  initialData,
}: ProfileUpdateSheetProps) {
  const [avatar, setAvatar] = useState(initialData.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const userData = useUserData();
  const formSchema = UpdateProfileSchema(t);
  const { updateProfile, loading } = useUpdateProfile(() =>
    onOpenChange(false)
  );

  type ProfileFormData = z.infer<typeof formSchema>;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
    },
  });

  // Reset form khi mở hoặc initialData thay đổi
  useEffect(() => {
    if (open && initialData) {
      form.reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        username: initialData.username || "",
        phoneNumber: initialData.phoneNumber || "",
      });
    }
  }, [open, initialData, form]);

  // Xử lý chọn avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit chỉ gửi trường thay đổi
  const onSubmit = (data: ProfileFormData) => {
    const dirtyFields = form.formState.dirtyFields;
    const changedData: Partial<ProfileFormData> = {};

    // Lặp qua các trường đã bị thay đổi và thêm chúng vào đối tượng changedData
    (Object.keys(dirtyFields) as Array<keyof ProfileFormData>).forEach(
      (key) => {
        changedData[key] = data[key];
      }
    );

    // Nếu không có gì thay đổi, hiển thị thông báo và không làm gì cả
    if (Object.keys(changedData).length === 0) {
      showToast("Không có thay đổi nào để lưu.", "info");
      return;
    }
    // Chỉ gửi những dữ liệu đã thay đổi
    updateProfile(changedData);
  };

  const username = form.watch("username");
  const avatarText = username ? username[0].toUpperCase() : "U";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="h-[100vh] mx-auto w-full max-w-sm">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-xl font-semibold">
              {t("user.account.profile.title")}
            </DrawerTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="relative cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-gray-600">
                      {avatarText}
                    </span>
                  </div>
                )}
                {/* Camera icon button */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow hover:bg-gray-100 transition cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline-offset-2  transition-colors"
              >
                {t("user.account.profile.clickToChange")}
              </button>
            </div>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("user.account.profile.firstName")}
                </label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  autoFocus
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("user.account.profile.lastName")}
                </label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("user.account.profile.username")}
                </label>
                <Input
                  id="userName"
                  {...form.register("username")}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("user.account.profile.phone")}
                </label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  type="tel"
                  className="w-full"
                />
              </div>
              <Button
                className="bg-red-600 text-white w-full mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? t("common.saving") : t("user.account.profile.save")}
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
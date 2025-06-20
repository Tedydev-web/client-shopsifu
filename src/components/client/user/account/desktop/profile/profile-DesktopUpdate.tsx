"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import { useTranslation } from "react-i18next";
import { Camera } from "lucide-react";
import { showToast } from "@/components/ui/toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema } from "@/utils/schema";
import { useUpdateProfile } from "./../../profile/useProfile-Update";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useUserData } from "@/hooks/useGetData-UserLogin";

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
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [userName, setUserName] = useState(initialData.username);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber);
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
      avatar: "",
    },
  });

  useEffect(() => {
    if (userData && open) {
      form.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        phoneNumber: userData.phoneNumber || "",
        avatar: userData.avatar || "",
      });
    }
  }, [userData, open, form]);

  const handleSubmit = (data: ProfileFormData) => {
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
  const avatarText = userName ? userName[0].toUpperCase() : "U";

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t("user.account.profile.title")}
      subtitle={t("user.account.profile.subtitle")}
      onCancel={() => onOpenChange(false)}
      onConfirm={form.handleSubmit(handleSubmit)}
      isConfirmLoading={loading}
      confirmText={t("user.account.profile.save")}
      cancelText={t("user.account.profile.cancel")}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24 border" onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
                <AvatarImage
                  src={userData?.avatar || ""}
                  alt={userData?.username}
                />
                <AvatarFallback>
                  {userData?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-background border rounded-full cursor-pointer hover:bg-muted"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef} // <-- Thêm dòng này
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          {/* Thêm nút đổi ảnh đại diện ở đây */}
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-sm text-blue-500 hover:text-blue-700 hover:underline transition-all"
            >
              {t("user.account.profile.clickToChange")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user.account.profile.lastName")}</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user.account.profile.firstName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("user.account.profile.username")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("user.account.profile.phone")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </SheetRework>
  );
}

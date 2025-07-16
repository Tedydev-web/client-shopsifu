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
import { useTranslations } from "next-intl";
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
    name: string;
    phoneNumber: string;
    avatar: string;
    address?: string;
  };
}

export function ProfileUpdateSheet({
  open,
  onOpenChange,
  initialData,
}: ProfileUpdateSheetProps) {
  const [avatar, setAvatar] = useState(initialData.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const userData = useUserData();
  const formSchema = UpdateProfileSchema(t);
  const { updateProfile, loading } = useUpdateProfile(() =>
    onOpenChange(false)
  );

  type ProfileFormData = z.infer<typeof formSchema>;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (userData && open) {
      form.reset({
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        // address: userData.address || "",
        avatar: userData.avatar || "",
      });
      setAvatar(userData.avatar || "");
    }
  }, [userData, open, form]);

  const handleSubmit = (data: ProfileFormData) => {
    const dirtyFields = form.formState.dirtyFields;
    const changedData: Partial<ProfileFormData> = {};

    (Object.keys(dirtyFields) as Array<keyof ProfileFormData>).forEach(
      (key) => {
        changedData[key] = data[key];
      }
    );

    if (data.avatar && data.avatar !== userData?.avatar) {
      changedData.avatar = data.avatar;
    }

    if (Object.keys(changedData).length === 0) {
      showToast("Không có thay đổi nào để lưu.", "info");
      return;
    }

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
        const base64 = reader.result as string;
        setAvatar(base64);
        form.setValue("avatar", base64, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

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
              <Avatar
                className="w-24 h-24 border"
                onClick={handleAvatarClick}
                style={{ cursor: "pointer" }}
              >
                <AvatarImage src={avatar} alt={userData?.name} />
                <AvatarFallback>
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
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
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-sm text-blue-500 hover:text-blue-700 hover:underline transition-all"
            >
              {t("user.account.profile.clickToChange")}
            </button>
          </div>

          <FormField
            control={form.control}
            name="name"
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

          {/* <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("user.account.profile.address")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </form>
      </Form>
    </SheetRework>
  );
}

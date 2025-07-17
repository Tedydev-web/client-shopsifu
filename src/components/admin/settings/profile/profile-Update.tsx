"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { useUpdateProfile } from "./useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { showToast } from "@/components/ui/toastify";
import { UpdateProfileSchema } from "@/utils/schema";

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileUpdateSheet({
  open,
  onOpenChange,
}: ProfileUpdateSheetProps) {
  // const [avatar, setAvatar] = useState(initialData.avatar);
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
      // setAvatar(userData.avatar || "");
    }
  }, [userData, open, form]);

  const onSubmit = (data: ProfileFormData) => {
    const hasChanges =
      data.name !== userData?.name ||
      data.phoneNumber !== userData?.phoneNumber ||
      data.avatar !== userData?.avatar;

    if (!hasChanges) {
      showToast("Không có thay đổi nào để lưu.", "info");
      return;
    }

    updateProfile(data);
  };

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t("admin.profileUpdate.title")}
      subtitle={t("admin.profileUpdate.subtitle")}
      onCancel={() => onOpenChange(false)}
      onConfirm={form.handleSubmit(onSubmit)}
      isConfirmLoading={loading}
      confirmText="Lưu thay đổi"
      cancelText="Hủy"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24 border">
                <AvatarImage
                  src={userData?.avatar || ""}
                  alt={userData?.name}
                />
                <AvatarFallback>
                  {userData?.name?.charAt(0).toUpperCase()}
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
                />
              </label>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.common.name")}</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus />
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
                <FormLabel>{t("auth.common.phonenumber")}</FormLabel>
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

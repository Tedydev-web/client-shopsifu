"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Pencil, Info } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useUpdatePasswordSchema } from "@/utils/schema";
import { z } from "zod";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import {
  usePasswordChangePassword,
  ChangePasswordResult,
} from "./useProfile-ChangePassword";

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const STORAGE_KEY = "lastPasswordChangedAt";

export default function PasswordSection() {
  const t = useTranslations();
  const user = useUserData();
  const { loading, handleChangePassword } = usePasswordChangePassword();

  const [open, setOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  useEffect(() => {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value) setLastUpdated(value);
    console.log("Last password change timestamp:", value);
  }, []);

  const toggleShow = (field: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const schema = useUpdatePasswordSchema(t);
  type PasswordFormData = z.infer<typeof schema>;

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (!user) return;

    const result = (await handleChangePassword(data)) as ChangePasswordResult;

    if (result.success && result.timestamp) {
      localStorage.setItem(STORAGE_KEY, result.timestamp);
      setLastUpdated(result.timestamp);
      form.reset();
      setOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-4 border">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl text-gray-800">
          {t("user.account.password.title")}
        </h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition"
          onClick={() => setOpen(true)}
        >
          <Pencil size={18} />
          {t("user.account.password.changePassword")}
        </Button>
      </div>

      {lastUpdated && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Cập nhật lần cuối lúc:</p>
          <span className="font-medium text-gray-800">
            {formatDate(lastUpdated)}
          </span>
        </div>
      )}

      <SheetRework
        open={open}
        onOpenChange={setOpen}
        title={t("user.account.password.title")}
        subtitle={t("user.account.password.subtitle")}
        confirmText={t("user.account.password.changePassword")}
        cancelText={t("common.cancel")}
        onCancel={() => setOpen(false)}
        onConfirm={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md mb-4 text-blue-700 text-sm">
          <Info className="w-4 h-4 mt-0.5" />
          <p>{t("user.account.password.subtitle")}</p>
        </div>

        <Form {...form}>
          <div className="space-y-4">
            {/* Current password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("user.account.password.currentPassword")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.password ? "text" : "password"}
                        placeholder={t(
                          "user.account.password.currentPasswordPlaceholder"
                        )}
                        {...field}
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShow("password")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {show.password ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("user.account.password.newPassword")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.newPassword ? "text" : "password"}
                        placeholder={t(
                          "user.account.password.newPasswordPlaceholder"
                        )}
                        {...field}
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShow("newPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {show.newPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm password */}
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("user.account.password.confirmPassword")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.confirmNewPassword ? "text" : "password"}
                        placeholder={t(
                          "user.account.password.newPasswordPlaceholder"
                        )}
                        {...field}
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShow("confirmNewPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {show.confirmNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </SheetRework>
    </div>
  );
}

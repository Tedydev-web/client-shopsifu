"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { passwordSchema, type PasswordFormData } from "@/utils/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Info } from "lucide-react";
import { t } from "i18next";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: {
    name: string;
    email: string;
  };
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  userInfo,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      // TODO: Call API to change password
      onOpenChange(false);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="sm:max-w-[300px] p-4 rounded-[18px] shadow-lg">
        <DialogHeader className="flex justify-between items-center border-b pb-2">
          <DialogTitle className="text-lg font-semibold">
            Change password
          </DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700" />
        </DialogHeader>
        <div className="py-3 space-y-4">
          <div className="mb-4">
            <div className="font-medium text-sm">{userInfo.name}</div>
            <div className="text-xs text-gray-500">{userInfo.email}</div>
          </div>

          <div className="flex items-center gap-2 p-2 mb-2 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-600">
              {t("user.account.address.subtitle")} (!$@%).
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm">
                        {t("user.account.address.currentPassword")}
                      </FormLabel>
                      <a href="#" className="text-xs text-gray-500 underline">
                        Forget password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-full text-sm p-2 border rounded"
                        placeholder={t(
                          "user.account.address.currentPasswordPlaceholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      {t("user.account.address.newPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-full text-sm p-2 border rounded"
                        placeholder={t(
                          "user.account.address.newPasswordPlaceholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 characters required
                    </p>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      {t("user.account.address.confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-full text-sm p-2 border rounded"
                        placeholder={t(
                          "user.account.address.newPasswordPlaceholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-orange-500 text-white rounded-full py-2 text-sm"
                disabled={loading}
              >
                {loading
                  ? t("user.account.address.processing")
                  : t("user.account.address.changePassword")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

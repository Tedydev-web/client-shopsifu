"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { passwordSchema } from "@/utils/schema";
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
import { Info, Lock, X, Camera } from "lucide-react";
import { t } from "i18next";
import { z } from "zod";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fisrtName: string;
  lastName: string;
  username: string;
}

type PasswordFormData = z.infer<ReturnType<typeof passwordSchema>>;

export function ChangePasswordModal({
  open,
  onOpenChange,
  fisrtName,
  lastName,
  username,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const getFullName = () => {
    return [fisrtName, lastName].filter(Boolean).join(" ");
  };

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema(t)),
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="h-[100vh] mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              <DrawerTitle className="text-xl font-semibold">
                {t("user.account.password.title")}
              </DrawerTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <DrawerDescription>
              <div className="mt-2">
                {getFullName() && (
                  <div className="text-sm text-gray-500">{getFullName()}</div>
                )}
                <div className="font-medium text-sm">@{username}</div>
              </div>
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-600">
                {t("user.account.password.subtitle")} (!$@%).
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          {t("user.account.password.currentPassword")}
                        </FormLabel>
                        <a
                          href="#"
                          className="text-xs text-gray-500 hover:underline"
                        >
                          {t("user.account.password.forgotPassword")}
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          className="text-sm"
                          placeholder={t(
                            "user.account.password.currentPasswordPlaceholder"
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
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">
                        {t("user.account.password.newPassword")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="text-sm"
                          placeholder={t(
                            "user.account.password.newPasswordPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        {t("user.account.password.minLength")}
                      </p>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">
                        {t("user.account.password.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="text-sm"
                          placeholder={t(
                            "user.account.password.newPasswordPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <DrawerFooter className="border-t">
          <div className="flex justify-end">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-red-600 text-white w-full"
              disabled={loading}
            >
              {loading
                ? t("user.account.password.processing")
                : t("user.account.password.changePassword")}
            </Button>
          </div>
        </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

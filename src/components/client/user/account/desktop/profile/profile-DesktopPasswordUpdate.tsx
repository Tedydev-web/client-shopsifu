"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { EyeOff, Info, Eye } from "lucide-react";
import { t } from "i18next";
import { z } from "zod";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { usePasswordChangePassword } from "../../profile/useProfile-ChangePassword";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string;
  lastName: string;
  username: string;
  revokeOtherSessions: boolean;
}

type PasswordFormData = z.infer<ReturnType<typeof passwordSchema>> & {
  revokeOtherSessions: boolean;
};

export function ChangePasswordModal({
  open,
  onOpenChange,
  firstName,
  lastName,
  username,
}: ChangePasswordModalProps) {
  const { loading, handleChangePassword } = usePasswordChangePassword();
  const user = useUserData();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
  const getFullName = () => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };
  const currentPasswordSchema = passwordSchema(t);
  type PasswordFormData = z.infer<typeof currentPasswordSchema>;

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("user.account.password.title")}
          </DialogTitle>
          <div className="mt-2">
            {getFullName() && (
              <div className="text-sm text-gray-500">{getFullName()}</div>
            )}
            <div className="font-medium text-sm">@{username}</div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-2 p-3 mb-4 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-600">
              {t("user.account.password.subtitle")} (!$@%).
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data: PasswordFormData) => {
                if (!user) return;

                const result = await handleChangePassword({
                  currentPassword: data.currentPassword,
                  newPassword: data.newPassword,
                  confirmPassword: data.confirmPassword,
                  revokeOtherSessions: revokeOtherSessions,
                });

                if (result) {
                  form.reset();
                  setRevokeOtherSessions(false);
                  onOpenChange(false);
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("user.account.password.currentPassword")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder={t(
                            "user.account.password.currentPasswordPlaceholder"
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          type={showNewPassword ? "text" : "password"}
                          placeholder={t(
                            "user.account.password.newPasswordPlaceholder"
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("user.account.password.confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t(
                            "user.account.password.newPasswordPlaceholder"
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Revoke other sessions checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="revokeOtherSessions"
                  checked={revokeOtherSessions}
                  onCheckedChange={(checked) =>
                    setRevokeOtherSessions(checked === true)
                  }
                />
                <label
                  htmlFor="revokeOtherSessions"
                  className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("user.account.password.revokeOtherSessions")}
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
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

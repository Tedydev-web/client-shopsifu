"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { SheetRework } from '@/components/ui/component/sheet-rework';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { useUpdateProfile } from './useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { showToast } from '@/components/ui/toastify';
import { UpdateProfileSchema } from '@/utils/schema';

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileUpdateSheet({ open, onOpenChange }: ProfileUpdateSheetProps) {
  const { t } = useTranslation();
  const userData = useUserData();
  const formSchema = UpdateProfileSchema(t);
  const { updateProfile, loading } = useUpdateProfile(() => onOpenChange(false));

  type ProfileFormData = z.infer<typeof formSchema>;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (userData && open) {
      form.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        phoneNumber: userData.phoneNumber || '',
      });
    }
  }, [userData, open, form]);

  const onSubmit = (data: ProfileFormData) => {
    const dirtyFields = form.formState.dirtyFields;
    const changedData: Partial<ProfileFormData> = {};

    // Lặp qua các trường đã bị thay đổi và thêm chúng vào đối tượng changedData
    (Object.keys(dirtyFields) as Array<keyof ProfileFormData>).forEach((key) => {
      changedData[key] = data[key];
    });

    // Nếu không có gì thay đổi, hiển thị thông báo và không làm gì cả
    if (Object.keys(changedData).length === 0) {
      showToast('Không có thay đổi nào để lưu.', 'info');
      return;
    }

    // Chỉ gửi những dữ liệu đã thay đổi
    updateProfile(changedData);
  };

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t('admin.profileUpdate.title')}
      subtitle={t('admin.profileUpdate.subtitle')}
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
                <AvatarImage src={userData?.avatar || ''} alt={userData?.username} />
                <AvatarFallback>{userData?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-background border rounded-full cursor-pointer hover:bg-muted"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.common.lastname')}</FormLabel>
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
                  <FormLabel>{t('auth.common.firstname')}</FormLabel>
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
                <FormLabel>{t('auth.common.username')}</FormLabel>
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
                <FormLabel>{t('auth.common.phonenumber')}</FormLabel>
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

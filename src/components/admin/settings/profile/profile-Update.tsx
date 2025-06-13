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
    updateProfile({
      ...data,
      avatar: userData?.avatar || null, // Giữ lại avatar cũ nếu không thay đổi
    });
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
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.common.lastName')}</FormLabel>
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
                  <FormLabel>{t('auth.common.firstName')}</FormLabel>
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
                <FormLabel>{t('auth.common.phoneNumber')}</FormLabel>
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

"use client";

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { SheetRework } from '@/components/ui/component/sheet-rework';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '@/store/features/auth/profileSlide';

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<UserProfile>;
}

export function ProfileUpdateSheet({ open, onOpenChange, initialData }: ProfileUpdateSheetProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '');
      setLastName(initialData.lastName || '');
    }
  }, [initialData, open]);

  const handleConfirm = () => {
    // TODO: Implement API call to update profile
    console.log('Saving:', { firstName, lastName });
    onOpenChange(false);
  };

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t('admin.profileUpdate.title')}
      subtitle={t('admin.profileUpdate.subtitle')}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      confirmText="Lưu thay đổi"
      cancelText="Hủy"
    >
      <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Họ
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Tên
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
      </form>
    </SheetRework>
  );
}

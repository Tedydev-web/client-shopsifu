'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { showToast } from "@/components/ui/toastify";
import { PermissionItem } from '@/types/auth/permission.interface';

interface PermissionsModalUpsertProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  permission?: PermissionItem | null;
  onSubmit?: (data: Partial<PermissionItem>) => Promise<void>;
}

export default function PermissionsModalUpsert({ open, onClose, mode, permission, onSubmit }: PermissionsModalUpsertProps) {
  const t = useTranslations();
  const [action, setAction] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && permission) {
      setAction(permission.action || '');
      setDescription(permission.description || '');
    } else {
      setAction('');
      setDescription('');
    }
  }, [mode, permission, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.trim() || !subject.trim()) {
      showToast(t('admin.permissions.modal.validation'), 'error');
      return;
    }

    setLoading(true);
    try {
      const data: Partial<PermissionItem> = { action, description };
      if (mode === 'edit' && permission) {
        data.id = permission.id;
      }
      await onSubmit?.(data);
      onClose();
    } catch (error) {
      // Error is already handled by the parent component's try-catch block
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? t("admin.permissions.modal.addTitle")
              : t("admin.permissions.modal.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? t("admin.permissions.modal.addSubtitle")
              : t("admin.permissions.modal.editSubtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.action")}</label>
            <Input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder={t("admin.permissions.modal.actionPlaceholder")}
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.subject")}</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("admin.permissions.modal.subjectPlaceholder")}
              required
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.description")}</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("admin.permissions.modal.descriptionPlaceholder")}
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t("admin.permissions.modal.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("admin.permissions.modal.processing")
                : (mode === 'add' ? t("admin.permissions.modal.save") : t("admin.permissions.modal.update"))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

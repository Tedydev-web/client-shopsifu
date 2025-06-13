import { z } from "zod"

export const passwordSchema = (t: (key: string) => string) => z.object({
  currentPassword: z.string().min(1, { message: t('admin.profileSettings.password.validation.currentPasswordRequired') }),
  newPassword: z
    .string()
    .min(8, { message: t('admin.profileSettings.password.validation.newPasswordMinLength') })
    .regex(/[0-9]/, { message: t('admin.profileSettings.password.validation.newPasswordDigit') })
    .regex(/[a-zA-Z]/, { message: t('admin.profileSettings.password.validation.newPasswordLetter') })
    .regex(/[!$@%]/, { message: t('admin.profileSettings.password.validation.newPasswordSpecialChar') }),
  confirmPassword: z.string().min(1, { message: t('admin.profileSettings.password.validation.confirmPasswordRequired') }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t('admin.profileSettings.password.validation.passwordsDoNotMatch'),
  path: ["confirmPassword"]
});

export const EmailSchema = (t: (key: string) => string) => z.object({
  email: z.string().email({ message: t('form.validation.email.invalid') }),
});

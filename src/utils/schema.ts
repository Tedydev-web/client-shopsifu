import { z } from "zod"
import { TFunction } from 'i18next'

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

export const UpdateProfileSchema = (t: TFunction) =>
  z.object({
    firstName: z.string().min(1, {
      message: t('validation.firstName')
    }),
    lastName: z.string().min(1, {
      message: t('validation.lastName')
    }),
    username: z.string().min(3, {
      message: t('validation.username')
    }),
    phoneNumber: z.string().min(10, {
      message: t('validation.minLengthPhone')
    }),
  });
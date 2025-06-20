import { z } from "zod"
import { TFunction } from 'i18next'

// Reusable password validation logic
const passwordValidation = (t: TFunction) => z
  .string()
  .min(6, { message: t('schema.validation.password.minLength') })
  .max(20, { message: t('schema.validation.password.maxLength') })
  .regex(/[A-Z]/, { message: t('schema.validation.password.uppercase') })
  .regex(/[a-z]/, { message: t('schema.validation.password.lowercase') })
  .regex(/[0-9]/, { message: t('schema.validation.password.number') })
  .regex(/[^A-Za-z0-9]/, { message: t('schema.validation.password.specialCharacter') });

// Schema for changing an existing password
export const passwordSchema = (t: TFunction) => z.object({
  currentPassword: z.string().min(1, { message: t('schema.validation.password.currentRequired') }),
  newPassword: passwordValidation(t),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t('schema.validation.password.match'),
  path: ["confirmPassword"]
});

// Schema for simple email validation
export const EmailSchema = (t: TFunction) => z.object({
  email: z.string().email({ message: t('schema.validation.email.invalid') }),
});

// Schema for updating a user's profile information
export const UpdateProfileSchema = (t: TFunction) =>
  z.object({
    firstName: z.string().min(1, { message: t('schema.validation.profile.firstNameRequired') }),
    lastName: z.string().min(1, { message: t('schema.validation.profile.lastNameRequired') }),
    username: z.string().min(3, { message: t('schema.validation.profile.usernameMinLength') }),
    phoneNumber: z.string().min(10, { message: t('schema.validation.profile.phoneMinLength') }),
    avatar: z.string().optional(),
  });

// Schema for Step 1 of the user creation modal
export const userStepOneSchema = (t: TFunction) => z.object({
  firstName: z.string().min(1, { message: t('schema.validation.user.firstNameRequired') }),
  lastName: z.string().min(1, { message: t('schema.validation.user.lastNameRequired') }),
  username: z.string().min(3, { message: t('schema.validation.user.usernameMinLength') }),
  email: z.string().email({ message: t('schema.validation.user.emailInvalid') }),
  phoneNumber: z.string().min(10, { message: t('schema.validation.user.phoneMinLength') }),
  roleId: z.number().min(1, { message: t('schema.validation.user.roleRequired') })
});

// Schema for Step 2 of the user creation modal (creating a new password)
export const userStepTwoSchema = (t: TFunction) => z.object({
  password: passwordValidation(t),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('schema.validation.password.match'),
  path: ["confirmPassword"]
});
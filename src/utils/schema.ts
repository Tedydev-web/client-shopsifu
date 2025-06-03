import { z } from "zod"

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
    .regex(/[a-zA-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái")
    .regex(/[!$@%]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!$@%)"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
})

export const EmailSchema = z.object({
  email: z.string().email({ message: "Email không đúng" }),
});


export type PasswordFormData = z.infer<typeof passwordSchema>

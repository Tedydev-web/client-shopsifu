import * as z from 'zod';

export const EmailSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' })
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Vui lòng nhập một địa chỉ email hợp lệ'
  }),
  name: z.string().min(1, {
    message: 'Vui lòng nhập họ và tên của bạn'
  }),
  phoneNumber: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 số' }),
  token: z.string(),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa' })
    .regex(/\d/, { message: 'Mật khẩu phải chứa ít nhất một số' }),
  confirmPassword: z.string().min(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Vui lòng nhập một địa chỉ email hợp lệ"
    }),
    password:
    z.string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa' })
    .regex(/\d/, { message: 'Mật khẩu phải chứa ít nhất một số' }),
    rememberMe: z.boolean()
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Vui lòng nhập một địa chỉ email hợp lệ"
    })
});

// Schema validation với Zod (OTP chỉ gồm 6 số)
export const otpSchema = z.object({
    otp: z.string().length(6, { message: 'OTP phải gồm 6 chữ số' }).regex(/^\d+$/, { message: 'Chỉ được nhập số' })
})

export const recoveryCodeSchema = z.object({
  otp: z.string()
      .length(11, { message: 'Mã khôi phục phải gồm 10 ký tự và 1 dấu gạch ngang' })
      .regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/, { 
          message: 'Mã khôi phục phải có dạng 5 ký tự (chữ hoa hoặc số) - 5 ký tự (chữ hoa hoặc số)' 
      })
      .transform(val => val.toUpperCase())
})
// Schema validation với Zod
export const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa' })
    .regex(/\d/, { message: 'Mật khẩu phải chứa ít nhất một số' }),
  confirmPassword: z.string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
});

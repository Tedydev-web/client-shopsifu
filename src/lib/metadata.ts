// lib/metadata.ts
export const metadataConfig = {
    '/buyer/sign-in': {
      title: 'Đăng nhập tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đăng nhập tài khoản để tiếp tục mua sắm cùng Shopsifu.',
    },
    '/buyer/sign-up': {
      title: 'Đăng ký tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Tạo tài khoản mới và bắt đầu mua sắm ngay.',
    },
    '/buyer/forgot-password': {
      title: 'Quên mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đặt lại mật khẩu một cách nhanh chóng.',
    },
    '/buyer/reset-password': {
      title: 'Đặt lại mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Nhập mật khẩu mới để khôi phục tài khoản của bạn.',
    },
    '/buyer/verify-code': {
      title: 'Xác minh mã OTP tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xác minh tài khoản của bạn bằng mã OTP.',
    },
  } satisfies Record<string, { title: string; description: string }>
  
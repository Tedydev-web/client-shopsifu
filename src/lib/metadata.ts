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
    '/seller/sign-in': {
      title: 'Đăng nhập tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đăng nhập tài khoản để tiếp tục mua sắm cùng Shopsifu.',
    },
    '/buyer/verify-2fa': {
      title: 'Xác minh mã OTP tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xác minh tài khoản của bạn bằng mã OTP.',
    },
    // --------------------------------SELLER------------------------------------ //
    '/seller/sign-up': {
      title: 'Đăng ký tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Tạo tài khoản mới và bắt đầu mua sắm ngay.',
    },
    '/seller/forgot-password': {
      title: 'Quên mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đặt lại mật khẩu một cách nhanh chóng.',
    },
    '/seller/reset-password': {
      title: 'Đặt lại mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Nhập mật khẩu mới để khôi phục tài khoản của bạn.',
    },
    '/seller/verify-code': {
      title: 'Xác minh mã OTP tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xác minh tài khoản của bạn bằng mã OTP.',
    },

    // --------------------------------ADMIN------------------------------------ //
    '/admin':{
      title:'Shopsifu - Kênh người bán',
      description:'Shopsifu - Tổng quan bán hàng'
    },
    '/admin/audit-logs':{
      title:'Shopsifu - Nhật ký hệ thống',
      description:'Shopsifu - Nhật ký hệ thống'
    },
    '/admin/languages':{
      title:'Shopsifu - Quản lý ngôn ngữ',
      description:'Shopsifu - Quản lý ngôn ngữ'
    },
    '/admin/roles':{
      title:'Shopsifu - Quản lý vai trò',
      description:'Shopsifu - Quản lý vai trò'
    },
    '/admin/permissions':{
      title:'Shopsifu - Quản lý quyền hạn',
      description:'Shopsifu - Quản lý quyền hạn'
    },
    '/admin/users':{
      title:'Shopsifu - Quản lý người dùng',
      description:'Shopsifu - Quản lý người dùng'
    }
  } satisfies Record<string, { title: string; description: string }>
  
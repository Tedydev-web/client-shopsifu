// utils/error.ts

export const ERROR_MESSAGES: Record<string, string> = {
    'Error.InvalidOTP': 'Mã OTP không chính xác',
    'Error.InvalidTOTP': 'Mã TOTP không chính xác',
    'Error.OTPExpired': 'Mã OTP đã hết hạn',
    'Error.InvalidCredentials': 'Email hoặc mật khẩu không đúng',
    'Error.EmailNotFound': 'Email này chưa được đăng ký trong hệ thống',
    'Error.EmailInvalid': 'Email không hợp lệ, vui lòng kiểm tra lại',
    'Error.TooManyRequests': 'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau ít phút',
    'Error.ServerError': 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
    'Error.UserExists': 'Người dùng đã tồn tại',
    'Error.UserNotFound': 'Không tìm thấy người dùng',
    'Error.InvalidToken': 'Token không hợp lệ hoặc đã hết hạn',
    'Error.InvalidPassword': 'Mật khẩu không hợp lệ',
    'Error.TOTPAlreadyEnabled': 'Tài khoản của bạn đã được bật xác thực 2 bước',
    // ➕ thêm các mã khác tùy theo backend
  }
  
  export function parseApiError(error: any): string {
    const fallback = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    const errMsg = error?.response?.data?.message || error?.message
  
    if (Array.isArray(errMsg)) {
      const code = errMsg[0]?.message
      return ERROR_MESSAGES[code] || code || fallback
    } else if (typeof errMsg === 'string') {
      return ERROR_MESSAGES[errMsg] || errMsg
    }
  
    return fallback
  }
  
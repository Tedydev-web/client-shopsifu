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
    'Error.EmailAlreadyExists': 'Email đã tồn tại',
    'Error.LanguageNotFound': 'Ngôn ngữ không tồn tại',
    'Error.LanguageCodeExists': 'Mã ngôn ngữ đã tồn tại',
    'Error.LanguageCodeInvalid': 'Mã ngôn ngữ không hợp lệ',
    'Error.LanguageNameExists': 'Tên ngôn ngữ đã tồn tại',
    'Error.LanguageNameInvalid': 'Tên ngôn ngữ không hợp lệ',
    'Error.Auth.Email.NotFound': 'Email này chưa được đăng ký trong hệ thống',
    // ➕ thêm các mã khác tùy theo backend
  }
  
  export function parseApiError(error: any): string {
    const fallback = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    
    // Kiểm tra nếu error có format mới
    if (error?.response?.data?.errors) {
      const errors = error.response.data.errors
      if (Array.isArray(errors) && errors.length > 0) {
        // Lấy error đầu tiên
        const firstError = errors[0]
        const errorCode = firstError.description
        
        // Trả về message tương ứng hoặc description gốc
        return ERROR_MESSAGES[errorCode] || firstError.description || fallback
      }
    }

    // Fallback về cách xử lý cũ nếu không phải format mới
    const errMsg = error?.response?.data?.message || error?.message

    if (Array.isArray(errMsg)) {
      const code = errMsg[0]?.message
      return ERROR_MESSAGES[code] || code || fallback
    } else if (typeof errMsg === 'string') {
      return ERROR_MESSAGES[errMsg] || errMsg
    }

    return fallback
  }
  
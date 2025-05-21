// import i18nextInstance from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import en from './messages/en.json';
// import vi from './messages/vi.json';

// // Khai báo tài nguyên ngôn ngữ: liên kết mã ngôn ngữ (en, vi) với các tệp JSON chứa bản dịch tương ứng.
// // 'translation' là namespace mặc định mà i18next sử dụng để tìm các chuỗi dịch.
// const resources = {
//   en: { 
//     translation: en,
//     admin: en.admin,
//   }, // Bản dịch tiếng Anh
//   vi: { 
//     translation: vi,
//     admin: vi.admin,
//   }, // Bản dịch tiếng Việt
// };

// // Khối code này sẽ tự động khởi tạo i18nextInstance ngay khi module này được import lần đầu tiên.
// // Điều này đảm bảo rằng i18next luôn sẵn sàng để sử dụng ở bất kỳ đâu trong ứng dụng mà không cần gọi hàm init thủ công.
// if (!i18nextInstance.isInitialized) {
//   i18nextInstance
//     .use(initReactI18next) // Tích hợp i18next với React, cho phép sử dụng hooks như useTranslation và các component như Trans.
//     .init({
//       resources, // Cung cấp các tài nguyên ngôn ngữ đã định nghĩa ở trên.
//       lng: 'vi', // Ngôn ngữ mặc định khi khởi tạo. Sau đó, useEffect trong useChangeLang sẽ đồng bộ với Redux.
//       fallbackLng: 'vi', // Ngôn ngữ dự phòng sẽ được sử dụng nếu một key dịch không tồn tại trong ngôn ngữ hiện tại.
//       debug: true, // Bật chế độ debug. Nên tắt ở môi trường production để tránh log không cần thiết ra console.
//       interpolation: {
//         escapeValue: false, // Tắt tính năng escape của i18next. React đã tự xử lý việc chống XSS.
//       },
//     });
// }

// // Xuất ra instance của i18next đã được khởi tạo để có thể sử dụng trong toàn bộ ứng dụng.
// export default i18nextInstance;

// // Hàm initI18n này vẫn được giữ lại cho trường hợp cần khởi tạo lại i18next một cách tường minh với một ngôn ngữ cụ thể.
// // Ví dụ: có thể cần thiết trong các kịch bản nâng cao hoặc khi muốn thay đổi cấu hình động sau khi đã khởi tạo ban đầu.
// export const initI18n = (language: 'vi' | 'en') => {
//   // Kiểm tra xem i18next đã được khởi tạo chưa hoặc ngôn ngữ hiện tại có khác với ngôn ngữ muốn khởi tạo không.
//   if (!i18nextInstance.isInitialized || i18nextInstance.language !== language) {
//     i18nextInstance
//       .use(initReactI18next) // Đảm bảo tích hợp React được sử dụng khi khởi tạo lại.
//       .init({
//         resources,
//         lng: language, // Sử dụng ngôn ngữ được truyền vào.
//         fallbackLng: 'vi',
//         debug: true,
//         interpolation: {
//           escapeValue: false,
//         },
//       }, (err, t) => { // Callback function sau khi init hoàn tất hoặc nếu có lỗi.
//         if (err) return console.error('Lỗi khi khởi tạo lại i18n:', err);
//         // console.log('i18n đã được khởi tạo lại với ngôn ngữ:', language);
//       });
//   }
// };

import i18nextInstance from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './messages/en.json';
import vi from './messages/vi.json';

// Khai báo tài nguyên ngôn ngữ: tách namespace admin
const resources = {
  en: {
    translation: en, // Namespace mặc định
    admin: en.admin, // Namespace admin
  },
  vi: {
    translation: vi, // Namespace mặc định
    admin: vi.admin, // Namespace admin
  },
};

// Khởi tạo i18nextInstance
if (!i18nextInstance.isInitialized) {
  i18nextInstance
    .use(initReactI18next)
    .init({
      resources,
      lng: 'vi',
      fallbackLng: 'vi',
      debug: true,
      ns: ['translation', 'admin'], // Khai báo các namespace
      defaultNS: 'translation', // Namespace mặc định
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18nextInstance;

// Hàm initI18n
export const initI18n = (language: 'vi' | 'en') => {
  if (!i18nextInstance.isInitialized || i18nextInstance.language !== language) {
    i18nextInstance
      .use(initReactI18next)
      .init({
        resources,
        lng: language,
        fallbackLng: 'vi',
        debug: true,
        ns: ['translation', 'admin'],
        defaultNS: 'translation',
        interpolation: {
          escapeValue: false,
        },
      }, (err, t) => {
        if (err) return console.error('Lỗi khi khởi tạo lại i18n:', err);
      });
  }
};
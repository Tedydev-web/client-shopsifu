// import i18nextInstance from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import en from './messages/en.json';
// import vi from './messages/vi.json';

// // Khai báo tài nguyên ngôn ngữ: tách namespace admin
// const resources = {
//   en: {
//     translation: en, // Namespace mặc định
//     admin: en.admin, // Namespace admin
//   },
//   vi: {
//     translation: vi, // Namespace mặc định
//     admin: vi.admin, // Namespace admin
//   },
// };

// // Khởi tạo i18nextInstance
// if (!i18nextInstance.isInitialized) {
//   i18nextInstance
//     .use(initReactI18next)
//     .init({
//       resources,
//       lng: 'vi',
//       fallbackLng: 'vi',
//       debug: true,
//       ns: ['translation', 'admin'], // Khai báo các namespace
//       defaultNS: 'translation', // Namespace mặc định
//       interpolation: {
//         escapeValue: false,
//       },
//     });
// }

// export default i18nextInstance;

// // Hàm initI18n
// export const initI18n = (language: 'vi' | 'en') => {
//   if (!i18nextInstance.isInitialized || i18nextInstance.language !== language) {
//     i18nextInstance
//       .use(initReactI18next)
//       .init({
//         resources,
//         lng: language,
//         fallbackLng: 'vi',
//         debug: true,
//         ns: ['translation', 'admin'],
//         defaultNS: 'translation',
//         interpolation: {
//           escapeValue: false,
//         },
//       }, (err, t) => {
//         if (err) return console.error('Lỗi khi khởi tạo lại i18n:', err);
//       });
//   }
// };

export const locales = ["vi", "en"] as const;
export const defaultLocale = "vi";

export type Locale = (typeof locales)[number];

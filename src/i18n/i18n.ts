import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './messages/en.json';
import vi from './messages/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

export const initI18n = (language: 'vi' | 'en') => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'vi',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });
};

export default i18n;

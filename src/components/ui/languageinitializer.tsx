'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { initI18n } from '@/i18n/i18n';

const LanguageInitializer = () => {
  const lang = useSelector((state: RootState) => state.lang.language);

  useEffect(() => {
    // Kiểm tra lang có hợp lệ không trước khi khởi tạo i18n
    if (lang) {
      initI18n(lang);
    }
  }, [lang]);

  return null; // Component này không cần hiển thị gì cả
};

export default LanguageInitializer;

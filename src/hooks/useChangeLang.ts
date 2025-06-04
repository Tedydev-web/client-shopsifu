"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setLanguage } from "@/store/features/lang/langSlice";
import i18n from "@/i18n/i18n";

export const useChangeLang = () => {
  const dispatch = useDispatch();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languageRedux = useSelector((state: RootState) => state.langShopsifu.language);
  const currentLangName = languageRedux === "vi" ? "Tiếng Việt" : "English";

  const toggleMenu = () => setShowLangMenu(prev => !prev);

  const changeLanguage = (lang: "vi" | "en") => {
    dispatch(setLanguage(lang));
    window.location.reload();
  };

  useEffect(() => {
    if (i18n && i18n.isInitialized && i18n.language !== languageRedux) {
      i18n.changeLanguage(languageRedux);
    }
  }, [languageRedux]);

  return {
    showLangMenu,
    toggleMenu,
    changeLanguage,
    currentLangName,
    currentSelectedLang: languageRedux,
  };
};

export default useChangeLang;
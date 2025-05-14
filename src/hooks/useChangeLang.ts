"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setLanguage } from "@/store/features/lang/langSlice";

export const useChangeLang = () => {
  const dispatch = useDispatch();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const language = useSelector((state: RootState) => state.lang.language);
  const currentLangName = language === "vi" ? "Tiếng Việt" : "English";

  const toggleMenu = () => setShowLangMenu(prev => !prev);

  const changeLanguage = (lang: "vi" | "en") => {
    dispatch(setLanguage(lang)); // Cập nhật Redux

    // Ghi cookie (có hiệu lực trong 1 năm)
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;

    setShowLangMenu(false);
  };

  return {
    showLangMenu,
    toggleMenu,
    changeLanguage,
    currentLangName,
  };
};

export default useChangeLang;
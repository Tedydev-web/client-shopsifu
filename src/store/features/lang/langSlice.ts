import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '@/i18n/i18n'; // để đồng bộ thay đổi với i18n

export interface LanguageState {
  language: 'vi' | 'en';
}

const initialState: LanguageState = {
  language: 'vi', // mặc định là tiếng Việt
};

const langSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'vi' | 'en'>) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload); // cập nhật i18n luôn
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authReducer from './features/auth/authSlide';
import langReducer from './features/lang/langSlice';
import profileReducer from './features/auth/profileSlide';

// Mã hoá dữ liệu khi lưu Redux persist
const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || '',
  onError: (err) => console.error('Encrypt error:', err),
});

// // Mã hoá dữ liệu khi lưu Redux persist (chỉ khi có secretKey)
// const encryptor = secretKey
//   ? encryptTransform({
//       secretKey,
//       onError: (err) => console.error('Encrypt error:', err),
//     })
//   : undefined;


// Kết hợp reducer
const rootReducer = combineReducers({
  authShopsifu: authReducer,
  langShopsifu: langReducer,
  profile: profileReducer,
});

// Config Redux persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authShopsifu', 'langShopsifu', 'profile'], // Chỉ lưu auth, lang và profile
  transforms: [encryptor],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

// Singleton (xài cho Provider & lib dùng chung)
let storeInstance: ReturnType<typeof makeStore> | null = null;

export const getStore = () => {
  if (!storeInstance) {
    storeInstance = makeStore();
  }
  return storeInstance;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['store']['dispatch'];
export type RootState = ReturnType<AppStore['store']['getState']>;
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authReducer from './features/auth/authSlide';

// ✅ Kiểm tra key môi trường
const secretKey = process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY;
if (!secretKey) {
  throw new Error('Missing NEXT_PUBLIC_REDUX_ENCRYPTION_KEY in .env file');
}

// 🔐 Cấu hình mã hóa
const encryptor = encryptTransform({
  secretKey,
  onError: (err) => console.error('Encrypt error:', err),
});

// 🔁 Kết hợp reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// ✅ Cấu hình Redux persist (với kiểu rõ ràng)
const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  transforms: [encryptor],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

// 🏭 Tạo store
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

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authReducer from './features/auth/authSlide';

// Mã hoá dữ liệu khi lưu Redux persist
const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || '',
  onError: (err) => console.error('Encrypt error:', err),
});

// Kết hợp reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// Config Redux persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Chỉ lưu auth
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

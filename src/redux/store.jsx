import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga } from './rootReducer';
import {persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user'
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true
    }),
    sagaMiddleware
  ],
  devTools: true
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;

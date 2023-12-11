import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga } from './rootReducer';
import {persistStore} from "redux-persist";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
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
  
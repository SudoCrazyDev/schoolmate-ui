import {all} from "redux-saga/effects";
import {combineReducers} from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

import * as user from "./slices/UserSlice";

export const rootReducer = combineReducers({
    user: user.reducer
});

export function* rootSaga(){
    yield all([user.saga()]);
}
import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as user from "./slices/UserSlice";
import * as org from './slices/OrgSlice';

export const rootReducer = combineReducers({
    user: user.reducer,
    org: org.reducer
});

export function* rootSaga(){
    yield all([user.saga(), org.saga()]);
}
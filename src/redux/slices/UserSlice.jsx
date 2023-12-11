import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { put, takeLatest } from "redux-saga/effects";
import Axios from 'axios';

export const actionTypes = {
    SET_TOKEN: "SET TOKEN",
};

const initialState = {
    user: null,
    token: null,
};

const persistConfig = {
    storage,
    key: 'v1-gscnssat'
};

export const reducer = persistReducer(persistConfig, (state = initialState, action) => {
    
    switch (action.type) {
        case actionTypes.SET_TOKEN:
            return {...initialState, token: action.payload};
        default:
            return initialState;
    }
});

export const actions = {
    SET_TOKEN: (token) => ({type: actionTypes.SET_TOKEN, payload: token})
};

export function* saga(){
    yield takeLatest(actionTypes.SET_TOKEN, function* setTokenSaga(payload){
        if(payload.payload !== null){
            Axios.defaults.headers.common['Authorization'] = 'Bearer ' + payload.payload;
        }
    });
}
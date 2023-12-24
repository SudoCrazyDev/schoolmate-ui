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
    key: 'v1-user-gscnssat',
    whitelist: ['token']
};

export const reducer = persistReducer(persistConfig, (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TOKEN:
            return {...state, token: action.payload};
        default:
            return state;
    }
});

export const actions = {
    SET_TOKEN: (token) => ({type: actionTypes.SET_TOKEN, payload: token})
};

function* handleFetchUser(){
    const {token} = yield select(state => state.user);
    if(token){
        try {
            const response = yield call(() => Axios.get('teachers', {
                headers: {Authorization: `Bearer ${token}`}
            }));
            yield put(actions.SET_TEACHERS(response.data));
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }
};
export function* saga(){
    
}
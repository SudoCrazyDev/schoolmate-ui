import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { put, select, takeLatest } from "redux-saga/effects";
import Axios from 'axios';
import * as user from "../slices/UserSlice";
import {all, call} from "redux-saga/effects";
import { useSelector } from "react-redux"

export const actionTypes = {
    SET_TEACHERS: "SET TEACHERS",
    GET_TEACHERS: "GET TEACHERS"
};

const initialState = {
    teachers: [],
};

const persistConfig = {
    storage,
    key: 'v1-org-gscnssat'
};

export const reducer = persistReducer(persistConfig, (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TEACHERS:
            return {...state, teachers: action.payload};
        default:
            return state;
    }
});

export const actions = {
    SET_TEACHERS: (teachers) => ({type: actionTypes.SET_TEACHERS, payload: teachers}),
};


function* handleTokenChange(){
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

function* watchTokenChange(){
    yield takeLatest(user.actionTypes.SET_TOKEN, handleTokenChange)
};

export function* saga(){
    yield all([watchTokenChange()]);
}
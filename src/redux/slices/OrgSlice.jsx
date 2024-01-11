import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { put, select, takeLatest } from "redux-saga/effects";
import Axios from 'axios';
import * as user from "../slices/UserSlice";
import {all, call} from "redux-saga/effects";

export const actionTypes = {
    SET_TEACHERS: "SET TEACHERS",
    SET_GRADELEVELS: "SET GRADELEVELS",
    LOGOUT: 'LOGOUT'
};

const initialState = {
    teachers: [],
    gradeLevels: [],
};

const persistConfig = {
    storage,
    key: 'v1-org-gscnssat'
};

export const reducer = persistReducer(persistConfig, (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TEACHERS:
            return {...state, teachers: action.payload};
        case actionTypes.SET_GRADELEVELS:
            return {...state, gradeLevels: action.payload};
        case actionTypes.LOGOUT:
            return state = initialState;
        default:
            return state;
    }
});

export const actions = {
    SET_TEACHERS: (teachers) => ({type: actionTypes.SET_TEACHERS, payload: teachers}),
    SET_GRADELEVELS: (gradeLevels) => ({type: actionTypes.SET_GRADELEVELS, payload: gradeLevels}),
    SET_LOGOUT: () => ({type: actionTypes.LOGOUT}),
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

function* handleFetchGradeLevels(){
    const {token} = yield select(state => state.user);
    if(token){
        try {
            const response = yield call(() => Axios.get('sections', {
                headers: {Authorization: `Bearer ${token}`}
            }));
            yield put(actions.SET_GRADELEVELS(response.data));
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }
}

function* watchTokenChange(){
    yield takeLatest(user.actionTypes.SET_TOKEN, handleTokenChange);
    yield takeLatest(user.actionTypes.SET_TOKEN, handleFetchGradeLevels)
};

export function* saga(){
    yield all([watchTokenChange()]);
}
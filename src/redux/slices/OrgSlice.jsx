import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { put, select, takeLatest } from "redux-saga/effects";
import Axios from 'axios';
import * as user from "../slices/UserSlice";
import {all, call} from "redux-saga/effects";

export const actionTypes = {
    SET_TEACHERS: "SET TEACHERS",
    SET_GRADELEVELS: "SET GRADELEVELS",
    SET_CURRICULUM_HEADS: "SET CURRICULUM_HEADS",
    SET_SUBSCRIPTION: "SET SUBSCRIPTION",
    LOGOUT: 'LOGOUT'
};

const initialState = {
    teachers: [],
    curriculumHeads: [],
    gradeLevels: [],
    subscription: null,
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
        case actionTypes.SET_CURRICULUM_HEADS:
            return {...state, curriculumHeads: action.payload};
        case actionTypes.SET_SUBSCRIPTION:
            return {...state, subscription: action.payload};
        case actionTypes.LOGOUT:
            return state = initialState;
        default:
            return state;
    }
});

export const actions = {
    SET_TEACHERS: (teachers) => ({type: actionTypes.SET_TEACHERS, payload: teachers}),
    SET_GRADELEVELS: (gradeLevels) => ({type: actionTypes.SET_GRADELEVELS, payload: gradeLevels}),
    SET_CURRICULUM_HEADS: (curriculumHeads) => ({type: actionTypes.SET_CURRICULUM_HEADS, payload: curriculumHeads}),
    SET_SUBSCRIPTION: (subscription) => ({type: actionTypes.SET_SUBSCRIPTION, payload: subscription}),
    SET_LOGOUT: () => ({type: actionTypes.LOGOUT}),
};


function* handleTokenChange(){
    const {token, user} = yield select(state => state.user);
    if(user.roles.includes('subject-teacher'))return ;
    if(token){
        try {
            // const response = yield call(() => Axios.get('teachers', {
            //     headers: {Authorization: `Bearer ${token}`}
            // }));
            // const currResponse = yield call(() => Axios.get('curricuum-head', {
            //     headers: {Authorization: `Bearer ${token}`}
            // }));
            // yield put(actions.SET_TEACHERS(response.data));
            // yield put(actions.SET_CURRICULUM_HEADS(currResponse.data));
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }
};

function* handleFetchGradeLevels(){
    const {token, user} = yield select(state => state.user);
    if(user.roles.includes('subject-teacher'))return ;
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

function* handleFetchSubscription(){
   const {user} = yield select(state => state.user);
};

function* watchTokenChange(){
    // yield takeLatest(user.actionTypes.SET_USER, handleTokenChange);
    // yield takeLatest(user.actionTypes.SET_USER, handleFetchGradeLevels)
};

export function* saga(){
    yield all([watchTokenChange()]);
}
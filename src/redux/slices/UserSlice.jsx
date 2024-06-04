import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { put, takeLatest, select } from "redux-saga/effects";
import Axios from 'axios';
import {all, call} from "redux-saga/effects";
import pb from '../../global/pb';

export const actionTypes = {
    SET_TOKEN: "SET TOKEN",
    SET_ROLES: "SET ROLES",
    SET_USER: "SET USER",
    SET_INSTITUTIONS: "SET INSTITUTIONS",
    LOGOUT: 'LOGOUT'
};

const initialState = {
    info: null,
    token: null,
    institutions: [],
    roles: [],
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
        case actionTypes.SET_USER:
            return {...state, info: action.payload};
        case actionTypes.SET_ROLES:
            return {...state, roles: action.payload};
        case actionTypes.SET_INSTITUTIONS:
            return {...state, institutions: action.payload};
        case actionTypes.LOGOUT:
            return state = initialState;
        default:
            return state;
    }
});

export const actions = {
    SET_TOKEN: (token) => ({type: actionTypes.SET_TOKEN, payload: token}),
    SET_ROLES: (roles) => ({type: actionTypes.SET_ROLES, payload: roles}),
    SET_INSTITUTIONS: (institutions) => ({type: actionTypes.SET_INSTITUTIONS, payload: institutions}),
    SET_USER: (user) => ({type: actionTypes.SET_USER, payload: user}),
    SET_LOGOUT: () => ({type: actionTypes.LOGOUT})
};

function* handleFetchUserInfo(){
    const {token} = yield select(state => state.user);
    if(token){
        try {
            let user_institutions = yield call(() => pb.collection('user_institutions').getFullList({expand: "institutions"}));
            let user_roles = yield call(() => pb.collection('user_roles').getFullList({expand: "roles"}));
            yield put(actions.SET_INSTITUTIONS(user_institutions[0].expand.institutions));
            yield put(actions.SET_ROLES(user_roles[0].expand.roles));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
};

function* watchTokenChange(){
    yield takeLatest(actionTypes.SET_TOKEN, handleFetchUserInfo);
};

export function* saga(){
    yield all([watchTokenChange()]);
}
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { put, takeLatest, select } from "redux-saga/effects";
import Axios from 'axios';
import {all, call} from "redux-saga/effects";

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
    institutions: null,
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

function* handleFetchUser(){
    const {token} = yield select(state => state.user);
    if(token){
        try {
            let response = yield call(() => Axios.get('user', {
                headers: {Authorization: `Bearer ${token}`}
            }));
            yield put(actions.SET_INSTITUTIONS(response.data.institutions));
            delete response.data['institutions'];
            yield put(actions.SET_ROLES(response.data.roles));
            delete response.data['roles'];
            yield put(actions.SET_USER(response.data));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
};

function* watchTokenChange(){
    yield takeLatest(actionTypes.SET_TOKEN, handleFetchUser);
};

export function* saga(){
    yield all([watchTokenChange()]);
}
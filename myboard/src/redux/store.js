import { configureStore } from '@reduxjs/toolkit'; // 앞으로 createStore 대신 configureStore
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist'
import { print1, print2, print3 } from './middleware/middleware';
/**
 * 모든 리듀서를 import 해서 여기에 주입
 * npm 패키지 설치시 잘 안될 때 다음 과정을 수행
 * 1) rm -rf node_modules
 * 2) npm config set legacy-peer-deps true
 * 3) npm install
**/
import rootReducer from './reducers/root';

const persistConfig = {
    key : 'root', // localStorage key
    storage,      // localStorage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancer = composeWithDevTools(
    // Add whatever middleware you actually want to use here
    // applyMiddleware(print1, print2, print3),
    applyMiddleware(thunk)
    // other store enhancers if any
);

// 기존에 사용하던 createStore
// export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk))); // 기존 store 내보내기
// const store = createStore(persistedReducer, undefined, composedEnhancer);
const store = configureStore({
    reducer : persistedReducer,
    // middleware : [composedEnhancer], // [print1, print2, print3],
    devTools : true,
});
export default store;

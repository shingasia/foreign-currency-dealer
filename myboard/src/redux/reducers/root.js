import { combineReducers } from "@reduxjs/toolkit";
// import {memberReducer} from './member';
import communityReducer from './communityReducer';
import memberReducer from './memberReducer';


const rootReducer = combineReducers({
    // selling 안에 현재는 replys만 있지만 다른 것도 추가 예정
    selling: communityReducer,    // state.selling.replys 구조
    member: memberReducer,
});

export default rootReducer;
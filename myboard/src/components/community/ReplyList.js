import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ReplyNode1 from './ReplyNode1';
import { resetReplys, resetReplysBySellId } from '../../redux/reducers/communityReducer';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ReplyList = (props) => {
    const dispatch = useDispatch();
    const replys = useSelector(state => state.selling.replys, shallowEqual);
    
    // 1. Reactive values include props and all variables and functions declared directly inside of your component.
    // 반응형 값에는 props와 컴포넌트 내부에서 직접 선언된 모든 변수, 함수가 포함됩니다.
    // 2. An Effect with empty dependencies doesn’t re-run when any of your component’s props or state change.
    // 빈 의존성이 있는 Effect는 컴포넌트의 props나 state가 변경되어도 다시 실행되지 않습니다.
    useEffect(() => {
        // dispatch(resetReplys);
        dispatch(resetReplysBySellId(props.sell_id)); // plain action object 대신 thunk 함수를 dispatch
    },[]); // 초기 렌더링시 state 가져오기
    
    return (
        <>
            {replys.map((e, idx) => <ReplyNode1 idx={idx} openclose={"＞"} {...e}/>)}
            {/* <ReplyNode1 checked={false} openclose={"＞"}/>
            <ReplyNode1 checked={false} openclose={"＞"}/>
            <ReplyNode1 checked={false} openclose={"＞"}/>
            <ReplyNode1 checked={false} openclose={"＞"}/> */}
        </>
    );
};

export default ReplyList;

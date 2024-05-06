import { useState, useEffect } from "react";
import { deleteReplyByOneCode } from '../../redux/reducers/communityReducer';
import "./ReplyNode2.css";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import NewReply from './NewReply';
import ReplyNode3 from './ReplyNode3';

// props로 받을 것들 checked, openclose
// ReplyNode1 부터 ReplyNode5 까지 모두 props로 받게 만든 후 ReplyList에서 props로 일괄 그리기
const ReplyNode2 = (props) => {
    const { sell_id, reply_code, up_reply_code, level } = props; // 나머지 props
    // content는 로컬 state, down_replys는 글로벌 state로 변경
    // const [checked, setChecked] = useState(props.checked);
    const [openclose, setOpenclose] = useState(props.openclose); // 열고닫기
    const [content, setContent] = useState(props.content);
    const [newReply, setNewReply] = useState(false);
    const dispatch = useDispatch();
    const replys_of_same_parent = useSelector(state => state.selling.replys[props.LV1_IDX].down_replys);

    // state LV2 댓글중에 지금 현재 컴포넌트에 해당하는 댓글 찾는 'selector 함수'
    const selectReplyByCode = (state, rCode) => {
        // return state.selling.replys.find((e) => e.reply_code === rCode);
        return state.selling.replys[props.LV1_IDX].down_replys.find((e) => e.reply_code === rCode);
    };
    const replyObj = useSelector(state => selectReplyByCode(state, reply_code), shallowEqual);

    const clickHandler = (e) => {
        if(e.target.name === "reply_chk") {
            // setChecked((prevState) => {
            //     return !prevState;
            // });
            dispatch({
                type: "REPLY/RECURSIVELY_CHECK_UNCHECK_LV2",
                payload: {
                    LV1_IDX : props.LV1_IDX,
                    LV2_IDX : props.idx,
                    checked : !replyObj.checked,
                }
            });
        }else if(e.target.name === "reply_open_close") {
            setOpenclose(e.target.value === "＞" ? "∨" : "＞");
        }else if(e.target.name === "reply_add") { // 새 자식 답글 추가
            setNewReply(true);
        }else if(e.target.name === "reply_del") {
            if(replyObj.checked === false) {
                alert("삭제할 댓글을 선택하세요.");
                return;
            }
            console.log(replyObj.sell_id, replyObj.reply_code, replyObj.level, props.LV1_IDX, props.idx);
            if(window.confirm("선택하신 댓글을 포함해 하위 댓글이 모두 삭제됩니다.\n삭제하시겠습니까?")){
                dispatch(deleteReplyByOneCode(replyObj.sell_id, replyObj.reply_code, replyObj.level, props.LV1_IDX, props.idx, undefined, undefined));
            }
        }
    };
    const changeHandler = (e) => {
        if(e.target.name === "txt_reply_content") {
            setContent(e.target.value);
        }
    };
    const newReplyHandler = openClose => {
        setNewReply(openClose);
    };

    // useEffect(() => {
    //     // console.log(Object.entries(props));
    // },[replys_of_same_parent]);

    return (
        <>
            <div className="div_replynode_LV2">
                <input type="hidden" name="reply_code" id="reply_code" value={reply_code} />
                <input type="hidden" name="up_reply_code" value={up_reply_code} />
                <input type="hidden" name="reply_level" value={level} />
                <input type="checkbox" name="reply_chk" className="reply_chk_LV2" checked={replyObj.checked} value="1" onClick={clickHandler}/>
                <input type="button" name="reply_open_close" className="reply_open_close_LV2" value={openclose} onClick={clickHandler}/>
                <textarea name="txt_reply_content" placeholder="여기에 입력하세요." className="reply_content_LV2" value={content} onChange={changeHandler}></textarea>
                <input type="button" name="reply_add" className="reply_add_LV2" value="답글 추가" onClick={clickHandler} />
                <input type="button" name="reply_del" className="reply_del_LV2" value="삭제" onClick={clickHandler} />
                <input type="button" name="reply_mod" className="reply_mod_LV2" value="수정" />
                <br/>
            </div>
            {openclose === "∨" ?
                // replyObj.down_replys.map(e => <p>{e.content}</p>)
                replyObj.down_replys.map(
                    (e, idx) => <ReplyNode3 key={e.reply_code} LV1_IDX={props.LV1_IDX} LV2_IDX={props.idx} idx={idx} openclose={"＞"} {...e}/>
                )
                : null}
            {newReply ?
                <NewReply
                    sell_id={sell_id}
                    up_reply_code={reply_code} // 현재 댓글의 자식으로 등록
                    level={level + 1}
                    onSetNewReply={newReplyHandler} />
                : null}
        </>
    )
};

export default ReplyNode2;
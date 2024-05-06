import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveNewReply } from '../../redux/reducers/communityReducer';
import './NewReply.css';

const NewReply = (props) => {

    const [replyContent, setReplyContent] = useState("");
    const dispatch = useDispatch();

    
    const clickHandler = (identifier, value) => { // value값을 문자열로 받아옴
        // console.log(`value => ${value}, typeof => ${typeof(value)}`);
        if(identifier === 'cancel') {
            props.onSetNewReply((value === 'false' ? false : true)); // props.onSetNewReply(false);
        }else if(identifier === 'confirm') {
            dispatch(saveNewReply(props.sell_id, props.up_reply_code, props.level, replyContent));
        }
    };
    const changeHandler = (e) => {
        setReplyContent(e.target.value);
    }
    return (
        <>
            <div className="div_newreply">
                <textarea
                    className={"txt_newreply_contentLV"+props.level}
                    value={replyContent}
                    placeholder={"새 댓글을 입력하세요."}
                    onChange={changeHandler}></textarea>
                <button onClick={(event) => {clickHandler('confirm', event.target.value)}} value={'confirm'}>확인</button>
                <button onClick={(event) => {clickHandler('cancel', event.target.value)}} value={false}>취소</button>
            </div>
        </>
    );
};
export default NewReply;
import {useState} from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MemberLoginInput = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userInput, setUserInput] = useState({
        id : "",
        passwd : "",
    });

    const clickHandler = (identifier, event) => {
        event.preventDefault(); // 이게 없으면 submit 이벤트도 같이 발생한다.
        alert(identifier);
    };
    
    const changeHandler = (identifier, event) => {
        if(identifier === 'id') {
            setUserInput({
                ...userInput,
                id : event.target.value,
            });
        }else if(identifier === 'passwd') {
            setUserInput({
                ...userInput,
                passwd : event.target.value,
            });
        }
    };
    const submitHandler = (identifier, event) => {
        event.preventDefault();
        if(identifier === 'loginBtn') {
            (async () => {
                const result = await axios({
                    method : "post",
                    url : "http://localhost:8080/MyWeb1/member/login/MemberLoginService.jsp",
                    data : JSON.stringify(userInput),
                });
                if('SEQ' in result.data){
                    dispatch({type: "MEMBER/LOGIN_SUCCESS", payload: {
                        "SEQ" : result.data.SEQ,
                        "ID" : result.data.ID,
                        "NAME" : result.data.NAME,
                    }});
                    alert(`${result.data.NAME} 님 안녕하세요.`);
                    // 강제로 URL을 변경하여 이동하거나 또는 location.replace("/hi") 사용시 전체 창을 다시 로드하고 Redux 스토어가 리셋된다.
                    navigate("/"); // Home으로 이동
                }else{
                    alert(result.data.ErrMsg);
                }
                
            })();
        }
    };
    const resetHandler = (e) => {
        e.preventDefault();
        setUserInput({
            id : '',
            passwd : '',
        });
    };
    return (
        <>
            <form onSubmit={e => submitHandler('loginBtn', e)} onReset={resetHandler}>
                <div class="loginDiv_id">
                    <input type="text" id="input_id" name="login_id" placeholder="아이디" maxlegnth="30" onChange={e => changeHandler('id', e)} value={userInput.id}/>
                </div>
                <div class="loginDiv_passwd">
                    <input type="password" id="input_passwd" name="login_passwd" placeholder="비밀번호" maxlegnth="50" onChange={e => changeHandler('passwd', e)} value={userInput.passwd}/>
                </div>
                <div class="loginBtn">
                    <input type="submit" value="확인" />
                </div>
                <div class="find_wrap">
                    <button onClick={e => clickHandler('search_passwd', e)}>비밀번호 찾기</button>
                    <button onClick={e => clickHandler('search_id', e)}>아이디 찾기</button>
                    <button onClick={e => clickHandler('join', e)}>회원가입</button>
                </div>
            </form>
        </>
    )
};
export default MemberLoginInput;
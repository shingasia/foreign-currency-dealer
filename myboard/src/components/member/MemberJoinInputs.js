import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const MemberJoinInputs = () => {

    const dispatch = useDispatch();

    const [inputData, setInputData] = useState({
        id : '',
        passwd : '',
        email : '',
        name : '',
        birthday : '',
        zipcode : '',
        roadAddress : '',
        jibunAddress : '',
        detailAddress : '',
        extraAddress : '',
        phone : '',
        memo : '',
    });
    // 이메일 또는 OTP 인증상태
    const [emailCert, setEmailCert] = useState({
        email : '',
        verificationCode : '',
        transmit : false,
        certificated : false,
    });
    const changeHandler1 = (e) => {
        setInputData({
            ...inputData,
            [e.target.name.substring(5)] : e.target.value,
        });
    };
    const changeHandler2 = (e) => {
        if(e.target.name === "txt_verification_code"){
            setEmailCert({
                ...emailCert,
                verificationCode : e.target.value,
            });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        // 인증상태 확인
        if(!emailCert.certificated) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }
        if(emailCert.certificated && (emailCert.email !== inputData.email)){
            alert("인증받은 이메일과 입력하신 이메일이 일치하지 않습니다.\n이메일 인증 후 이메일을 수정하지 마세요.");
            return;
        }
        // 필수값 확인
        for(let [k, v] of Object.entries(inputData)){
            if(v === ''){
                if(k === 'id'){
                    alert('아이디를 입력하세요.'); return;
                }else if(k === 'passwd'){
                    alert('비밀번호를 입력하세요.'); return;
                }else if(k === 'email'){
                    alert('이메일을 입력하세요.'); return;
                }else if(k === 'name'){
                    alert('이름을 입력하세요.'); return;
                }else if(k === 'birthday'){
                    alert('생년월일을 입력하세요.'); return;
                }else if(k === 'zipcode'){
                    alert('우편번호를 입력하세요.'); return;
                }else if(k === 'phone'){
                    alert('휴대폰 번호를 입력하세요.'); return;
                }
            }
            if(inputData.roadAddress === '' && inputData.jibunAddress === ''){
                alert('주소를 입력하세요.'); return;
            }
        }
        if(!window.confirm("가입하시겠습니까?")){
            return;
        }

        axios({
            method: 'post',
            url: 'http://localhost:8080/MyWeb1/member/join/MemberJoinService.jsp',
            data: JSON.stringify({
                ...inputData
            }),
        })
        .then((res) => {
            // console.log(res);
            // console.log(res.data);
            dispatch({type: "MEMBER/JOIN_SUCCESS", payload: {
                "SEQ" : res.data.seq,
                "ID" : res.data.id,
                "NAME" : res.data.name,
            }});

            alert('가입이 완료되었습니다.');
            // 메인페이지로 이동
        })
        .catch((err) => console.log(err));
    };
    const resetHandler = (e) => {
        e.preventDefault();
        setInputData({
            id : '',
            passwd : '',
            email : '',
            name : '',
            birthday : '',
            zipcode : '',
            roadAddress : '',
            jibunAddress : '',
            detailAddress : '',
            extraAddress : '',
            phone : '',
            memo : '',
        });
    }
    const clickHander = (e) => {
        e.preventDefault();
        if(e.target.name === "btn_sendmail") {
            if(inputData.email === ''){
                alert("이메일을 입력하세요.");
                return;
            }
            (async () => {
                const result = await axios({
                    method: "post",
                    url: "http://localhost:8080/MyWeb1/member/join/MailSendService.jsp",
                    data : JSON.stringify({
                        email : inputData.email
                    }),
                });
                alert(result.data.message);
                // 전송여부와 이메일 저장
                setEmailCert({
                    ...emailCert,
                    email : inputData.email,
                    transmit : result.data.transmit,
                });
            })();
        }else if(e.target.name === "btn_certify") {
            if(emailCert.verificationCode === '') {
                alert("인증번호를 입력 후 눌러주세요.");
                return;
            }
            if(emailCert.certificated){
                alert("이미 인증이 되었습니다.");
                return;
            }
            (async () => {
                const result = await axios({
                    method: "post",
                    url: "http://localhost:8080/MyWeb1/member/join/MailCertService.jsp",
                    data : JSON.stringify({
                        email : emailCert.email,
                        verificationCode : emailCert.verificationCode,
                    }),
                });
                if(result.data.certificated === true){
                    alert("이메일 인증에 성공했습니다.");
                    setEmailCert({
                        ...emailCert,
                        certificated : true,
                    });
                }else{
                    alert("이메일 인증에 실패했습니다.");
                    setEmailCert({
                        ...emailCert,
                        verificationCode : '',
                    });
                }
            })();
        }
    }
    return (
        <>
            <form onSubmit={submitHandler} onReset={resetHandler}>
                <div id="div_id">
                    <input type="text" id="input_id" name="user_id" placeholder="아이디" maxlegnth="30" onChange={changeHandler1} value={inputData.id} />
                </div>
                <div id="div_passwd">
                    <input type="password" id="input_passwd" name="user_passwd" placeholder="비밀번호" maxlegnth="50" onChange={changeHandler1} value={inputData.passwd} />
                </div>
                <div id="div_email">
                    <input type="email" id="input_email" name="user_email" placeholder="이메일" onChange={changeHandler1} value={inputData.email} />
                    <button name="btn_sendmail" onClick={clickHander}>인증번호 전송</button>
                    <input type="text" name="txt_verification_code" placeholder="인증번호를 입력하세요." onChange={changeHandler2} value={emailCert.verificationCode} maxlegnth="6" />
                    <button name="btn_certify" onClick={clickHander}>인증하기</button>
                    {emailCert.certificated ? <span>인증 완료✅</span>: <span>인증 미완료❗️</span>}
                </div>
                <div id="div_name">
                    <input type="text" id="input_name" name="user_name" placeholder="이름" onChange={changeHandler1} value={inputData.name} />
                </div>
                <div id="div_birthday">
                    생년월일 <input type="date" id="input_birthday" name="user_birthday" onChange={changeHandler1} value={inputData.birthday} />
                </div>
                <div id="div_zipcode">
                    <input type="text" id="input_zipcode" name="user_zipcode" placeholder="우편번호" maxlength="5" onChange={changeHandler1} value={inputData.zipcode} />
                    <input type="button" onClick={execDaumPostcode} value="우편번호 찾기" />
                </div>
                <div id="div_roadAddress">
                    <input type="text" id="input_roadAddress" name="user_roadAddress" placeholder="도로명주소" onChange={changeHandler1} value={inputData.roadAddress} />
                </div>
                <div id="div_jibunAddress">
                    <input type="text" id="input_jibunAddress" name="user_jibunAddress" placeholder="지번주소" onChange={changeHandler1} value={inputData.jibunAddress} />
                </div>
                <div id="div_detailAddress">
                    <input type="text" id="input_detailAddress" name="user_detailAddress" placeholder="상세주소" onChange={changeHandler1} value={inputData.detailAddress} />
                </div>
                <div id="div_extraAddress">
                    <input type="text" id="input_extraAddress" name="user_extraAddress" placeholder="참고항목" onChange={changeHandler1} value={inputData.extraAddress} />
                </div>
                <div id="div_phone">
                    <input type="text" id="input_phone" name="user_phone" placeholder="'-' 없이 입력" onChange={changeHandler1} value={inputData.phone} />
                </div>
                <div id="div_memo">
                    <textarea
                        name={"user_memo"}
                        value={inputData.memo}
                        placeholder={"간단한 소개"}
                        onChange={changeHandler1}></textarea>
                </div>
                <input type="submit" value="확인" />
                <input type="reset" />
            </form>
        </>
    );

    //본 예제에서는 도로명 주소 표기 방식에 대한 법령에 따라, 내려오는 데이터를 조합하여 올바른 주소를 구성하는 방법을 설명합니다.
    function execDaumPostcode() {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var roadAddr = data.roadAddress; // 도로명 주소 변수
                var extraRoadAddr = ''; // 참고 항목 변수

                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                // document.getElementById('input_zipcode').value = data.zonecode;
                setInputData(prevData => ({...prevData, zipcode : data.zonecode}));
                // document.getElementById("input_roadAddress").value = roadAddr;
                setInputData(prevData => ({...prevData, roadAddress : roadAddr}));
                // document.getElementById("input_jibunAddress").value = data.jibunAddress;
                setInputData(prevData => ({...prevData, jibunAddress : data.jibunAddress}));
                
                // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
                if(roadAddr !== ''){
                    // document.getElementById("input_extraAddress").value = extraRoadAddr;
                    setInputData(prevData => ({...prevData, extraAddress : extraRoadAddr}));
                } else {
                    // document.getElementById("input_extraAddress").value = '';
                    setInputData(prevData => ({...prevData, extraAddress : ''}));
                }

                // var guideTextBox = document.getElementById("guide");
                // // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
                // if(data.autoRoadAddress) {
                //     var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                //     guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                //     guideTextBox.style.display = 'block';

                // } else if(data.autoJibunAddress) {
                //     var expJibunAddr = data.autoJibunAddress;
                //     guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                //     guideTextBox.style.display = 'block';
                // } else {
                //     guideTextBox.innerHTML = '';
                //     guideTextBox.style.display = 'none';
                // }
            }
        }).open();
    }
};

export default MemberJoinInputs;

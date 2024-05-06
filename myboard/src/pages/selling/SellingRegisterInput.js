import React, { useState, useEffect } from 'react';
import { Map, useKakaoLoader, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SellingRegisterInput = (props) => {
    let addrTemp = {
        latitude : null,
        longitude : null,
        region_code : "",
        region_1depth : "",
        region_2depth : "",
        region_3depth : "",
        region_4depth : "",
        addr1 : "",
        addr2 : "",
    };
    useKakaoLoader();
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState({
        title : "",
        money_code1 : "USD",
        amount1 : 0,
        money_code2 : "KRW",
        amount2 : 0,
        latitude : 37.58019281070752,
        longitude : 126.97677819997642,
        region_code : "",
        region_1depth : "",
        region_2depth : "",
        region_3depth : "",
        region_4depth : "",
        addr1 : "",
        addr2 : "",
        memo : "",
        writer : null, // 로그인 아직 안함 => redux-persist 모듈 알아보기
    });
    const [mapState, setMapState] = useState({
        // 지도의 중심좌표
        center : {lat : 37.58019281070752, lng : 126.97677819997642},
        // 마커 위치
        coordinate : {lat : 37.58019281070752, lng : 126.97677819997642},
    });
    const [moneyCode, setMoneyCode] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const result = await axios({
                    method : 'get',
                    url : 'http://localhost:8080/MyWeb1/common/SelectMoneyUnits.jsp',
                    headers: {
                        "Content-Type" : "text/plain",
                        "Accept" : "application/json",
                    }
                });
                setMoneyCode(result.data);
            }catch(err) {
                console.log(err);
            }
        })();
    },[]);

    const changeHandler1 = (e) => {
        e.preventDefault();
        setUserInput({
            ...userInput,
            [e.target.name] : e.target.value,
        });
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        if(userInput.title === ''){
            alert('제목을 입력하세요'); return;
        }else if(userInput.amount1 === 0){
            alert(`판매할 화폐액수가 0${userInput.money_code1}입니다.`); return;
        }else if(userInput.amount2 === 0){
            alert(`제시한 화폐액수가 0${userInput.money_code2}입니다.`); return;
        }else if(userInput.memo === ''){
            alert('내용이 없습니다.'); return;
        }else if(userInput.region_code === '' || userInput.region_1depth === '' || userInput.region_2depth === '' || userInput.region_3depth === ''){
            alert('시스템 오류입니다.\n관리자에게 문의주세요.'); return;
        }
        if(window.confirm("입력하신 정보를 확인하세요.\n등록하시겠습니까?")){
            (async () => {
                try {
                    const result = await axios.post(
                        "http://localhost:8080/MyWeb1/selling/SaveNewSelling.jsp",
                        JSON.stringify({
                            ...userInput,
                            writer : 'ADMIN', // 나중에 수정
                        }),
                    );
                    if('sell_id' in result.data){
                        alert('저장했습니다.');
                    }
                    navigate('/selling/list');
                }catch(err) {
                    console.log(err);
                }
            })();
        }
    };

    const resetHandler = (e) => {
        e.preventDefault();
        setUserInput({
            title : "",
            money_code1 : "USD",
            amount1 : 0,
            money_code2 : "KRW",
            amount2 : 0,
            latitude : 37.58019281070752,
            longitude : 126.97677819997642,
            region_code : "",
            region_1depth : "",
            region_2depth : "",
            region_3depth : "",
            region_4depth : "",
            addr1 : "",
            addr2 : "",
            memo : "",
            writer : null,
        });
    }
    // 동작은 하지만 언더스코어(_)를 왜 쓰는지 이해가 안됨...
    const clickHander = (_, e) => {
        // getAddressByCoordinate(e.latLng.getLat(), e.latLng.getLng());
        setMapState({
            ...mapState,
            coordinate : {
                lat : e.latLng.getLat(), // 위도
                lng : e.latLng.getLng(), // 경도
            }
        });

        axios({
            method: 'get',
            url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${e.latLng.getLng()}&y=${e.latLng.getLat()}`,
            headers: {
                "Content-Type" : "text/plain",
                "Accept" : "application/json",
                "Authorization" : "KakaoAK ab7f142fe71f6a157e739be334f50ecc",
            }
        })
        .then((res) => {
            // console.log('성공1..');
            addrTemp = {
                ...addrTemp,
                latitude : e.latLng.getLat(),
                longitude : e.latLng.getLng(),
                region_code : res.data.documents[0].code,
                region_1depth : res.data.documents[0].region_1depth_name,
                region_2depth : res.data.documents[0].region_2depth_name,
                region_3depth : res.data.documents[0].region_3depth_name,
                region_4depth : res.data.documents[0].region_4depth_name,
            };
            
            return axios({
                method: 'get',
                url: `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${e.latLng.getLng()}&y=${e.latLng.getLat()}&input_coord=WGS84`,
                headers: {
                    "Content-Type" : "text/plain",
                    "Accept" : "application/json",
                    "Authorization" : "KakaoAK ab7f142fe71f6a157e739be334f50ecc",
                }
            });
        })
        .then((res) => {
            // console.log('성공2..');
            addrTemp = {
                ...addrTemp,
                addr1 : res.data.documents[0].address.address_name,
                addr2 : ((res.data.documents[0].road_address !== null) ? res.data.documents[0].road_address.address_name : ""),
            };
            
        })
        .catch((err) => {
            console.log(err);
            addrTemp = {
                region_code : "",
                region_1depth : "",
                region_2depth : "",
                region_3depth : "",
                region_4depth : "",
                addr1 : "",
                addr2 : "",
            };
            
        })
        .finally(() => {
            setUserInput({
                ...userInput,
                ...addrTemp,
            });
        });
    }
    // // 좌표로 주소 얻기
    // const getAddressByCoordinate = (lat, lng) => {
    //     let geocoder = new window.kakao.maps.services.Geocoder();
    //     const callback1 = (result, status) => {
    //         if(status === window.kakao.maps.services.Status.OK) {
    //             setUserInput({
    //                 ...userInput,
    //                 addr1 : result[0].address.address_name, // 지번주소
    //                 addr2 : ((result[0].road_address !== null) ? result[0].road_address.address_name : ''), // 도로명주소 (없으면 null)
    //             });
    //         }
    //     }
    //     const callback2 = (result, status) => {
    //         if(status === window.kakao.maps.services.Status.OK) {
    //             let {code, region_1depth_name, region_2depth_name, region_3depth_name, region_4depth_name} = result[0];
    //             setUserInput({
    //                 ...userInput,
    //                 region_code : code,
    //                 region_1depth : region_1depth_name,
    //                 region_2depth : region_2depth_name,
    //                 region_3depth : region_3depth_name,
    //                 region_4depth : region_4depth_name,
    //                 // addr1, addr2,
    //             });
    //         }
    //     }
    //     // 위도, 경도 파라미터 순서 주의
    //     // geocoder.coord2Address(lng, lat, callback1);
    //     // geocoder.coord2RegionCode(lng, lat, callback2);
    // };
    
    
    return (
        <><form onSubmit={submitHandler} onReset={resetHandler}>
            제목 : <input type="text" name="title" className="selling_title" placeholder="제목을 입력하세요." maxLength={30} value={userInput.title} onChange={changeHandler1} /> <br/>
            판매할 화폐 : 
            <select name="money_code1" className="selling_money_code1" onChange={changeHandler1} >
            {moneyCode.map(a => {
                return <option value={a.money_code} selected={a.money_code === userInput.money_code1 ? true : false}>{a.money_name}</option>
            })}
            </select>
            판매할 화폐액수 : <input type="number" name="amount1" className="selling_amount1" min={0} value={userInput.amount1} onChange={changeHandler1} /> <br/>
            제시한 화폐 : 
            <select name="money_code2" className="selling_money_code2" onChange={changeHandler1} >
            {moneyCode.map(a => {
                return <option value={a.money_code} selected={a.money_code === userInput.money_code2 ? true : false}>{a.money_name}</option>
            })}
            </select>
            제시한 화폐액수 : <input type="number" name="amount2" className="selling_amount2" min={0} value={userInput.amount2} onChange={changeHandler1} /> <br/>
            지번주소 : <input type="text" name="addr1" className="selling_addr1" placeholder="지번주소" value={userInput.addr1} readOnly /> <br/>
            도로명주소 : <input type="text" name="addr2" className="selling_addr2" placeholder="도로명주소" value={userInput.addr2} readOnly /> <br/>
            <Map id="map1" center={mapState.center}
                style={{
                    // 지도의 크기
                    width: "100%",
                    height: "500px",
                }}
                level={3} // 지도의 확대 레벨
                onClick={clickHander}>
                <MapMarker position={mapState.coordinate} />
            </Map>
            <textarea name="memo" className="selling_memo" placeholder="내용" value={userInput.memo} onChange={changeHandler1} /> <br/>
            <input type="submit" value="등록" />
            <input type="reset" />
        </form></>
    );
};

export default SellingRegisterInput;
/*
  `sell_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '판매글 아이디',
  `title` varchar(100) DEFAULT NULL COMMENT '판매글 제목',
  `money_code1` varchar(10) DEFAULT NULL COMMENT '판매할 화폐코드',
  `amount1` int(11) DEFAULT NULL COMMENT '판매할 화폐액수',
  `money_code2` varchar(10) DEFAULT NULL COMMENT '제시한 화폐코드',
  `amount2` int(11) DEFAULT NULL COMMENT '제시한 화폐액수',
  `latitude` decimal(25,20) DEFAULT NULL COMMENT '위도(y)',
  `longitude` decimal(25,20) DEFAULT NULL COMMENT '경도(x)',
  `region_code`   VARCHAR(15)  DEFAULT NULL COMMENT '법정동코드 10자리',
  `region_1depth` VARCHAR(100) DEFAULT NULL COMMENT '법정동주소1 (시/도)',
  `region_2depth` VARCHAR(100) DEFAULT NULL COMMENT '법정동주소2 (시/군/구)',
  `region_3depth` VARCHAR(100) DEFAULT NULL COMMENT '법정동주소3 (읍/면/동)',
  `region_4depth` VARCHAR(100) DEFAULT NULL COMMENT '법정동주소4 (리)',
  `addr1`         VARCHAR(256) DEFAULT NULL COMMENT '전체 지번 주소',
  `addr2`         VARCHAR(256) DEFAULT NULL COMMENT '전체 도로명 주소',
  `memo` longtext DEFAULT NULL COMMENT '내용',
  `writer` varchar(30) DEFAULT NULL COMMENT '판매자(등록자)',
  `write_date` datetime(6) NOT NULL COMMENT '등록일자',
  `updater` varchar(30) DEFAULT NULL COMMENT '수정자',
  `update_date` datetime(6) DEFAULT NULL COMMENT '수정일자',
  `sold_yn` tinyint(1) DEFAULT 0 COMMENT '판매여부 1:판매완료 0:판매중',
*/
/*
curl -v -G GET "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=127.1086228&y=37.4012191" ^
-H "Authorization: KakaoAK ab7f142fe71f6a157e739be334f50ecc"

curl -v -G GET "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=127.423084873712&y=37.0789561558879&input_coord=WGS84" ^
-H "Authorization: KakaoAK ab7f142fe71f6a157e739be334f50ecc"
*/

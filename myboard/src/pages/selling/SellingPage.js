import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, useKakaoLoader, MapMarker } from 'react-kakao-maps-sdk';
import axios from 'axios';
import DrawPolygonSIG from '../../components/selling/DrawPolygonSIG';
import SellingItem from '../../components/selling/SellingItem';
import './SellingPage.css';

const SellingPage = () => {

    const navigate = useNavigate();
    const [mapState, setMapState] = useState({
        // 지도의 중심좌표
        center : {lat : 37.58019281070752, lng : 126.97677819997642},
        // 마커 위치
        marker : {lat : 37.58019281070752, lng : 126.97677819997642},
    });
    const [userInput, setUserInput] = useState({
        write_sdate : "2015-01-01",
        write_edate : new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
        title : "",
        region_1depth : "",
        region_2depth : "",
        region_3depth : "",
        region_4depth : "",
        money_code1 : "",
        amount1_start : 0,
        amount1_end : 1000000,
    });
    // 법정구역 선택 콤보박스 4개
    const [regions, setRegions] = useState({
        LV1 : [],
        LV2 : [],
        LV3 : [],
        LV4 : [],
    });
    // 화폐단위 콤보박스
    const [moneyUnits, setMoneyUnits] = useState([]);
    // 좌측 판매 리스트
    const [sellingList, setSellingList] = useState([]);
    // 폴리곤 밀집도별 색상
    const [polygonColors, setPolygonColors] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const result1 = await axios({
                    method : 'get',
                    url : 'http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV1',
                    headers : {
                        "Content-Type" : "text/plain",
                        "Accept" : "application/json",
                    }
                });
                const result2 = await axios({
                    method : 'get',
                    url : 'http://localhost:8080/MyWeb1/common/SelectMoneyUnits.jsp',
                    headers : {
                        "Content-Type" : "text/plain",
                        "Accept" : "application/json",
                    }
                });
                const result3 = await axios({
                    method : 'post',
                    url : 'http://localhost:8080/MyWeb1/common/SelectPolygonDensity.jsp',
                    data : JSON.stringify({'gbn':1}),
                });
                setRegions({
                    ...regions,
                    LV1 : [...result1.data],
                });
                setMoneyUnits([
                    ...result2.data,
                ]);
                setPolygonColors([
                    ...result3.data,
                ]);
            }catch(err) {
                console.log(err);
            }
        })();
    },[]);
    const changeHandler = (identifier, event) => {
        event.preventDefault();
        if(identifier === 'write_sdate') {
            setUserInput({
                ...userInput,
                write_sdate : event.target.value,
            });
            return;
        }else if(identifier === 'write_edate') {
            setUserInput({
                ...userInput,
                write_edate : event.target.value,
            });
            return;
        }else if(identifier === 'title') {
            setUserInput({
                ...userInput,
                title : event.target.value,
            });
            return;
        }else if(identifier === 'region_1depth') {
            (async () => {
                const res = await axios.get('http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV2&upRegionCode='+event.target.value);
                setUserInput({
                    ...userInput,
                    region_1depth : event.target.value,
                    region_2depth : "",
                    region_3depth : "",
                    region_4depth : "",
                });
                setRegions({
                    ...regions,
                    LV2 : [...res.data],
                    LV3 : [],
                    LV4 : [],
                });
            })();
        }else if(identifier === 'region_2depth') {
            (async () => {
                const res = await axios.get('http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV3&upRegionCode='+event.target.value);
                setUserInput({
                    ...userInput,
                    region_2depth : event.target.value,
                    region_3depth : "",
                    region_4depth : "",
                });
                setRegions({
                    ...regions,
                    LV3 : [...res.data],
                    LV4 : [],
                });
            })();
        }else if(identifier === 'region_3depth') {
            (async () => {
                const res = await axios.get('http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV4&upRegionCode='+event.target.value);
                setUserInput({
                    ...userInput,
                    region_3depth : event.target.value,
                    region_4depth : "",
                });
                setRegions({
                    ...regions,
                    LV4 : [...res.data],
                });
            })();
        }else if(identifier === 'region_4depth') {
            setUserInput({
                ...userInput,
                region_4depth : event.target.value,
            });
        }else if(identifier === 'money_code1') {
            setUserInput({
                ...userInput,
                money_code1 : event.target.value,
            });
        }
    };
    const clickHandler = (_polygon, paramObj) => {
        console.log(paramObj);
        if(paramObj.regionDepth === 2) { // 시/군/구
            Promise.all([
                axios.get('http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV1'),
                axios.get('http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV2&upRegionCode='+paramObj.areacode.slice(0, 2)+'00000000'),
                axios.get('http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV3&upRegionCode='+paramObj.areacode.slice(0, 5)+'00000'),
            ])
            .then(success => {
                setUserInput({
                    ...userInput,
                    region_1depth : paramObj.areacode.slice(0, 2)+'00000000',
                    region_2depth : paramObj.areacode.slice(0, 5)+'00000',
                    region_3depth : "",
                    region_4depth : "",
                });
                setRegions({
                    ...regions,
                    LV1 : [...success[0].data],
                    LV2 : [...success[1].data],
                    LV3 : [...success[2].data],
                    LV4 : [],
                });
            })
            .catch(err => {
                console.log(err);
            });
        }else if(paramObj.regionDepth === 3) { // 읍/면/동

        }
    }
    const submitHandler = e => {
        e.preventDefault();
        (async () => {
            const res = await axios({
                method: "post",
                url: "http://localhost:8080/MyWeb1/selling/SearchSelling.jsp",
                data : JSON.stringify({
                    write_sdate : userInput.write_sdate,
                    write_edate : userInput.write_edate,
                    title : userInput.title,
                    // 법정동코드
                    region_code : (
                        userInput.region_4depth !== '' ? userInput.region_4depth : (
                            userInput.region_3depth !== '' ? userInput.region_3depth : (
                                userInput.region_2depth !== '' ? userInput.region_2depth : userInput.region_1depth
                            )
                        )
                    ),
                    region_depth : (
                        userInput.region_4depth !== '' ? 4 : (
                            userInput.region_3depth !== '' ? 3 : (
                                userInput.region_2depth !== '' ? 2 : (
                                    userInput.region_1depth !== '' ? 1 : 0
                                )
                            )
                        )
                    ),
                    money_code1 : userInput.money_code1,
                    amount1_start : userInput.amount1_start,
                    amount1_end : userInput.amount1_end,
                }),
            });
            setSellingList([...res.data]);
            setPolygonColors(polygonColors => [
                ...polygonColors,
            ]);
        })();
    }
    return (
        <>
            <button onClick={() => navigate('/selling/register')}>➕ 글쓰기</button>
            <div className="div_search_conditions">
                <form onSubmit={submitHandler}>
                판매글 등록일자 :
                <input type="date" name="write_sdate" className="input_write_sdate" value={userInput.write_sdate} min="2000-01-01" onChange={e => changeHandler('write_sdate', e)}/>
                ~
                <input type="date" name="write_edate" className="input_write_edate" value={userInput.write_edate} max="9999-12-31" onChange={e => changeHandler('write_edate', e)}/>
                <br/>
                제목 : <input type="text" name="title" className="input_title" value={userInput.title} onChange={e => changeHandler('title', e)} /> <br/>
                지역 : 
                <select name="region_1depth" className="cbo_region_1depth" onChange={e => changeHandler('region_1depth', e)}>
                    {
                        [{region_code: "", region_name: "- 전체 -"}, ...regions.LV1].map(e => <option value={e.region_code} selected={(e.region_code === userInput.region_1depth ? true : false)}>{e.region_name}</option>)
                    }
                </select>
                <select name="region_2depth" className="cbo_region_2depth" onChange={e => changeHandler('region_2depth', e)}>
                    {
                        [{region_code: "", region_name: "- 전체 -"}, ...regions.LV2].map(e => <option value={e.region_code} selected={(e.region_code === userInput.region_2depth ? true : false)}>{e.region_name}</option>)
                    }
                </select>
                <select name="region_3depth" className="cbo_region_3depth" onChange={e => changeHandler('region_3depth', e)}>
                    {
                        [{region_code: "", region_name: "- 전체 -"}, ...regions.LV3].map(e => <option value={e.region_code} selected={(e.region_code === userInput.region_3depth ? true : false)}>{e.region_name}</option>)
                    }
                </select>
                <select name="region_4depth" className="cbo_region_4depth" onChange={e => changeHandler('region_4depth', e)}>
                    {
                        [{region_code: "", region_name: "- 전체 -"}, ...regions.LV4].map(e => <option value={e.region_code} selected={(e.region_code === userInput.region_4depth ? true : false)}>{e.region_name}</option>)
                    }
                </select>
                <br/>
                판매 금액 : 
                <select name="money_code1" className="cbo_money_code1" onChange={e => changeHandler('money_code1',e)}>
                    {
                        [{money_code : "", money_name : "- 전체 -"}, ...moneyUnits].map(e => <option value={e.money_code} selected={e.money_code === userInput.money_code1 ? true : false}>{e.money_name}</option>)
                    }
                </select>
                <input type="number" name="amount1_start" className="input_amount1_start" value={userInput.amount1_start} />
                ~
                <input type="number" name="amount1_end" className="input_amount1_end" value={userInput.amount1_end} />
                <input type="submit" className="btn_search" value="검색" />
                </form>
            </div>
            <div className="div_selling_info">
                <div className="div_selling_list">
                    {sellingList.map(a => <SellingItem key={a.sell_id} {...a} changeMapState={[mapState, setMapState]}/>)}
                </div>
                <Map id="map2" center={mapState.center}
                    // style={{
                    //     // 지도의 크기
                    //     width: "75%",
                    //     height: "1000px",
                    // }}
                    level={5} // 지도의 확대 레벨
                >
                    <DrawPolygonSIG parentClickListener = {clickHandler} polygonColors={polygonColors} />
                    <MapMarker // 마커를 생성합니다
                        position={{
                            // 마커가 표시될 위치입니다
                            lat: mapState.marker.lat,
                            lng: mapState.marker.lng,
                        }}
                    />
                </Map>
            </div>
        </>
    );
}

export default SellingPage;

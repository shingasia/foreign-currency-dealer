import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { Map, useKakaoLoader, MapMarker } from 'react-kakao-maps-sdk';
import axios from 'axios';
import ReplyList from '../../components/community/ReplyList';
import './SellingDatailPage.css';

const SellingDetailPage = () => {
    const location = useLocation();
    const { sell_id } = location.state;
    const dispatch = useDispatch();
    const [sellInfo, setSellInfo] = useState({
        'sell_id' : sell_id,
        'title' : '',
        'money_code1' : '',
        'amount1' : '',
        'money_code2' : '',
        'amount2' : '',
        'latitude' : '',
        'longitude' : '',
        'region_code' : '',
        'region_1depth' : '',
        'region_2depth' : '',
        'region_3depth' : '',
        'region_4depth' : '',
        'addr1' : '',
        'addr2' : '',
        'memo' : '',
        'writer' : '',
        'write_date' : '',
        'sold_yn' : '',
    })
    useEffect(() => {
        Promise.all([
            axios({
                method : 'post',
                url : 'http://localhost:8080/MyWeb1/selling/SellingDetail.jsp',
                data : {'sell_id' : sell_id, 'TYPE' : 'Selling/Main'},
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
                },
            }),
            // axios({
            //     method : 'post',
            //     url : 'http://localhost:8080/MyWeb1/selling/SellingDetail.jsp',
            //     data : {'sell_id' : sell_id, 'TYPE' : 'Selling/Replys'},
            //     headers: {
            //         "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
            //     },
            // }),
        ])
        .then(success => {
            if(success[0].status === 200) {
                setSellInfo(sellInfo => ({
                    ...sellInfo,
                    title : success[0].data.title,
                    money_code1 : success[0].data.money_code1,
                    amount1 : success[0].data.amount1,
                    money_code2 : success[0].data.money_code2,
                    amount2 : success[0].data.amount2,
                    latitude : success[0].data.latitude,
                    longitude : success[0].data.longitude,
                    region_code : success[0].data.region_code,
                    region_1depth : success[0].data.region_1depth,
                    region_2depth : success[0].data.region_2depth,
                    region_3depth : success[0].data.region_3depth,
                    region_4depth : success[0].data.region_4depth,
                    addr1 : success[0].data.addr1,
                    addr2 : success[0].data.addr2,
                    memo : success[0].data.memo,
                    writer : success[0].data.writer,
                    write_date : success[0].data.write_date,
                    sold_yn : success[0].data.sold_yn,
                }));
            }
        })
        .catch(err => {
            console.log(err);
        });
    },[]);

    return (
        <><div className="div_selling_detail">
            제목 : {sellInfo.title} <br/>
            판매 금액 : {sellInfo.amount1+" "+sellInfo.money_code1} <br/>
            제시 금액 : {sellInfo.amount2+" "+sellInfo.money_code2} <br/>
            지번주소 : {sellInfo.addr1} <br/>
            도로명주소 : {sellInfo.addr2} <br/>
            상세내용 : <div className="div_selling_detail_memo">{sellInfo.memo}</div>
            등록일자 : {sellInfo.write_date} <br/>
            글쓴이 : {sellInfo.writer}
            <br/><br/>
            <Map
                center={{
                    // 지도의 중심좌표
                    lat: sellInfo.latitude,
                    lng: sellInfo.longitude,
                }}
                style={{
                    // 지도의 크기
                    width: "600px",
                    height: "450px",
                }}
                level={4} // 지도의 확대 레벨
            >
                <MapMarker // 마커를 생성합니다
                    position={{
                        // 마커가 표시될 위치입니다
                        lat: sellInfo.latitude,
                        lng: sellInfo.longitude,
                    }}
                />
            </Map>
            <hr/>
            <ReplyList sell_id={sellInfo.sell_id}/>
        </div></>
    );
}
export default SellingDetailPage;


import React, { useState, useEffect } from 'react';
import { Map, useKakaoLoader, MapMarker } from 'react-kakao-maps-sdk';

/*
 * props
 * lat (Number): 위도
 * lng (Number): 경도
 * width (string): 가로길이
 * height (String): 세로길이
 * level (Number): 지도레벨
 */
const Map1 = (props) => {

    useKakaoLoader();
    const [state, setState] = useState({
        // 지도의 중심좌표
        center : {lat : props.lat, lng : props.lng},
        // 마커 위치
        coordinate : {lat : props.lat, lng : props.lng},
    });
    // 부모 컴포넌트와 동일한 state구성
    const [parentState, setParentState] = useState({
        latitude : props.lat,
        longitude : props.lng,
        region_code : props.userInput.region_code,
        region_1depth : props.userInput.region_1depth,
        region_2depth : props.userInput.region_2depth,
        region_3depth : props.userInput.region_3depth,
        region_4depth : props.userInput.region_4depth,
        addr1 : props.userInput.addr1,
        addr2 : props.userInput.addr2,
    });

    useEffect(() => {
        props.changeEvtFunc(parentState);
    },[parentState]);

    // 동작은 하지만 언더스코어(_)를 왜 쓰는지 이해가 안됨...
    const clickHander = (_, e) => {
        getAddressByCoordinate(e.latLng.getLat(), e.latLng.getLng());
        
        // setState({
        //     ...state,
        //     coordinate : {
        //         lat : e.latLng.getLat(), // 위도
        //         lng : e.latLng.getLng(), // 경도
        //     },
        // });
    }
    // 좌표로 주소 얻기
    const getAddressByCoordinate = (lat, lng) => {
        let geocoder = new window.kakao.maps.services.Geocoder();

        const callback1 = (result, status) => {
            if(status === window.kakao.maps.services.Status.OK) {
                setParentState({
                    ...parentState,
                    addr1 : result[0].address.address_name, // 지번주소
                    addr2 : ((result[0].road_address !== null) ? result[0].road_address.address_name : ''), // 도로명주소 (없으면 null)
                });
            }
        }
        const callback2 = (result, status) => {
            if(status === window.kakao.maps.services.Status.OK) {
                let {code, region_1depth_name, region_2depth_name, region_3depth_name, region_4depth_name} = result[0];
                setParentState({
                    ...parentState,
                    latitude : lat,
                    longitude : lng,
                    region_code : code,
                    region_1depth : region_1depth_name,
                    region_2depth : region_2depth_name,
                    region_3depth : region_3depth_name,
                    region_4depth : region_4depth_name,
                    // addr1, addr2,
                });
            }
        }
        // 위도, 경도 파라미터 순서 주의
        geocoder.coord2Address(lng, lat, callback1);
        geocoder.coord2RegionCode(lng, lat, callback2);
    };
    return (
        <>
            <Map id="map1" center={{lat : parentState.latitude, lng : parentState.longitude,}}
                style={{
                    // 지도의 크기
                    width: props.width,
                    height: props.height,
                }}
                level={props.level} // 지도의 확대 레벨
                onClick={clickHander}>
                <MapMarker position={{lat : parentState.latitude, lng : parentState.longitude,}} />
            </Map>
        </>
    );
}

export default Map1;
// 좌표를 주소로 변환하는 블로그
// https://velog.io/@wlwl99/React-Kakao-Map-SDK-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
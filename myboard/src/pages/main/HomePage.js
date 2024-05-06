// 우측 상단에 로그인 로그아웃 버튼
// 가운데 여러개의 큰 박스가 있다.
// - 검색하러 가기
// - 나의 판매/구매 내역
// - 북마크 내역
// - 연도별 환율 변화 그래프 보기
// - 연도별/월별/주별/일별 판매내역 집계(합계, 평균,)

// 빈 화면에 rfce Enter 누르면 자동완성
import React from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={"link_box_list"}>
      <div className={"link_box"} onClick={() => navigate("/selling/list")}>판매글 보러가기</div>
      <div className={"link_box"}>나의 판매/구매 내역</div>
      <div className={"link_box"}>북마크 게시글</div>
      <div className={"link_box"}>기간별 환율 변화</div>
      <div className={"link_box"}>기간별 판매내역 집계</div>
    </div>
  );
}

export default HomePage;
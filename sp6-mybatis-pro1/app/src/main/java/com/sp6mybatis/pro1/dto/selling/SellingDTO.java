package com.sp6mybatis.pro1.dto.selling;

import java.util.*;
import java.io.Serializable;

public class SellingDTO {
    /* 검색 확장 값을 저장하기 위한 멥 */
    private Map<String, Object> paramMap = new HashMap<String, Object>();
    // 테이블데이터
    private int sellId;            // 판매글 아이디
    private String title;          // 판매글 제목
    private String moneyCode1;     // 판매할 화폐코드
    private int amount1;           // 판매할 화폐액수
    private String moneyCode2;     // 제시한 화폐코드
    private int amount2;           // 제시한 화폐액수
    private double latitude;       // 위도
    private double longitude;      // 경도
    private String regionCode;     // 법정동코드 10자리
    private String region1depth;   // 법정동주소1 (시/도)
    private String region2depth;   // 법정동주소2 (시/군/구)
    private String region3depth;   // 법정동주소3 (읍/면/동)
    private String region4depth;   // 법정동주소4 (리)
    private String addr1;          // 전체 지번 주소
    private String addr2;          // 전체 도로명 주소
    private String memo;           // 내용
    private String writer;         // 판매자(등록자)
    private String writeDate;      // 등록일자
    private String updater;        // 수정자
    private String updateDate;     // 수정일자
    private int soldYn;            // 판매여부 1:판매완료 0:판매중
    // 메타데이터
    private String regionName;     // CONCAT(A.region_1depth,' ',A.region_2depth,' ',A.region_3depth,' ',A.region_4depth)
    private int regionDepth;       // 법정동 레벨 (전체지역 -> 0, 시/도 -> 1, 시/군/구 -> 2, 읍/면/동 -> 3, 리 -> 4)

    // Getter / Setter
    public Map<String, Object> getParamMap() {
        return paramMap;
    }
    public void setParamMap(Map<String, Object> paramMap) {
        this.paramMap = paramMap;
    }
    public void addParam(String key, Object value) {
        this.paramMap.put(key, value);
    }
    public void removeParam(String key, Object value) {
        this.paramMap.remove(key);
    }
    public int getSellId() {
        return sellId;
    }
    public void setSellId(int sellId) {
        this.sellId = sellId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getMoneyCode1() {
        return moneyCode1;
    }
    public void setMoneyCode1(String moneyCode1) {
        this.moneyCode1 = moneyCode1;
    }
    public int getAmount1() {
        return amount1;
    }
    public void setAmount1(int amount1) {
        this.amount1 = amount1;
    }
    public String getMoneyCode2() {
        return moneyCode2;
    }
    public void setMoneyCode2(String moneyCode2) {
        this.moneyCode2 = moneyCode2;
    }
    public int getAmount2() {
        return amount2;
    }
    public void setAmount2(int amount2) {
        this.amount2 = amount2;
    }
    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    public String getRegionCode() {
        return regionCode;
    }
    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }
    public String getRegion1depth() {
        return region1depth;
    }
    public void setRegion1depth(String region1depth) {
        this.region1depth = region1depth;
    }
    public String getRegion2depth() {
        return region2depth;
    }
    public void setRegion2depth(String region2depth) {
        this.region2depth = region2depth;
    }
    public String getRegion3depth() {
        return region3depth;
    }
    public void setRegion3depth(String region3depth) {
        this.region3depth = region3depth;
    }
    public String getRegion4depth() {
        return region4depth;
    }
    public void setRegion4depth(String region4depth) {
        this.region4depth = region4depth;
    }
    public String getAddr1() {
        return addr1;
    }
    public void setAddr1(String addr1) {
        this.addr1 = addr1;
    }
    public String getAddr2() {
        return addr2;
    }
    public void setAddr2(String addr2) {
        this.addr2 = addr2;
    }
    public String getMemo() {
        return memo;
    }
    public void setMemo(String memo) {
        this.memo = memo;
    }
    public String getWriter() {
        return writer;
    }
    public void setWriter(String writer) {
        this.writer = writer;
    }
    public String getWriteDate() {
        return writeDate;
    }
    public void setWriteDate(String writeDate) {
        this.writeDate = writeDate;
    }
    public String getUpdater() {
        return updater;
    }
    public void setUpdater(String updater) {
        this.updater = updater;
    }
    public String getUpdateDate() {
        return updateDate;
    }
    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }
    public int getSoldYn() {
        return soldYn;
    }
    public void setSoldYn(int soldYn) {
        this.soldYn = soldYn;
    }
    public String getRegionName() {
        return regionName;
    }
    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }
    public int getRegionDepth() {
        return regionDepth;
    }
    public void setRegionDepth(int regionDepth) {
        this.regionDepth = regionDepth;
    }
    
    @Override
    public String toString() {
        return "SellingDTO [paramMap=" + paramMap + ", sellId=" + sellId + ", title=" + title + ", moneyCode1="
                + moneyCode1 + ", amount1=" + amount1 + ", moneyCode2=" + moneyCode2 + ", amount2=" + amount2
                + ", latitude=" + latitude + ", longitude=" + longitude + ", regionCode=" + regionCode
                + ", region1depth=" + region1depth + ", region2depth=" + region2depth + ", region3depth=" + region3depth
                + ", region4depth=" + region4depth + ", addr1=" + addr1 + ", addr2=" + addr2 + ", memo=" + memo
                + ", writer=" + writer + ", writeDate=" + writeDate + ", updater=" + updater + ", updateDate="
                + updateDate + ", soldYn=" + soldYn + ", regionName=" + regionName + ", regionDepth=" + regionDepth
                + "]";
    }
}

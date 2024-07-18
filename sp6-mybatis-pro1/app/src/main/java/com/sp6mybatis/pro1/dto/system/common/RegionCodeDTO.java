package com.sp6mybatis.pro1.dto.system.common;

import java.util.*;

public class RegionCodeDTO {
    /* 검색 확장 값을 저장하기 위한 멥 */
    private Map<String, Object> paramMap = new HashMap<String, Object>();
    private String regionCode;   // 행정구역코드
    private String regionName;   // 행정구역이름
    private String upRegionCode; // 상위 행정구역코드
    private int level; // 행정구역 레벨


    
    public Map<String, Object> getParamMap() {
        return paramMap;
    }
    public void setParamMap(Map<String, Object> paramMap) {
        this.paramMap = paramMap;
    }
    public String getRegionCode() {
        return regionCode;
    }
    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }
    public String getRegionName() {
        return regionName;
    }
    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }
    public String getUpRegionCode() {
        return upRegionCode;
    }
    public void setUpRegionCode(String upRegionCode) {
        this.upRegionCode = upRegionCode;
    }
    public int getLevel() {
        return level;
    }
    public void setLevel(int level) {
        this.level = level;
    }
    public void addParam(String key, Object value) {
        this.paramMap.put(key, value);
    }
    public void removeParam(String key, Object value) {
        this.paramMap.remove(key);
    }
    @Override
    public String toString() {
        return "RegionCodeDTO [paramMap=" + paramMap + ", regionCode=" + regionCode + ", regionName=" + regionName
                + ", upRegionCode=" + upRegionCode + ", level=" + level + "]";
    }
}

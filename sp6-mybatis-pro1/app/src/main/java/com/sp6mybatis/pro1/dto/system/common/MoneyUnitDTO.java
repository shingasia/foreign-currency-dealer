package com.sp6mybatis.pro1.dto.system.common;

import java.util.*;

public class MoneyUnitDTO {

    /* 검색 확장 값을 저장하기 위한 멥 */
    private Map<String, Object> paramMap = new HashMap<String, Object>();
    private String moneyCode;
    private String moenyName;

    // Getter / Setter
    public String getMoneyCode() {
        return moneyCode;
    }
    public void setMoneyCode(String moneyCode) {
        this.moneyCode = moneyCode;
    }
    public String getMoenyName() {
        return moenyName;
    }
    public void setMoenyName(String moenyName) {
        this.moenyName = moenyName;
    }
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

    @Override
    public String toString() {
        return "MoneyUnitDTO [moneyCode=" + moneyCode + ", moenyName=" + moenyName + "]";
    }
}

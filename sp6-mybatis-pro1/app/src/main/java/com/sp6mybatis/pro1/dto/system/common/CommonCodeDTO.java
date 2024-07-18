package com.sp6mybatis.pro1.dto.system.common;
import java.util.*;

import org.apache.ibatis.binding.MapperMethod.ParamMap;
import java.io.Serializable;

public class CommonCodeDTO {

    /* 검색 확장 값을 저장하기 위한 멥 */
    private Map<String, Object> paramMap = new HashMap<String, Object>();
    private String comcode1;
    private String comcode2;
    private String comcode3;
    private String codenm;
    private int useyn;
    private String registerId;
    private String registerDate;
    private String updateId;
    private String updateDate;
    private String memo;


    public String getComcode1() {
        return comcode1;
    }
    public void setComcode1(String comcode1) {
        this.comcode1 = comcode1;
    }
    public String getComcode2() {
        return comcode2;
    }
    public void setComcode2(String comcode2) {
        this.comcode2 = comcode2;
    }
    public String getComcode3() {
        return comcode3;
    }
    public void setComcode3(String comcode3) {
        this.comcode3 = comcode3;
    }
    public String getCodenm() {
        return codenm;
    }
    public void setCodenm(String codenm) {
        this.codenm = codenm;
    }
    public int getUseyn() {
        return useyn;
    }
    public void setUseyn(int useyn) {
        this.useyn = useyn;
    }
    public String getRegisterId() {
        return registerId;
    }
    public void setRegisterId(String registerId) {
        this.registerId = registerId;
    }
    public String getRegisterDate() {
        return registerDate;
    }
    public void setRegisterDate(String registerDate) {
        this.registerDate = registerDate;
    }
    public String getUpdateId() {
        return updateId;
    }
    public void setUpdateId(String updateId) {
        this.updateId = updateId;
    }
    public String getUpdateDate() {
        return updateDate;
    }
    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }
    public String getMemo() {
        return memo;
    }
    public void setMemo(String memo) {
        this.memo = memo;
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
        return "CommonCodeDTO [paramMap=" + paramMap + ", comcode1=" + comcode1 + ", comcode2=" + comcode2
                + ", comcode3=" + comcode3 + ", codenm=" + codenm + ", useyn=" + useyn + ", registerId=" + registerId
                + ", registerDate=" + registerDate + ", updateId=" + updateId + ", updateDate=" + updateDate + ", memo="
                + memo + "]";
    }

    
}

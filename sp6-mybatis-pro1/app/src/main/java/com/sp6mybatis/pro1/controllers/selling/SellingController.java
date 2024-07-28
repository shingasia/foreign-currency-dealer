package com.sp6mybatis.pro1.controllers.selling;

import java.io.IOException;
import java.util.*;
import java.util.Map.Entry;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sp6mybatis.pro1.App;
import com.sp6mybatis.pro1.config.ServiceConfig;
import com.sp6mybatis.pro1.dto.selling.SellingDTO;
import com.sp6mybatis.pro1.service.selling.SellingService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Import(ServiceConfig.class)
@RequestMapping(value = { "/selling" })
public class SellingController {

    private static final Logger logger = LogManager.getLogger(SellingController.class);

    @Autowired
    private SellingService sellingSvc;

    @RequestMapping(value = { "/saveNewSelling" }, method = { RequestMethod.POST })
    public void insertNewSelling(HttpServletRequest request, HttpServletResponse response, @RequestBody SellingDTO sellingDto) {

        SellingDTO newSell = sellingSvc.insertNewSelling(sellingDto);
        ObjectMapper objectMapper = new ObjectMapper();
        String rtn = null;
        try {
            rtn = objectMapper.writeValueAsString(newSell);
        } catch (JsonProcessingException e) {
            rtn = "{\"EX_CLASS\":" + e.getClass().getName() + ", \"EX_MSG\":" + e.getMessage() + "}";
        }
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().write(rtn);

        } catch (IOException e) {
            System.out.println("EX_CLASS - " + e.getClass().getName() + ", EX_MSG - " + e.getMessage());
        }
    }

    @ResponseBody
    @RequestMapping(value = { "/searchSelling" }, method = { RequestMethod.GET, RequestMethod.POST })
    public List<SellingDTO> requestMethodName(HttpServletRequest request, HttpServletResponse response, @RequestBody Map<String, Object> paramMap) { // 숫자면 자동으로 java.lang.Integer 타입으로 받음, Controller에서 @RequestBody는 1번만 사용 가능
        SellingDTO sellingDto = new SellingDTO();
        String sDate = ((paramMap.get("q_write_sdate")+"").equals("")) ? "2000-01-01" : (String)paramMap.get("q_write_sdate");
        String eDate = ((paramMap.get("q_write_edate")+"").equals("")) ? "9999-12-31" : (String)paramMap.get("q_write_edate");
        sellingDto.addParam("q_write_sdate", sDate + " 00:00:00.000000");
        sellingDto.addParam("q_write_edate", eDate + " 23:59:59.999999");
        sellingDto.addParam("q_title", paramMap.get("q_title"));
        sellingDto.addParam("q_region_code", paramMap.get("q_region_code"));
        sellingDto.addParam("q_region_depth", paramMap.get("q_region_depth"));
        sellingDto.addParam("q_money_code1", paramMap.get("q_money_code1"));
        sellingDto.addParam("q_amount1_start", paramMap.get("q_amount1_start") + "");
        sellingDto.addParam("q_amount1_end", paramMap.get("q_amount1_end") + "");
        sellingDto.addParam("q_rowPerPage", paramMap.get("q_rowPerPage"));
        sellingDto.addParam("q_pagingStartNum", paramMap.get("q_pagingStartNum"));

        for (Entry<String, Object> entrySet : paramMap.entrySet()) {
            System.out.println(entrySet.getKey() + " : " + entrySet.getValue());
        }
        List<SellingDTO> list = sellingSvc.selectSellingList(sellingDto);
        int totalCnt = sellingSvc.selectSellingListCount(sellingDto);
        System.out.println("페이지당 건수 : "+list.size());
        System.out.println("전체 건수     : "+totalCnt);
        return list;
    }

    @ResponseBody
    @RequestMapping(value = {"/selectMultipleResultSet1"}, method = { RequestMethod.GET, RequestMethod.POST })
    public List<List<Map<String, Object>>> selectMultipleResultSet1(HttpServletRequest request, HttpServletResponse response) {
        List<List<Map<String, Object>>> multiResults = sellingSvc.selectMultipleResultSet1();
        System.out.println("결과집합 개수 ===> " + multiResults.size());
        System.out.println(multiResults.get(0));
        System.out.println(multiResults.get(1));
        System.out.println(multiResults.get(2));
        System.out.println(multiResults.get(3));
        System.out.println(multiResults.get(4));
        return multiResults;
    }

    @ResponseBody
    @RequestMapping(value = {"/selectMultipleResultSet2"}, method = { RequestMethod.GET, RequestMethod.POST })
    public List<List<Map<String, Object>>> selectMultipleResultSet2(HttpServletRequest request, HttpServletResponse response) {
        List<List<Map<String, Object>>> multiResults = sellingSvc.selectMultipleResultSet2();
        return multiResults;
    }

}
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"title\":\"제목\",\"moneyCode1\":\"USD\",\"amount1\":\"200\",\"moneyCode2\":\"KRW\",\"amount2\":\"230000\",\"latitude\":37.5031160664852,\"longitude\":127.00843683635581,\"regionCode\":\"1165010700\",\"region1depth\":\"서울특별시\",\"region2depth\":\"서초구\",\"region3depth\":\"반포동\",\"region4depth\":\"\",\"addr1\":\"서울 서초구 반포동 60-4\",\"addr2\":\"서울특별시 서초구 서초중앙로29길 28\",\"memo\":\"달러팝니다.\",\"writer\":\"ADMIN\"}" ^
http://localhost:8080/sp6-mybatis-pro1/selling/saveNewSelling

curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"q_write_sdate\":\"2023-01-01\", \"q_write_edate\":\"2024-12-31\", \"q_title\":\"\", \"q_region_code\":\"1100000000\", \"q_region_depth\":1, \"q_money_code1\":\"JPY\", \"q_amount1_start\":\"\", \"q_amount1_end\":\"20000\", \"q_rowPerPage\":30, \"q_pagingStartNum\":0}" ^
http://localhost:8080/sp6-mybatis-pro1/selling/searchSelling

curl -X GET http://localhost:8080/sp6-mybatis-pro1/selling/selectMultipleResultSet1
curl -X GET http://localhost:8080/sp6-mybatis-pro1/selling/selectMultipleResultSet2
*/

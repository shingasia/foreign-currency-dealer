package com.sp6mybatis.pro1.controllers.system.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sp6mybatis.pro1.config.ServiceConfig;
import com.sp6mybatis.pro1.dto.system.common.CommonCodeDTO;
import com.sp6mybatis.pro1.dto.system.common.RegionCodeDTO;
import com.sp6mybatis.pro1.service.system.common.CommonCodeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.*;

@Controller
@Import(ServiceConfig.class)
// @RequestMapping(value = { "/**/system/common" })
@RequestMapping(value = { "/system/common" })
public class CommonCodeController {

    @Autowired
    private CommonCodeService CommonCodeSvc;
    
    @RequestMapping(value = {"/selectMoneyUnits"}, method=RequestMethod.GET)
    public ResponseEntity<List<CommonCodeDTO>> selectCommonCodeByMainCode(HttpServletRequest request, HttpServletResponse response, Model model, @RequestParam Map<String, Object> paramMap) {
        CommonCodeDTO dto = new CommonCodeDTO();
        dto.setComcode1("002");
        List<CommonCodeDTO> codes = CommonCodeSvc.selectCommonCodeByMainCode(dto);
        return ResponseEntity.status(HttpStatus.OK).body(codes);
    }

    @RequestMapping(value = {"/selectRegion"}, method=RequestMethod.GET)
    public ResponseEntity<List<RegionCodeDTO>> selectRegionCombo(HttpServletRequest request, HttpServletResponse response, Model model, @RequestParam(name = "q_LV", defaultValue = "1") String q_LV, RegionCodeDTO regionCodeDto) {
        int LV = Integer.valueOf(q_LV); // 1 ~ 4
        regionCodeDto.addParam("q_LV", "LV"+LV);
        List<RegionCodeDTO> regions = CommonCodeSvc.selectRegionCombo(regionCodeDto);
        return ResponseEntity.ok(regions);
    }
    /*
    http://localhost:8080/sp6-mybatis-pro1/system/common/selectRegion?q_LV=1
    http://localhost:8080/sp6-mybatis-pro1/system/common/selectRegion?q_LV=2&upRegionCode=1100000000
    http://localhost:8080/sp6-mybatis-pro1/system/common/selectRegion?q_LV=3&upRegionCode=1129000000
    http://localhost:8080/sp6-mybatis-pro1/system/common/selectRegion?q_LV=4&upRegionCode=5111036000
    */
}

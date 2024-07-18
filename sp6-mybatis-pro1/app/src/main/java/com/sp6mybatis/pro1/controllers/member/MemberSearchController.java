package com.sp6mybatis.pro1.controllers.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.sp6mybatis.pro1.config.ServiceConfig;
import com.sp6mybatis.pro1.dto.member.DtoTest1;
import com.sp6mybatis.pro1.dto.member.DtoTest2;
import com.sp6mybatis.pro1.dto.member.Member;
import com.sp6mybatis.pro1.service.member.MemberSearchService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@Import(ServiceConfig.class)
// @RequestMapping(value = "/member", method = { RequestMethod.GET, RequestMethod.POST })
public class MemberSearchController {
    
    // $ ./gradlew tasks 으로 명령 확인
    // $ ./gradlew war 으로 실행후 파일탐색기에서 .war 검색
    @Autowired
    private MemberSearchService memberSearchSvc;

    @RequestMapping(value = {"/member/search"}, method=RequestMethod.GET)
    public String requestMethodName(Model model, @RequestParam(value="id") String id) {
        Member member = memberSearchSvc.searchById(id);
        model.addAttribute("memberInfo", member);
        // Model에 담은 정보는 기본적으로 pageContext, request, session, application 중에서 "request"에 들어간다
        return "member/memberDetail";
    }
    @RequestMapping(value = {"member/urltest1", "member/urltest2"})
    public String requestUrlTest1(HttpServletRequest request, HttpServletResponse response, Model model,
            @RequestParam Map<String, Object> paramMap,
            @RequestParam(name = "p1", defaultValue = "null") String p1,
            @RequestParam(name = "p2", defaultValue = "null") String p2,
            @RequestParam(name = "p3", defaultValue = "null") String p3,
            DtoTest1 paramToDto1,
            DtoTest2 paramToDto2) {
        System.out.println("getRequestURI ==> "+request.getRequestURI());
        System.out.println("getRequestURL ==> "+request.getRequestURL());
        
        // 방법1 HttpServletRequest로 받기
        Map<String, String[]> params = request.getParameterMap();
		for(Map.Entry<String, String[]> entry : params.entrySet()){
			String key = entry.getKey();
			String[] values = entry.getValue();
			System.out.println("key : "+key+", value : "+values[0]);
		}
        // 방법2 [@RequestParam + Map] 으로 받기
        for(String strKey : paramMap.keySet()){
            Object strValue = paramMap.get(strKey);
            System.out.println(strKey + " : " + strValue);
        }
        // 방법3 [@RequestParam + 변수] 으로 받기
        System.out.println("p1 ===> "+p1);
        System.out.println("p2 ===> "+p2);
        System.out.println("p3 ===> "+p3);
        // 방법4 DTO 객체로 맵핑해서 받기
        System.out.println(paramToDto1);
        System.out.println(paramToDto2);

        if(request.getRequestURI().equals("/sp6-mybatis-pro1/member/urltest1")) {
            model.addAttribute("memList", memberSearchSvc.selectMemberAll());
            return "member/urltest1";
        }else if(request.getRequestURI().equals("/sp6-mybatis-pro1/member/urltest2")) {
            model.addAttribute("memList", memberSearchSvc.selectMemberAll());
            return "member/urltest2";
        }
        return "redirect:/";
    }
    // curl ^
    // -X POST ^
    // -H "Accept: */*" ^
    // -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" ^
    // -d "p1=HELLOWORLD/Main&p2=1020304050&p3=TESTDATA_P3&p4=TESTDATA_P4&p5=3.14159265" ^
    // http://localhost:8080/sp6-mybatis-pro1/member/urltest1

    // curl -X GET "http://localhost:8080/sp6-mybatis-pro1/member/urltest1?p1=HELLOWORLD/Main&p2=1020304050&p3=TESTDATA_P3&p4=TESTDATA_P4&p5=3.14159265"

}

package com.sp6mybatis.pro1.controllers.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Controller;

import com.sp6mybatis.pro1.config.ServiceConfig;
import com.sp6mybatis.pro1.dto.member.Member;
import com.sp6mybatis.pro1.service.member.MemberRegisterService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@Import(ServiceConfig.class)
public class MemberJoinController {
    
    @Autowired
    private MemberRegisterService memberRegisterSvc;

    @RequestMapping(path = "/member/join", method = {RequestMethod.POST})
    public ModelAndView insertNewMember(@RequestParam Map<String, Object> paramMap) {
        Member mem = new Member();
        mem.setId((String)paramMap.get("id"));
        mem.setPasswd((String)paramMap.get("passwd"));
        mem.setName((String)paramMap.get("name"));
        mem.setAge(Integer.valueOf(paramMap.get("age")+""));
        mem.setPoint_1(Double.valueOf(paramMap.get("point_1")+""));
        mem.setPoint_2(Double.valueOf(paramMap.get("point_2")+""));
        mem.setPoint_3(Double.valueOf(paramMap.get("point_3")+""));
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.of(9999, 12, 31, 23, 59, 59, 999999);
        mem.setsDate(now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS")));
        mem.seteDate(endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS")));
        mem.setMemo((String)paramMap.get("memo"));
        long newSeq = memberRegisterSvc.insertNewMember(mem);
        mem.setSeq(newSeq);
        System.out.println(mem);
        
        ModelAndView mav = new ModelAndView();
        mav.addObject("memberInfo", mem);
        mav.setViewName("main");
        return mav;
    }
    // curl ^
    // -X POST ^
    // -H "Accept: */*" ^
    // -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" ^
    // -d "id=아이디8&passwd=비밀번호8&name=이름6&age=28&point_1=123.123&point_2=123.123&point_3=123.123&memo=메모8" ^
    // http://localhost:8080/sp6-mybatis-pro1/member/join
}

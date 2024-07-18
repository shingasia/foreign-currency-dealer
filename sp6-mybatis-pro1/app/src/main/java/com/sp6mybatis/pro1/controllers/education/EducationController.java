package com.sp6mybatis.pro1.controllers.education;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
public class EducationController {
    
    @RequestMapping(path = "/education/register")
    public String registerEducation(HttpServletRequest request, Map<String, Object> paramMap, Model model) {
        return "education/register";
    }
}

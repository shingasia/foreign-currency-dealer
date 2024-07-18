package com.sp6mybatis.pro1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import com.sp6mybatis.pro1.controllers.member.MemberJoinController;
import com.sp6mybatis.pro1.controllers.member.MemberSearchController;

@Configuration
@ComponentScan(basePackages = "com.sp6mybatis.pro1.controllers") // com.sp6mybatis.pro1.controllers 로 지정하면 왜 안되는지...
public class ControllerConfig {
    
    @Bean
    public MemberSearchController memberSearchController() {
        MemberSearchController ctrl = new MemberSearchController();
        return ctrl;
    }

    // @Bean
    // public MemberJoinController memberJoinController() {
    //     return new MemberJoinController();
    // }
}

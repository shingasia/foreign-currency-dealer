package com.sp6mybatis.pro1.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScans;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScans(value = {
    @ComponentScan(basePackages = {"com.sp6mybatis.pro1.service.member"}),
    @ComponentScan(basePackages = {"com.sp6mybatis.pro1.service.education"}),
    @ComponentScan(basePackages = {"com.sp6mybatis.pro1.service.system.common"}),
    @ComponentScan(basePackages = {"com.sp6mybatis.pro1.service.selling"})
})
public class ServiceConfig {
    
}

package com.sp6mybatis.pro1.config;

import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import jakarta.servlet.Filter;

public class DispatcherInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { DBConfig.class, ControllerConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { DBConfig.class, ServiceConfig.class, ControllerConfig.class, WebConfig.class, DaoConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{ "/" };
    }
    // @Override
    // protected Filter[] getServletFilters() {
    //     // CharacterEncodingFilter cef = new CharacterEncodingFilter();
    //     // cef.setEncoding("UTF-8");
    //     // cef.setForceEncoding(true);
    //     // return new Filter[] { cef };
    //     return super.getServletFilters();
    // }
    
}

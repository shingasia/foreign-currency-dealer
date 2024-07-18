package com.sp6mybatis.pro1.config;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.sp6mybatis.pro1.dao.education.EducationDao;
import com.sp6mybatis.pro1.dao.member.MemberDao;
import com.sp6mybatis.pro1.dao.selling.SellingDao;
import com.sp6mybatis.pro1.dao.system.common.CommonCodeDao;
import com.sp6mybatis.pro1.dao.system.common.RegionCodeDao;

@Configuration
@Import(DBConfig.class)
public class DaoConfig {
    
    @Autowired
    @Qualifier("sqlSessionTemplate")
    private SqlSession sqlSession;

    @Bean
    public MemberDao memberDao() {
        MemberDao memberDao = new MemberDao();
        memberDao.setSqlSession(sqlSession);
        return memberDao;
    }
    @Bean
    public EducationDao educationDao() {
        EducationDao eduDao = new EducationDao();
        eduDao.setSqlSession(sqlSession);
        return eduDao;
    }
    @Bean
    public CommonCodeDao commonCodeDao() {
        CommonCodeDao dao = new CommonCodeDao();
        dao.setSqlSession(sqlSession);
        return dao;
    }
    @Bean
    public RegionCodeDao regionCodeDao() {
        RegionCodeDao dao = new RegionCodeDao();
        dao.setSqlSession(sqlSession);
        return dao;
    }
    @Bean
    public SellingDao sellingDao() {
        SellingDao dao = new SellingDao();
        dao.setSqlSession(sqlSession);
        return dao;
    }
}

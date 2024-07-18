package com.sp6mybatis.pro1.dao.education;

import org.apache.ibatis.session.SqlSession;

import com.sp6mybatis.pro1.dto.education.EducationDTO1;
import java.util.List;

public class EducationDao {
    private SqlSession sqlSession;

    public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }
    
    public List<EducationDTO1> selectEducationAll() {
        List<EducationDTO1> eduList = sqlSession.selectList("EducationNS.selectEducationAll");
        return eduList;
    }
}

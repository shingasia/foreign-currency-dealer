package com.sp6mybatis.pro1.dao.system.common;

import org.apache.ibatis.session.SqlSession;

import com.sp6mybatis.pro1.dto.member.Member;
import com.sp6mybatis.pro1.dto.system.common.CommonCodeDTO;
import java.util.List;

public class CommonCodeDao {
    private SqlSession sqlSession;

    public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    public List<CommonCodeDTO> selectCommonCodeByMainCode(CommonCodeDTO commonCodeDto) {
        List<CommonCodeDTO> list = sqlSession.selectList("COMMON_CODE_NS.selectCommonCodeByMainCode", commonCodeDto);
        return list;
    }

    
}
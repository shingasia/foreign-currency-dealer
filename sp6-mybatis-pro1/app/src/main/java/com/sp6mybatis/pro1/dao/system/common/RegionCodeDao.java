package com.sp6mybatis.pro1.dao.system.common;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

import com.sp6mybatis.pro1.dto.system.common.RegionCodeDTO;

public class RegionCodeDao {
    
    private SqlSession sqlSession;

    public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }
    
    public List<RegionCodeDTO> selectRegionCombo(RegionCodeDTO regionCodeDto) {
        List<RegionCodeDTO> list = sqlSession.selectList("REGION_NS.selectRegionCombo", regionCodeDto);
        return list;
    }
}

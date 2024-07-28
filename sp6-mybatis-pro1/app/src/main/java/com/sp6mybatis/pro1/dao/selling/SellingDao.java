package com.sp6mybatis.pro1.dao.selling;

import org.apache.ibatis.session.SqlSession;

import com.sp6mybatis.pro1.dto.selling.SellingDTO;
import java.util.*;

public class SellingDao {
    
    private SqlSession sqlSession;

    public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    public SellingDTO insertNewSelling(SellingDTO sellingDto) {
        // int rows = sqlSession.insert("SELLING_NS.insertNewSelling", sellingDto);
        SellingDTO result = sqlSession.selectOne("SELLING_NS.insertNewSelling", sellingDto);
        return result;
    }

    public List<SellingDTO> selectSellingList(SellingDTO sellingDto) {
        return sqlSession.selectList("SELLING_NS.selectSellingList", sellingDto);
    }

    public int selectSellingListCount(SellingDTO sellingDto) {
        return sqlSession.selectOne("SELLING_NS.selectSellingListCount", sellingDto);
    }

    public List<List<Map<String, Object>>> selectMultipleResultSet1() {
        return sqlSession.selectList("SELLING_NS.selectMultipleResultSet1");
    }

    public List<List<Map<String, Object>>> selectMultipleResultSet2() {
        return sqlSession.selectList("SELLING_NS.selectMultipleResultSet2");
    }
}

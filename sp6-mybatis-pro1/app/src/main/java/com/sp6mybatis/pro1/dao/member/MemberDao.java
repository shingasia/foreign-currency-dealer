package com.sp6mybatis.pro1.dao.member;

import org.apache.ibatis.session.SqlSession;
import com.sp6mybatis.pro1.dto.member.Member;
import java.util.List;

public class MemberDao {

    private SqlSession sqlSession;

    public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }
    
    public Member selectById(String id) {
        Member member = sqlSession.selectOne("MemberNS.selectById", id);
        return member;
    }
    public List<Member> selectMemberAll() {
        List<Member> list = sqlSession.selectList("MemberNS.selectMemberAll");
        return list;
    }
    public int insertNewMember(Member mem) {
        return this.sqlSession.insert("MemberNS.insertNewMember", mem);
    }
}

package com.sp6mybatis.pro1.service.member;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;

import com.sp6mybatis.pro1.config.DaoConfig;
import com.sp6mybatis.pro1.dao.member.MemberDao;
import com.sp6mybatis.pro1.dto.member.Member;

@Service("memberRegisterService")
@Import(DaoConfig.class)
public class MemberRegisterService {

    @Autowired
    private MemberDao memberDao;
    
    public int insertNewMember(Member mem) {
        return memberDao.insertNewMember(mem);
    }
}

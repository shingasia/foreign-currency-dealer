package com.sp6mybatis.pro1.service.member;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;

import com.sp6mybatis.pro1.config.DaoConfig;
import com.sp6mybatis.pro1.config.DaoConfig;
import com.sp6mybatis.pro1.dao.member.MemberDao;
import com.sp6mybatis.pro1.dto.member.Member;

import java.util.List;

@Service("memberSearchService")
@Import(DaoConfig.class)
public class MemberSearchService {
    
    @Autowired
    private MemberDao memberDao;

    public Member searchById(String id) {
        Member member = memberDao.selectById(id);
        if(member == null) {
            System.out.println("존재하지 않습니다.");
        }
        return member;
    }
    public List<Member> selectMemberAll() {
        return memberDao.selectMemberAll();
    }
}

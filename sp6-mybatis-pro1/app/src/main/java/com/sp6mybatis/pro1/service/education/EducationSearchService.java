package com.sp6mybatis.pro1.service.education;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;

import com.sp6mybatis.pro1.config.DaoConfig;
import com.sp6mybatis.pro1.dao.education.EducationDao;
import com.sp6mybatis.pro1.dto.education.EducationDTO1;
import java.util.List;

@Service("educationSearchService")
@Import(DaoConfig.class)
public class EducationSearchService {
    @Autowired
    private EducationDao eduDao;

    public List<EducationDTO1> selectEducationAll() {
        return eduDao.selectEducationAll();
    }
}

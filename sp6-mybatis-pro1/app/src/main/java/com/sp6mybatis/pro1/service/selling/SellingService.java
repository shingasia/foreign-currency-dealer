package com.sp6mybatis.pro1.service.selling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;

import com.sp6mybatis.pro1.config.DaoConfig;
import com.sp6mybatis.pro1.dao.selling.SellingDao;
import com.sp6mybatis.pro1.dto.selling.SellingDTO;

import java.util.*;

@Service("sellingService")
@Import(DaoConfig.class)
public class SellingService {
    @Autowired
    private SellingDao sellingDao;
    
    public SellingDTO insertNewSelling(SellingDTO sellingDto) {
        return sellingDao.insertNewSelling(sellingDto);
    }

    public List<SellingDTO> selectSellingList(SellingDTO sellingDto) {
        return sellingDao.selectSellingList(sellingDto);
    }
    public int selectSellingListCount(SellingDTO sellingDto) {
        return sellingDao.selectSellingListCount(sellingDto);
    }
    public List<List<Map<String, Object>>> selectMultipleResultSet1() {
        return sellingDao.selectMultipleResultSet1();
    }
    public List<List<Map<String, Object>>> selectMultipleResultSet2() {
        return sellingDao.selectMultipleResultSet2();
    }
}

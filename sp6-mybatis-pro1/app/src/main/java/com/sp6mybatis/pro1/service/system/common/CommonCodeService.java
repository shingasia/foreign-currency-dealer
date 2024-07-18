package com.sp6mybatis.pro1.service.system.common;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;

import com.sp6mybatis.pro1.config.DaoConfig;
import com.sp6mybatis.pro1.dao.system.common.CommonCodeDao;
import com.sp6mybatis.pro1.dao.system.common.RegionCodeDao;
import com.sp6mybatis.pro1.dto.system.common.CommonCodeDTO;
import com.sp6mybatis.pro1.dto.system.common.RegionCodeDTO;

@Service("commonCodeService")
@Import(DaoConfig.class)
public class CommonCodeService {
    
    @Autowired
    private CommonCodeDao commonCodeDao;
    @Autowired
    private RegionCodeDao regionCodeDao;

    public List<CommonCodeDTO> selectCommonCodeByMainCode(CommonCodeDTO commonCodeDto) {
        List<CommonCodeDTO> list = commonCodeDao.selectCommonCodeByMainCode(commonCodeDto);
        return list;
    }

    public List<RegionCodeDTO> selectRegionCombo(RegionCodeDTO regionCodeDto) {
        List<RegionCodeDTO> list = regionCodeDao.selectRegionCombo(regionCodeDto);
        return list;
    }
}

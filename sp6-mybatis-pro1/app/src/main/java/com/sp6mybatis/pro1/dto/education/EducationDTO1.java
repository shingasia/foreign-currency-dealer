package com.sp6mybatis.pro1.dto.education;
/*
CREATE TABLE post_education (
	seq                 INT AUTO_INCREMENT,
	edu_subject         VARCHAR(100)    COMMENT '교육주제',
	edu_state           VARCHAR(50)     COMMENT '접수상태 (접수대기/접수중/접수마감)',
	edu_organization    VARCHAR(100)    COMMENT '교육기관(누리집)',
	edu_target          VARCHAR(100)    COMMENT '교육대상',
	edu_apply_sdate     VARCHAR(30)     COMMENT '신청기간(시작)',
	edu_apply_edate     VARCHAR(30)     COMMENT '신청기간(종료)',
	edu_running_sdate   DATETIME(6)     COMMENT '운영기간(시작)',
	edu_running_edate   DATETIME(6)     COMMENT '운영기간(종료)',
	edu_receipt_gbn     VARCHAR(50)     COMMENT '접수구분',
	edu_recruit_number  INT             COMMENT '모집인원',
	edu_location        VARCHAR(255)    COMMENT '장소',
	edu_inquiry_call    VARCHAR(50)     COMMENT '문의전화',
	PRIMARY KEY(seq)
);
*/
public class EducationDTO1 {
    private int seq;
    // 교육주제
    private String eduSubject;
    // 접수상태 (접수대기/접수중/접수마감)
    private String eduState;
    // 교육기관(누리집)
    private String eduOrganization;
    // 교육대상
    private String eduTarget;
    // 신청기간(시작)
    private String eduApplySdate;
    // 신청기간(종료)
    private String eduApplyEdate;
    // 운영기간(시작)
    private String eduRunningSdate;
    // 운영기간(종료)
    private String eduRunningEdate;
    // 접수구분
    private String eduReceiptGbn;
    // 모집인원
    private int eduRecruitNumber;
    // 장소
    private String eduLocation;
    // 문의전화
    private String eduInquiryCall;
    
    // 나머지 추가 데이터
    private String metaData1;
    private String metaData2;
    private String metaData3;

    // Getter / Setter
    public int getSeq() {
        return seq;
    }
    public void setSeq(int seq) {
        this.seq = seq;
    }
    public String getEduSubject() {
        return eduSubject;
    }
    public void setEduSubject(String eduSubject) {
        this.eduSubject = eduSubject;
    }
    public String getEduState() {
        return eduState;
    }
    public void setEduState(String eduState) {
        this.eduState = eduState;
    }
    public String getEduOrganization() {
        return eduOrganization;
    }
    public void setEduOrganization(String eduOrganization) {
        this.eduOrganization = eduOrganization;
    }
    public String getEduTarget() {
        return eduTarget;
    }
    public void setEduTarget(String eduTarget) {
        this.eduTarget = eduTarget;
    }
    public String getEduApplySdate() {
        return eduApplySdate;
    }
    public void setEduApplySdate(String eduApplySdate) {
        this.eduApplySdate = eduApplySdate;
    }
    public String getEduApplyEdate() {
        return eduApplyEdate;
    }
    public void setEduApplyEdate(String eduApplyEdate) {
        this.eduApplyEdate = eduApplyEdate;
    }
    public String getEduRunningSdate() {
        return eduRunningSdate;
    }
    public void setEduRunningSdate(String eduRunningSdate) {
        this.eduRunningSdate = eduRunningSdate;
    }
    public String getEduRunningEdate() {
        return eduRunningEdate;
    }
    public void setEduRunningEdate(String eduRunningEdate) {
        this.eduRunningEdate = eduRunningEdate;
    }
    public String getEduReceiptGbn() {
        return eduReceiptGbn;
    }
    public void setEduReceiptGbn(String eduReceiptGbn) {
        this.eduReceiptGbn = eduReceiptGbn;
    }
    public int getEduRecruitNumber() {
        return eduRecruitNumber;
    }
    public void setEduRecruitNumber(int eduRecruitNumber) {
        this.eduRecruitNumber = eduRecruitNumber;
    }
    public String getEduLocation() {
        return eduLocation;
    }
    public void setEduLocation(String eduLocation) {
        this.eduLocation = eduLocation;
    }
    public String getEduInquiryCall() {
        return eduInquiryCall;
    }
    public void setEduInquiryCall(String eduInquiryCall) {
        this.eduInquiryCall = eduInquiryCall;
    }
    public String getMetaData1() {
        return metaData1;
    }
    public void setMetaData1(String metaData1) {
        this.metaData1 = metaData1;
    }
    public String getMetaData2() {
        return metaData2;
    }
    public void setMetaData2(String metaData2) {
        this.metaData2 = metaData2;
    }
    public String getMetaData3() {
        return metaData3;
    }
    public void setMetaData3(String metaData3) {
        this.metaData3 = metaData3;
    }
    @Override
    public String toString() {
        return "EducationDTO1 [seq=" + seq + ", eduSubject=" + eduSubject + ", eduState=" + eduState
                + ", eduOrganization=" + eduOrganization + ", eduTarget=" + eduTarget + ", eduApplySdate="
                + eduApplySdate + ", eduApplyEdate=" + eduApplyEdate + ", eduRunningSdate=" + eduRunningSdate
                + ", eduRunningEdate=" + eduRunningEdate + ", eduReceiptGbn=" + eduReceiptGbn + ", eduRecruitNumber="
                + eduRecruitNumber + ", eduLocation=" + eduLocation + ", eduInquiryCall=" + eduInquiryCall
                + ", metaData1=" + metaData1 + ", metaData2=" + metaData2 + ", metaData3=" + metaData3 + "]";
    }
}

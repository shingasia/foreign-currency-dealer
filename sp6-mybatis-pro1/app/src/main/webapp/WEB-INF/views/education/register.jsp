<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
	<title>교육등록(담당자)</title>
</head>
<body>
    <div class="div_edu_inputs_container">
        <div class="div_edu_inputs_subject">
            교육주제 : <input type="text" name="edu_subject" />
        <div>
        <input type="hidden" name="edu_state" value="01"/>
        <div class="div_edu_inputs_organization">
            교육기관(누리집) :
            <select name="edu_organization">
                <option value="공보담당관">공보담당관</option>
                <option value="교육협력담당관">교육협력담당관</option>
                <option value="정책관">정책관</option>
                <option value="감사관">감사관</option>
                <option value="교육혁신과">교육혁신과</option>
                <option value="초등교육과">초등교육과</option>
                <option value="중등교육과">중등교육과</option>
                <option value="유아특수교육과">유아특수교육과</option>
                <option value="미래교육과">미래교육과</option>
                <option value="체육예술건강과">체육예술건강과</option>
                <option value="민주시민교육과">민주시민교육과</option>
                <option value="총무과">총무과</option>
                <option value="재정복지과">재정복지과</option>
                <option value="노사협력과">노사협력과</option>
                <option value="교육시설과">교육시설과</option>
                <option value="안전총괄과">안전총괄과</option>
                <option value="교육여건개선과">교육여건개선과</option>
                <option value="그린스마트미래학교추진단">그린스마트미래학교추진단</option>
            </select>
        <div>
    </div>
</body>
</html>
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



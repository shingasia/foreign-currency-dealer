<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
	<title>테스트 페이지</title>
</head>
<body>
    <h2>하위하위</h2>
    정보 : ${memberInfo.toString()} <br/>
    아이디 : ${memberInfo.id} <br/>
    컨텍스트 : <%= request.getContextPath() %><br/>
    <%= pageContext.getClass().getName() %><br/>     <%-- org.apache.jasper.runtime.PageContextImpl --%>
    <%= request.getClass().getName() %><br/>         <%-- org.apache.catalina.core.ApplicationHttpRequest --%>
    <%= session.getClass().getName() %><br/>         <%-- org.apache.catalina.session.StandardSessionFacade --%>
    <%= application.getClass().getName() %><br/>     <%-- org.apache.catalina.core.ApplicationContextFacade --%>
    <%= application.getContextPath() %><br/>         <%-- /sp6-mybatis-pro1 --%>
    <%= application.getRealPath("/member/search") %><br/>
    <%-- C:\Users\skdsk\VSCODE-WORKS\Spring-Codes\sp6-mybatis-pro1\app\build\inplaceWebapp\member\search --%>
    ${pageContext.request.contextPath}<br/>          <%-- /sp6-mybatis-pro1 --%>
    ${pageContext["request"]["requestURI"]}<br/>     <%-- /sp6-mybatis-pro1/WEB-INF/views/member/memberDetail.jsp --%>
    pageScope : ${pageScope.memberInfo}<br/>
    requestScope : ${requestScope.memberInfo}<br/>
    sessionScope : ${sessionScope.memberInfo}<br/>
    applicationScope : ${applicationScope.memberInfo}<br/>
</body>
</html>
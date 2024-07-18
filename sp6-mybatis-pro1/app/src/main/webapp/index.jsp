<!DOCTYPE html>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<html>
	<head>
		<meta charset="utf-8">
		<title>Welcome</title>
	</head> 
	<body>
		<h2>index 페이지</h2>
        ${pageContext.servletContext.serverInfo} <br/>
        ${pageContext.request.contextPath}
	</body>
</html>
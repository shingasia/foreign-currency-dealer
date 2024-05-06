<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="org.json.*" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="EUC-KR">
<title>Insert title here</title>
</head>
<body>
<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");

response.setHeader("Access-Control-Allow-Origin", "*");

/*
application/x-www-form-urlencoded 헤더 타입이면서 HTTP POST 요청 시
-> getParameter("data") 와 같은 방법으로 추출 가능
text/plain 헤더 타입이면서 HTTP POST 요청 시
-> getParameter("data") 와 같은 방법으로 데이터 추출 불가능
-> request body를 stream을 이용하여 읽어와야 함.
*/
%>

<%
	Map<String, String[]> params = request.getParameterMap();
	for(Map.Entry<String, String[]> entry : params.entrySet()){
		String key = entry.getKey();
		String[] values = entry.getValue();
		System.out.println("key : "+key+", value : "+values[0]);
	}
	String sellId = request.getParameter("sell_id");
	
	System.out.println("sellId : "+sellId);
%>
</body>
</html>
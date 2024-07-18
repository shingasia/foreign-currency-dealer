<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
	<title>테스트 페이지</title>
</head>
<body>
    ${memList[0].seq lt memList[1].seq ? "yes" : "no"}<br/>
    ${memList[5] == null ? "O" : "X"}
    산술연산자 + - * / % div mod <br/>
    비교연산자 < > <= >= == != lt gt le ge eq ne <br/>
    논리연산자 && || ! and or not <br/>
    조건연산자 ? : <br/>
    엠프티 연산자 empty <br/>
    대괄호와 마침표 연산자 [] .   <%-- 집합 데이터에 있는 한 항목을 선택 --%> <br/>
    괄호 ()                      <%-- 연산자의 우선순위 지정 --%> <br/>
</body>
</html>
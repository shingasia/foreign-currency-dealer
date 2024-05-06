<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.io.*, java.net.*, java.sql.*, java.time.*" %>
<%@ page import="java.util.function.*, java.util.stream.*" %>
<%@ page import="commonpkg.dao.*" %>
<%@ page import="org.json.*" %>

<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");

response.setHeader("Access-Control-Allow-Origin", "*");
response.setContentType("application/json");
%>

<%!
/*
인증번호 확인 함수
@param email : 이메일
@param verificationCode : 인증번호
*/
public String verifyEmail(HttpServletRequest request, String email, String verificationCode) {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	boolean certResult      = false;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		sql = " SELECT EXISTS( "
			+ "    SELECT A.verification_code "
			+ "    FROM email_send_log AS A "
			+ "    WHERE A.member_email      = ? "
			+ "    AND   A.verification_code = ? "
			+ "    AND   NOW(6) BETWEEN A.available_stime AND A.available_etime "
			+ " ) AS certOK; ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, email);
		pstmt.setString(2, verificationCode);
		rs = pstmt.executeQuery();
		certResult = (jdbcDao.getDataOne(rs).get("certOK").equals("1") ? true : false);
		
		return "{'certificated' : "+certResult+"}";
		
	}catch(Exception e){
		System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
		return "{'certificated' : false}";
	}finally{
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
}
%>
<%
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"email\" : \"shingasia@kakao.com\", \"verificationCode\" : \"123123\"}" ^
http://localhost:8080/MyWeb1/member/join/MailCertService.jsp
*/
// POST로 받은 데이터 읽기
String paramData    = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
JSONObject paramObj = new JSONObject(paramData);
String email = paramObj.get("email")+"";
String verificationCode = paramObj.get("verificationCode")+"";
//flush()와 다르게 clear(), clearBuffer()는 클라이언트에 내용을 쓰지 않고 버퍼를 비운다.
out.clear();
out.clearBuffer();
PrintWriter pw = response.getWriter();
pw.print(new JSONObject(this.verifyEmail(request, email, verificationCode)));
%>

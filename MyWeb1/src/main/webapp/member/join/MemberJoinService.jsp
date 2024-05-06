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
%>
<%--
넘어올 데이터의 예시
{
    "id": "hello",
    "passwd": "paswordhello",
    "email": "email@mynature.go.kr",
    "name": "Olivia",
    "birthday": "1996-05-20",
    "zipcode": "22739",
    "roadAddress": "인천 서구 청라에메랄드로 84",
    "jibunAddress": "인천 서구 청라동 167-17",
    "detailAddress": "XX동 YY호",
    "extraAddress": " (청라동)",
    "phone": "01011112222",
    "memo": "안녕하세요 반갑습니다."
}
--%>
<%!
public JSONObject registerMember(HttpServletRequest request) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	JSONObject rtn          = null;
	JSONObject paramObj     = null;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		String paramData = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
		paramObj = new JSONObject(paramData);
		
		sql = " INSERT INTO member ( "
			+ "    seq, id, passwd, email, name, birthday, zipcode, addr1, addr2, phone ,sdate, edate, dormant_YN, memo "
			+ " ) VALUES ( "
			+ "    DEFAULT, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), \'N\', ?  "
			+ " ) RETURNING seq, id, name; ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, paramObj.getString("id"));
		pstmt.setString(2, paramObj.getString("passwd"));
		pstmt.setString(3, paramObj.getString("email"));
		pstmt.setString(4, paramObj.getString("name"));
		pstmt.setString(5, paramObj.getString("birthday").replace("-", ""));
		pstmt.setString(6, paramObj.getString("zipcode"));
		pstmt.setString(7,
			paramObj.getString("roadAddress")+paramObj.getString("detailAddress")+"\n"
			+paramObj.getString("jibunAddress")
		);
		pstmt.setString(8, paramObj.getString("detailAddress"));
		pstmt.setString(9, paramObj.getString("phone"));
		pstmt.setString(10, paramObj.getString("memo"));
		
		rs = pstmt.executeQuery();
		rtn = jdbcDao.getDataOneJSON(rs, true);
		
		
	}catch(Exception e){
		throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally{
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	return rtn;
}
%>

<%
try{
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"id\": \"hello\",\"passwd\": \"paswordhello\",\"email\": \"email@mynature.go.kr\",\"name\": \"Olivia\",\"birthday\": \"1996-05-20\",\"zipcode\": \"22739\",\"roadAddress\": \"인천 서구 청라에메랄드로 84\",\"jibunAddress\": \"인천 서구 청라동 167-17\",\"detailAddress\": \"XX동 YY호\",\"extraAddress\": \" (청라동)\",\"phone\": \"01011112222\",\"memo\": \"안녕하세요 반갑습니다.\"}" ^
http://localhost:8080/MyWeb1/member/join/MemberJoinService.jsp
*/
	out.clear();
	out.clearBuffer();
	out.write(this.registerMember(request).toString());
}catch(Exception e){}
%>


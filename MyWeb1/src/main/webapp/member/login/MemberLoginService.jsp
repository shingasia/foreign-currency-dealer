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

<%!
// HttpSession s = request.getSession(); // session 내장변수와 같은 객체이다.
public JSONObject login(HttpServletRequest req, HttpSession session) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	JSONObject rtn          = null;
	JSONObject paramObj     = null;
	
	
	String paramData = new BufferedReader(req.getReader()).lines().collect(Collectors.joining(""));
	paramObj = new JSONObject(paramData);
	String id     = paramObj.getString("id");
	String passwd = paramObj.getString("passwd");
	
	// 이미 로그인 되어있다면?
	if(session.getAttribute(id) != null){
		rtn = new JSONObject("{\"ErrCode\" : \"E00001\", \"ErrMsg\" : \"이미 로그인 상태입니다.\"}");
	}else {
		try{
			jdbcDao = new JDBCConnector();
			conn = jdbcDao.getConnection();
			
			sql = " SELECT A.SEQ AS SEQ, A.id AS ID, A.name AS NAME "
				+ " FROM   member AS A "
				+ " WHERE  A.id     = ? "
				+ " AND    A.passwd = SHA2(?, 256); ";
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, id);
			pstmt.setString(2, passwd);
			rs = pstmt.executeQuery();
			rtn = jdbcDao.getDataOneJSON(rs, true);
			
			if(rtn == null) { // ID, PW 불일치
				rtn = new JSONObject("{\"ErrCode\" : \"E00002\", \"ErrMsg\" : \"아이디와 비밀번호를 다시 확인해주세요.\"}");
			}else {
				// session 저장
				session.setAttribute(id, id);
				session.setMaxInactiveInterval(60 * 60);
			}
			
		}catch(Exception e){
			throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
		}finally{
			try{
				jdbcDao.clearConnection(rs, pstmt);
			}catch(SQLException | NullPointerException e){ }
		}
	}
	return rtn;
}

%>

<%
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"id\": \"ab\",\"passwd\": \"ab\"}" ^
http://localhost:8080/MyWeb1/member/login/MemberLoginService.jsp
*/
try {
	out.clear();
	out.clearBuffer();
	out.write(this.login(request, session).toString());
}catch (Exception e){ }
%>

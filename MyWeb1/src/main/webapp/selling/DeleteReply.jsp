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
public JSONObject deleteReplyById(HttpServletRequest request) throws Exception {
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
		
		// 자기자신을 포함하여 하위 댓글 모두 삭제
		sql = " DELETE A "
			+ " FROM   selling_replys AS A "
			+ " WHERE  A.sell_id = ? "
			+ " AND    A.reply_code LIKE ?; ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, paramObj.getInt("sell_id"));
		pstmt.setString(2, paramObj.getString("reply_code").substring(0, paramObj.getInt("level") * 5)+"%");
		pstmt.executeUpdate();
		
		
	}catch(Exception e){
		try{
			conn.rollback();
		}catch(SQLException se){ }
		
		throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally{
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	
	return paramObj;
}
%>

<%
/*
curl ^
-X POST ^
-H "Content-Type: application/json" ^
-d "{'sell_id':3000, 'reply_code':'0000200002000040000000000','level':3}" ^
http://localhost:8080/MyWeb1/selling/DeleteReply.jsp
*/
try{
	out.clear();
    out.clearBuffer();
    out.write(this.deleteReplyById(request).toString());
}catch(Exception e){ 
	out.write("{'ErrMsg':'"+e.getMessage()+"'}");
}
%>
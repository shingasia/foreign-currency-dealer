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
public JSONArray getMoneyUnits(HttpServletRequest request) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	JSONArray rtn           = null;
	JSONObject paramObj     = null;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		/*
		String paramData = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
		paramObj = new JSONObject(paramData);
		*/
		sql = " SELECT money_code, CONCAT(money_name,' (',money_code,')') AS money_name "
			+ " FROM money_units "
			+ " ORDER BY money_code ASC; ";
		
		pstmt = conn.prepareStatement(sql);
		rs = pstmt.executeQuery();
		rtn = jdbcDao.getDataManyJSON(rs, true);
		
		
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
/*
curl ^
-X GET ^
-H "Content-Type: text/plain" ^
-H "Accept: application/json" ^
http://localhost:8080/MyWeb1/common/SelectMoneyUnits.jsp
*/
try {
	out.clear();
	out.clearBuffer();
	out.write(this.getMoneyUnits(request).toString());
}catch(Exception e) {
	System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
}
%>
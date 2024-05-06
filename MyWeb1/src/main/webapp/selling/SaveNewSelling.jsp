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
public JSONObject registerSelling(HttpServletRequest request) throws Exception {
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
		
		sql = " INSERT INTO foreign_currency_selling ( "
			+ "    sell_id, title, money_code1, amount1, money_code2, "
			+ "    amount2, latitude, longitude, region_code, region_1depth, "
			+ "    region_2depth, region_3depth, region_4depth, addr1, addr2, "
			+ "    memo, writer, write_date, updater, update_date, "
			+ "    sold_yn "
			+ " ) VALUES ( "
			+ "    DEFAULT, ?, ?, ?, ?, "
			+ "    ?, ?, ?, ?, ?, "
			+ "    ?, ?, ?, ?, ?, "
			+ "    ?, ?, NOW(6), NULL, NULL, "
			+ "    0 "
			+ " ) RETURNING sell_id; ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, paramObj.getString("title"));
		pstmt.setString(2, paramObj.getString("money_code1"));
		pstmt.setLong(3, paramObj.getLong("amount1"));
		pstmt.setString(4, paramObj.getString("money_code2"));
		pstmt.setLong(5, paramObj.getLong("amount2"));
		pstmt.setDouble(6, paramObj.getDouble("latitude"));
		pstmt.setDouble(7, paramObj.getDouble("longitude"));
		pstmt.setString(8, paramObj.getString("region_code"));
		pstmt.setString(9, paramObj.getString("region_1depth"));
		pstmt.setString(10, paramObj.getString("region_2depth"));
		pstmt.setString(11, paramObj.getString("region_3depth"));
		pstmt.setString(12, paramObj.getString("region_4depth"));
		pstmt.setString(13, paramObj.getString("addr1"));
		pstmt.setString(14, paramObj.getString("addr2"));
		pstmt.setString(15, paramObj.getString("memo"));
		pstmt.setString(16, paramObj.getString("writer"));
		
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
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"title\":\"제목\",\"money_code1\":\"USD\",\"amount1\":\"200\",\"money_code2\":\"KRW\",\"amount2\":\"230000\",\"latitude\":37.5031160664852,\"longitude\":127.00843683635581,\"region_code\":\"1165010700\",\"region_1depth\":\"서울특별시\",\"region_2depth\":\"서초구\",\"region_3depth\":\"반포동\",\"region_4depth\":\"\",\"addr1\":\"서울 서초구 반포동 60-4\",\"addr2\":\"서울특별시 서초구 서초중앙로29길 28\",\"memo\":\"달러팝니다.\",\"writer\":"ADMIN"}" ^
http://localhost:8080/MyWeb1/selling/SaveNewSelling.jsp
*/
try {
	out.clear();
	out.clearBuffer();
	out.write(this.registerSelling(request).toString());
}catch(Exception e) { }
%>
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
// 시/군/구
/*
 * gbn : 0(시/도), 1(시/군/구), 2(읍/면/동), 3(리)
 */
public JSONArray getPolygonDensity(HttpServletRequest request) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	JSONArray rtn           = null;
	JSONObject paramObj     = null;
	
	String paramData = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
	paramObj = new JSONObject(paramData);
	
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		switch(paramObj.getInt("gbn")) {
			case 0: break;
			case 1:
				sql = " SELECT "
					+ "     CONCAT(A.region_code,'00000') AS region_code, A.CNT, "
					+ "     (CASE "
					+ "          WHEN A.CNT BETWEEN 0   AND 100 THEN '#ffcc80' "
					+ "          WHEN A.CNT BETWEEN 101 AND 200 THEN '#ffb74d' "
					+ "          WHEN A.CNT BETWEEN 201 AND 300 THEN '#ffa726' "
					+ "          WHEN A.CNT BETWEEN 301 AND 400 THEN '#ff9800' "
					+ "          WHEN A.CNT BETWEEN 401 AND 500 THEN '#fb8c00' "
					+ "          WHEN A.CNT BETWEEN 501 AND 600 THEN '#f57c00' "
					+ "          WHEN A.CNT BETWEEN 601 AND 700 THEN '#ef6c00' "
					+ "          ELSE '#e65100' "
					+ "      END) AS density "
					+ " FROM ( "
					+ "     SELECT LEFT(A.region_code,5) AS region_code, COUNT(*) AS CNT "
					+ "     FROM   foreign_currency_selling AS A "
					+ "     GROUP BY LEFT(A.region_code,5) "
					+ "     ORDER BY LEFT(A.region_code,5) ASC "
					+ " ) AS A; ";
				break;
			case 2: break;
			default: break;
		}
		
		// System.out.println(sql);
		pstmt = conn.prepareStatement(sql);
		rs = pstmt.executeQuery();
		
		rtn = jdbcDao.getDataManyJSON(rs, false);
		
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
-d "{'gbn':1}" ^
http://localhost:8080/MyWeb1/common/SelectPolygonDensity.jsp
*/
try {
	out.clear();
	out.clearBuffer();
	out.write(this.getPolygonDensity(request).toString());
}catch(Exception e) { }
%>
<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="commonpkg.dao.*" %>
<%@ page import="java.util.*, java.io.*, java.net.*, java.sql.*, java.time.*" %>
<%@ page import="java.util.function.*, java.util.stream.*" %>
<%@ page import="org.json.*" %>

<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");

response.setHeader("Access-Control-Allow-Origin", "*");
%>

<%!
/*
 * @param gbn : "LV1" ~ "LV4"
 * @param upRegionCode : 상위 법정구역 코드
 */
public JSONArray getRegionCombo(String gbn, String upRegionCode, HttpServletRequest request) throws Exception {
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
		Map<String, String[]> params = request.getParameterMap();
		for(Map.Entry<String, String[]> entry : params.entrySet()){
			String key = entry.getKey();
			String[] values = entry.getValue();
			System.out.println("key : "+key+", value : "+values[0]);
		}
		*/
		
		switch(gbn){
			case "LV1": // 시/도
				sql = " SELECT A.region_code, A.region_name "
					+ " FROM   region_info AS A "
					+ " WHERE  RIGHT(A.region_code,8) = '00000000' "
					+ " ORDER  BY A.region_code ASC; ";
				break;
			case "LV2": // 시/군/구
				sql = " SELECT A.region_code, A.region_name "
					+ " FROM   region_info AS A "
					+ " WHERE  RIGHT(A.region_code,8) != '00000000' "
					+ " AND    RIGHT(A.region_code,5) = '00000' "
					+ (upRegionCode.length() == 10 ? " AND A.region_code LIKE CONCAT(LEFT('" + upRegionCode + "',2), '%') " : " AND FALSE ")
					+ " ORDER BY A.region_code ASC; ";
				break;
			case "LV3": // 읍/면/동
				sql = " SELECT A.region_code, A.region_name "
					+ " FROM   region_info AS A "
					+ " WHERE  RIGHT(A.region_code,5) != '00000' "
					+ " AND    RIGHT(A.region_code,2) = '00' "
					+ (upRegionCode.length() == 10 ? " AND A.region_code LIKE CONCAT(LEFT('" + upRegionCode + "',5), '%') " : " AND FALSE ")
					+ " ORDER BY A.region_code ASC; ";
				break;
			case "LV4": // 리
				sql = " SELECT A.region_code, A.region_name "
					+ " FROM   region_info AS A "
					+ " WHERE  RIGHT(A.region_code,2) != '00' "
					+ (upRegionCode.length() == 10 ? " AND A.region_code LIKE CONCAT(LEFT('" + upRegionCode + "',8), '%') " : " AND FALSE ")
					+ " ORDER  BY A.region_code ASC; ";
				break;
			default:
				break;
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
curl -X GET "http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV1"
curl -X GET "http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV2&upRegionCode=1100000000"
curl -X GET "http://localhost:8080/MyWeb1/common/SelectRegionCombo.jsp?gbn=LV3&upRegionCode=1129000000"
*/
try {
	String gbn = request.getParameter("gbn");
	String upRegionCode = request.getParameter("upRegionCode");
	out.clear();
	out.clearBuffer();
	out.write(this.getRegionCombo(gbn, upRegionCode, request).toString());
}catch(Exception e) { }
%>
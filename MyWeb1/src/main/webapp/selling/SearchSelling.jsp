<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.io.*, java.net.*, java.sql.*, java.time.*" %>
<%@ page import="java.time.format.*" %>
<%@ page import="java.util.function.*, java.util.stream.*" %>
<%@ page import="commonpkg.dao.*" %>
<%@ page import="org.json.*" %>

<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");

response.setHeader("Access-Control-Allow-Origin", "*");
%>

<%!
// 등록일자, 제목, 지역, 화폐단위
/*
 * @param write_sdate(필수) : YYYY-MM-DD
 * @param write_edate(필수) : YYYY-MM-DD
 * @param title : 제목
 * @param region_code : 법정구역 코드 10자리
 * @param region_depth : 법정동 레벨 (전체지역 -> 0, 시/도 -> 1, 시/군/구 -> 2, 읍/면/동 -> 3, 리 -> 4)
 * @param money_code1 : 판매 화폐 코드
 * @param amount1_start : 판매 금액 시작
 * @param amount1_end : 판매 금액 끝
 */
public JSONArray getSellingList(HttpServletRequest request) throws Exception {
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
		
		String paramData = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
		paramObj = new JSONObject(paramData);
		
		sql = " SELECT "+"\n"
			+ "      A.sell_id, A.title, A.money_code1, A.amount1, A.money_code2, A.amount2 "+"\n"
			+ "	     , CONCAT(A.region_1depth,' ',A.region_2depth,' ',A.region_3depth,' ',A.region_4depth) AS region_name "+"\n"
			+ "      , DATE_FORMAT(A.write_date, '%Y-%m-%d') AS write_date "+"\n"
			+ "      , A.latitude, A.longitude "+"\n"
			+ " FROM   foreign_currency_selling AS A "+"\n"
			+ " WHERE  A.write_date BETWEEN '"+paramObj.getString("write_sdate")+" 00:00:00.000000' AND '"+paramObj.getString("write_edate")+" 23:59:59.999999' "+"\n";
		// 제목
		if(paramObj.getString("title").length() != 0) {
			sql += " AND    A.title LIKE '%"+paramObj.getString("title")+"%'"+"\n";
		}
		// 법정구역 코드
		if(paramObj.getString("region_code").length() != 0) {
			switch(paramObj.getInt("region_depth")) {
				case 1: // 시/도
					sql += " AND    A.region_code LIKE '"+paramObj.getString("region_code").substring(0, 2)+"%'"+"\n";
					break;
				case 2: // 시/군/구
					sql += " AND    A.region_code LIKE '"+paramObj.getString("region_code").substring(0, 5)+"%'"+"\n";
					break;
				case 3: // 읍/면/동
					sql += " AND    A.region_code LIKE '"+paramObj.getString("region_code").substring(0, 8)+"%'"+"\n";
					break;
				case 4: // 리
					sql += " AND    A.region_code = '"+paramObj.getString("region_code")+"%'"+"\n";
					break;
			}
		}
		// 화폐코드
		if(paramObj.getString("money_code1").length() != 0) {
			sql += " AND    A.money_code1 = '"+paramObj.getString("money_code1")+"'"+"\n";
		}
		// 판매금액
		sql += " AND    A.amount1 BETWEEN "+paramObj.getInt("amount1_start")+" AND "+paramObj.getInt("amount1_end")+"\n";
		
		// System.out.println(sql);
		pstmt = conn.prepareStatement(sql);
		rs = pstmt.executeQuery();
		rtn = jdbcDao.getDataManyJSON(rs, false);
		
	}catch(Exception e) {
		throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally {
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	return rtn;
}
%>
<%
/*
LocalDateTime now = LocalDateTime.now();
String now_str1 = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS")); // 2024-04-25 02:00:29.153967
String now_str2 = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd 00:00:00.000000"));
String now_str3 = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd 23:59:59.999999"));
*/


/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"write_sdate\":\"2017-01-01\", \"write_edate\":\"2019-01-01\", \"title\":\"테스트\", \"region_code\":\"5115000000\", \"region_depth\":1, \"money_code1\":\"JPY\", \"amount1_start\":\"20000\", \"amount1_end\":\"25000\"}" ^
http://localhost:8080/MyWeb1/selling/SearchSelling.jsp
*/


try {
	out.clear();
	out.clearBuffer();
	out.write(this.getSellingList(request).toString());
}catch(Exception e) {
	System.out.println(e.getMessage());
}

%>
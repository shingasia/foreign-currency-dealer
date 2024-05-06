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
// response.setHeader("Access-Control-Allow-Headers", "*");
// response.setHeader("Access-Control-Expose-Headers", "*");
// response.setHeader("Access-Control-Max-Age", "1728000");

// response.setHeader("Access-Control-Allow-Credentials", "true");
// response.setHeader("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS");
// response.setHeader("Access-Control-Allow-Headers", "X-PINGOTHER,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization");
// response.addHeader("Access-Control-Expose-Headers", "xsrf-token");
response.setContentType("application/json");
%>
<%!
public JSONObject saveReply(HttpServletRequest request, String charset) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	CallableStatement cstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	int maxPlusOne          = 0;
	String newReplyCode     = null;
	JSONObject rtn          = null;
	Map<String,String> LV_CNT = null;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		// JSON 읽는 방법1
		String data = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
		JSONObject jsonObj = new JSONObject(data);
		
		// 트렌젝션 레벨 변경 및 자동커밋 해제
		conn.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
		conn.setAutoCommit(false);
		
		sql = " SELECT IFNULL((CASE "
			+ "                    WHEN A.level = 1 THEN MAX(SUBSTRING(A.reply_code,1,5)) "
			+ "                    WHEN A.level = 2 THEN MAX(SUBSTRING(A.reply_code,6,5)) "
			+ "                    WHEN A.level = 3 THEN MAX(SUBSTRING(A.reply_code,11,5)) "
			+ "                    WHEN A.level = 4 THEN MAX(SUBSTRING(A.reply_code,16,5)) "
			+ "                    WHEN A.level = 5 THEN MAX(SUBSTRING(A.reply_code,21,5)) "
			+ "                    ELSE NULL "
			+ "        END),0) + 1 AS maxPlusOne "
			+ " FROM   selling_replys AS A "
			+ " WHERE  sell_id = ? "
			+ " AND    A.up_reply_code = ? "
			+ " AND    A.level = ? FOR UPDATE; ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, jsonObj.getInt("sell_id"));
		pstmt.setString(2, jsonObj.getString("up_reply_code"));
		pstmt.setInt(3, jsonObj.getInt("level"));
		
		rs = pstmt.executeQuery();
		// maxPlusOne = jdbcDao.getDataOneJSON(rs, true).getInt("maxPlusOne");
		maxPlusOne = Integer.valueOf(jdbcDao.getDataOne(rs).get("maxPlusOne"));
		
		// 새 댓글코드 생성
		switch(jsonObj.getInt("level")) {
			case 1:
				newReplyCode = ("00000"+maxPlusOne).substring(("00000"+maxPlusOne).length() - 5) // "00000"을 앞에 붙이고 뒤에서 5자리 자르기
							 + "00000000000000000000";
				break;
			case 2:
				newReplyCode = jsonObj.getString("up_reply_code").substring(0, 5)
							 + ("00000"+maxPlusOne).substring(("00000"+maxPlusOne).length() - 5)
							 + "000000000000000";
				break;
			case 3:
				newReplyCode = jsonObj.getString("up_reply_code").substring(0, 10)
							 + ("00000"+maxPlusOne).substring(("00000"+maxPlusOne).length() - 5)
							 + "0000000000";
				break;
			case 4:
				newReplyCode = jsonObj.getString("up_reply_code").substring(0, 15)
							 + ("00000"+maxPlusOne).substring(("00000"+maxPlusOne).length() - 5)
							 + "00000";
				break;
			case 5:
				newReplyCode = jsonObj.getString("up_reply_code").substring(0, 20)
							 + ("00000"+maxPlusOne).substring(("00000"+maxPlusOne).length() - 5);
				break;
		}
		sql = " INSERT INTO selling_replys ( "
			+ "     sell_id, reply_code, up_reply_code, level, content "
			+ " ) VALUES ( "
			+ "     ?, ?, ?, ?, ? "
			+ " ); ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, jsonObj.getInt("sell_id"));
		pstmt.setString(2, newReplyCode);
		pstmt.setString(3, jsonObj.getString("up_reply_code"));
		pstmt.setInt(4, jsonObj.getInt("level"));
		pstmt.setString(5, jsonObj.getString("content"));
		pstmt.executeUpdate();
		
		// Redux state 갱신을 위해 가져오는 데이터
		sql = " SELECT "
			+ "     SUM(IF(A.level = 1 AND A.reply_code <= CONCAT(LEFT(?,5),'00000000000000000000'),1,0)) AS LV1, \n"
			+ "     SUM(IF(A.level = 2 AND A.reply_code BETWEEN CONCAT(LEFT(?,5),'00000000000000000000') AND CONCAT(LEFT(?,10),'000000000000000'),1,0)) AS LV2, \n"
			+ "     SUM(IF(A.level = 3 AND A.reply_code BETWEEN CONCAT(LEFT(?,10),'000000000000000')     AND CONCAT(LEFT(?,15),'0000000000'),1,0)) AS LV3, \n"
			+ "     SUM(IF(A.level = 4 AND A.reply_code BETWEEN CONCAT(LEFT(?,15),'0000000000')          AND CONCAT(LEFT(?,20),'00000'),1,0)) AS LV4 \n"
			+ " FROM   selling_replys AS A "
			+ " WHERE  A.sell_id = ? ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, jsonObj.getString("up_reply_code"));
		pstmt.setString(2, jsonObj.getString("up_reply_code"));
		pstmt.setString(3, jsonObj.getString("up_reply_code"));
		pstmt.setString(4, jsonObj.getString("up_reply_code"));
		pstmt.setString(5, jsonObj.getString("up_reply_code"));
		pstmt.setString(6, jsonObj.getString("up_reply_code"));
		pstmt.setString(7, jsonObj.getString("up_reply_code"));
		pstmt.setInt(8, jsonObj.getInt("sell_id"));
		rs    = pstmt.executeQuery();
		// LV_CNT = jdbcDao.getDataOneJSON(rs, true);
		LV_CNT = jdbcDao.getDataOne(rs);
		
		// 결과값 생성
		rtn = new JSONObject();
		rtn.put("NEW_REPLY_CODE", newReplyCode);
		rtn.put("up_reply_code", jsonObj.getString("up_reply_code"));
		rtn.put("level", jsonObj.getInt("level"));
		rtn.put("content", jsonObj.getString("content"));
		rtn.put("LV1", Integer.valueOf(LV_CNT.get("LV1")));
		rtn.put("LV2", Integer.valueOf(LV_CNT.get("LV2")));
		rtn.put("LV3", Integer.valueOf(LV_CNT.get("LV3")));
		rtn.put("LV4", Integer.valueOf(LV_CNT.get("LV4")));
		conn.commit();
		return rtn;
		
	}catch(Exception e){
		try{
        	conn.rollback();
        }catch(SQLException se){ }
		
		throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
		
	}finally{
		try{
			jdbcDao.clearConnection(rs, cstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	
	
	/*
	채번, row-lock 에 대한 자료
	https://redballs.tistory.com/entry/MAX-1-%EC%B1%84%EB%B2%88-%EC%9D%B4%EC%8A%88
	https://suhwan.dev/2019/06/09/transaction-isolation-level-and-lock/
	*/
	
	/*
	// JSON 읽는 방법2
	InputStreamReader in = new InputStreamReader(request.getInputStream(), charset);
	BufferedReader br = null;
	String inputLine;
	
	StringBuffer stringBuffer = new StringBuffer();
	br = new BufferedReader(in);
	while((inputLine = br.readLine()) != null) {
		stringBuffer.append(inputLine);
	}
	br.close();
	br = null;
	System.out.println(stringBuffer.toString());
	*/
}
%>
<%
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{'sell_id':3000, 'up_reply_code':'0000100001000000000000000', 'level':3, 'content':'내용 레벨3'}" ^
http://localhost:8080/MyWeb1/selling/RegisterNewReply.jsp

curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"sell_id\":3000, \"up_reply_code\":\"0000100001000030000000000\", \"level\":4, \"content\":\"내용 레벨4\"}" ^
http://localhost:8080/MyWeb1/selling/RegisterNewReply.jsp
*/
try{
	out.clear();
    out.clearBuffer();
    out.write(this.saveReply(request, "UTF-8").toString());
}catch(Exception e){
	System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
}
%>
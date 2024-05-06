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
	Map<String, String> map = null, map2 = null;
	JSONObject rtn          = null;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		// JSON 읽는 방법1
		String data = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
		
		JSONObject jsonObj = new JSONObject(data);
		
		sql = "{CALL P_COMMUNITY_NEW_SEQ(?,?,?)}";
		cstmt = conn.prepareCall(sql);
		cstmt.setString(1, jsonObj.getString("board_id"));
		cstmt.setString(2, jsonObj.getString("up_reply_code"));
		cstmt.setInt(3, jsonObj.getInt("level"));
		
		rs = cstmt.executeQuery();
		map = jdbcDao.getDataOne(rs);
		
		
		// 새 reply_code로 메인테이블에 저장
		conn.setAutoCommit(false); // 자동커밋 해제
		sql = " INSERT INTO community_comments (reply_code, up_reply_code, level, content) VALUES(?,?,?,?) ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, map.get("NEW_REPLY_CODE"));
		pstmt.setString(2, jsonObj.getString("up_reply_code"));
		pstmt.setInt(3, jsonObj.getInt("level"));
		pstmt.setString(4, jsonObj.getString("content"));
		pstmt.executeUpdate();
		conn.commit();
		
		// Redux state 갱신을 위해 가져오는 데이터
		sql = " SELECT "
			+ "     SUM(IF(A.level = 1 AND A.reply_code <= CONCAT(LEFT(?,3),\'000000000000\'), 1, 0)) AS LV1 "
			+ " ,   SUM(IF(A.level = 2 AND A.reply_code BETWEEN CONCAT(LEFT(?,3),\'000000000000\') AND CONCAT(LEFT(?,6),\'000000000\'), 1, 0)) AS LV2 "
			+ " ,   SUM(IF(A.level = 3 AND A.reply_code BETWEEN CONCAT(LEFT(?,6),\'000000000\')    AND CONCAT(LEFT(?,9),\'000000\'), 1, 0)) AS LV3 "
			+ " ,   SUM(IF(A.level = 4 AND A.reply_code BETWEEN CONCAT(LEFT(?,9),\'000000\')       AND CONCAT(LEFT(?,12),\'000\'), 1, 0)) AS LV4 "
			+ " FROM community_comments AS A "
			+ " WHERE A.board_id = ?; ";
		
		
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, jsonObj.getString("up_reply_code"));
		pstmt.setString(2, jsonObj.getString("up_reply_code"));
		pstmt.setString(3, jsonObj.getString("up_reply_code"));
		pstmt.setString(4, jsonObj.getString("up_reply_code"));
		pstmt.setString(5, jsonObj.getString("up_reply_code"));
		pstmt.setString(6, jsonObj.getString("up_reply_code"));
		pstmt.setString(7, jsonObj.getString("up_reply_code"));
		pstmt.setString(8, jsonObj.getString("board_id"));
		rs    = pstmt.executeQuery();
		map2  = jdbcDao.getDataOne(rs);
		
		
		// 결과값 생성
		rtn = new JSONObject();
		rtn.put("NEW_REPLY_CODE", map.get("NEW_REPLY_CODE"));
		rtn.put("up_reply_code", jsonObj.getString("up_reply_code"));
		rtn.put("level", jsonObj.getInt("level"));
		rtn.put("content", jsonObj.getString("content"));
		rtn.put("LV1", Integer.valueOf(map2.get("LV1")));
		rtn.put("LV2", Integer.valueOf(map2.get("LV2")));
		rtn.put("LV3", Integer.valueOf(map2.get("LV3")));
		rtn.put("LV4", Integer.valueOf(map2.get("LV4")));
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
try{
	// curl -X POST -H "Content-Type: application/json" -d "{\"board_id\" : \"00000000000000A\", \"up_reply_code\" : \"001001000000000\", \"level\" : 3, \"content\" : \"내용 레벨3\"}" http://localhost:8080/MyWeb1/SaveNewReply.jsp
	// curl -X POST -H "Content-Type: application/json" -d "{\"board_id\" : \"00000000000000A\", \"up_reply_code\" : \"001001003000000\", \"level\" : 4, \"content\" : \"내용 레벨4\"}" http://localhost:8080/MyWeb1/SaveNewReply.jsp
	out.clear();
    out.clearBuffer();
    out.write(this.saveReply(request, "UTF-8").toString());
}catch(Exception e){
	System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
}
%>
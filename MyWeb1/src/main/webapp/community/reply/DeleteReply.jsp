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
	Map<String,String> parents = null;
	JSONObject paramObj     = null;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		String paramData = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
		paramObj = new JSONObject(paramData);
		
		
		// 삭제될 댓글들의 상위 댓글 코드 조회
		sql = " SELECT GROUP_CONCAT(DISTINCT CONCAT(\'\\\'\',A.up_reply_code,\'\\\'\') SEPARATOR \',\') AS parents_of_deleted_child "
			+ " FROM   community_comments AS A "
			+ " WHERE  A.board_id = ? "
			+ " AND    A.reply_code LIKE ?; ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, paramObj.getString("board_id"));
		pstmt.setString(2, paramObj.getString("reply_code").substring(0, paramObj.getInt("level") * 3)+"%");
		rs = pstmt.executeQuery();
		parents = jdbcDao.getDataOne(rs);
		
		// System.out.println(parents);
		conn.setAutoCommit(false); // 자동커밋 해제
		// 댓글 삭제
		sql = " DELETE A "
			+ " FROM   community_comments AS A "
			+ " WHERE  A.board_id = ? "
			+ " AND    A.reply_code LIKE ?; ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, paramObj.getString("board_id"));
		pstmt.setString(2, paramObj.getString("reply_code").substring(0, paramObj.getInt("level") * 3)+"%");
		int rows1 = pstmt.executeUpdate();
		
		// 시퀀스 테이블에서 안쓰는 코드 삭제
		sql = " DELETE A "
			+ " FROM comment_seq AS A "
			+ " LEFT OUTER JOIN ( "
			+ "     SELECT B.up_reply_code, MAX(B.reply_code) AS max_reply_code "
			+ "     FROM community_comments AS B "
			+ "     WHERE B.board_id = ? "
			+ "     GROUP BY B.up_reply_code "
			+ " ) AS B "
			+ " ON A.up_reply_code = B.up_reply_code "
			+ " WHERE A.board_id = ? "
			+ " AND   A.up_reply_code IN ("+parents.get("parents_of_deleted_child")+") "
			+ " AND   B.up_reply_code IS NULL; ";
		
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, paramObj.getString("board_id"));
		pstmt.setString(2, paramObj.getString("board_id"));
		int rows2 = pstmt.executeUpdate();
		
		// MAX값 업데이트
		sql = " UPDATE comment_seq AS A "
			+ " LEFT OUTER JOIN ( "
			+ "     SELECT B.up_reply_code, MAX(B.reply_code) AS max_reply_code "
			+ "     FROM community_comments AS B "
			+ "     WHERE B.board_id = ? "
			+ "     GROUP BY B.up_reply_code "
			+ " ) AS B "
			+ " ON A.up_reply_code = B.up_reply_code "
			+ " SET "
			+ "       A.max_reply_code = B.max_reply_code "
			+ " WHERE A.board_id = ? "
			+ " AND   A.up_reply_code IN ("+parents.get("parents_of_deleted_child")+"); ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, paramObj.getString("board_id"));
		pstmt.setString(2, paramObj.getString("board_id"));
		int rows3 = pstmt.executeUpdate();
		
		conn.commit();
		
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
try{
	// curl -X POST -H "Content-Type: application/json" -d "{\"board_id\" : \"00000000000000A\", \"reply_code\" : \"002002004000000\", \"level\" : 3}" http://localhost:8080/MyWeb1/community/reply/DeleteReply.jsp
	out.clear();
    out.clearBuffer();
    out.write(this.deleteReplyById(request).toString());
	
}catch(Exception e){}
%>
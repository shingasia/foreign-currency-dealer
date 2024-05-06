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
/*
 * 판매 본문 가져오는 함수
 */
public JSONObject getSellingInfo(int sellId) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	JSONObject rtn          = null;
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		sql = " SELECT "
			+ "     A.sell_id, A.title, A.money_code1, A.amount1, A.money_code2, A.amount2, A.latitude, A.longitude "
			+ "   , A.region_code, A.region_1depth, A.region_2depth, A.region_3depth, A.region_4depth "
			+ "   , A.addr1, A.addr2, A.memo, A.writer, A.write_date, A.sold_yn "
			+ " FROM   foreign_currency_selling AS A "
			+ " WHERE  sell_id = ? ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, sellId);
		rs = pstmt.executeQuery();
		rtn = jdbcDao.getDataOneJSON(rs, true);
		
	}catch(Exception e) {
		throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally {
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	return rtn;
}
/*
 * 판매 본문에 달린 댓글 가져오는 함수
 */
public JSONArray getReplysOfSelling(int sellId) throws Exception {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	Map<String,String> rtn = null;
	
	// DB 연결
	jdbcDao = new JDBCConnector();
	conn = jdbcDao.getConnection();
	
	
	sql = " SELECT CONCAT(\'[\',GROUP_CONCAT(AA.json_data SEPARATOR \'\\n\'),\']\') AS reply_tree "+"\n"
		+ " FROM ( "+"\n"
	    + "     WITH RECURSIVE Parent_CTE AS ( "+"\n"
		+ "         SELECT sell_id, reply_code, up_reply_code, level, content FROM selling_replys WHERE level = 1 AND sell_id = ? "+"\n"
		+ "         UNION ALL "+"\n"
		+ "         SELECT A.sell_id, A.reply_code, A.up_reply_code, A.level, A.content "+"\n"
		+ "         FROM   selling_replys AS A "+"\n"
		+ "         INNER JOIN "+"\n"
		+ "             Parent_CTE AS B "+"\n"
		+ "         ON     A.up_reply_code = B.reply_code AND A.sell_id = ? "+"\n"
		+ " ) "+"\n"
		+ "     SELECT "+"\n"
		+ "         A.reply_code, A.up_reply_code, A.level, A.content "+"\n"
		+ "         ,DENSE_RANK() OVER(PARTITION BY A.up_reply_code ORDER BY A.reply_code ASC) AS RANK1 "+"\n"
		+ "         -- 같은 부모 댓글의 자식 댓글 개수 "+"\n"
		+ "         ,COUNT(*) OVER( "+"\n"
		+ "             PARTITION BY A.up_reply_code "+"\n"
		+ "             ORDER BY A.reply_code ASC "+"\n"
		+ "             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS cnt_of_sibling "+"\n"
		+ "         ,IFNULL(B.cnt_of_child, 0) AS cnt_of_child "+"\n"
		+ "         -- 같은 부모 댓글의 마지막 자식 댓글 "+"\n"
		+ "         ,LEAD(A.up_reply_code, 1) OVER( "+"\n"
		+ "             PARTITION BY A.up_reply_code "+"\n"
		+ "             ORDER BY A.reply_code ASC "+"\n"
		+ "             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) IS NULL AS last_reply_of_same_parent "+"\n"
		+ "         ,LAST_VALUE(A.reply_code) OVER( "+"\n"
		+ "             PARTITION BY A.up_reply_code "+"\n"
		+ "             ORDER BY A.reply_code ASC "+"\n"
		+ "             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_reply "+"\n"
		+ "         -- 다음 row의 level "+"\n"
		+ "         ,LEAD(A.level, 1) OVER( "+"\n"
		+ "             ORDER BY A.reply_code ASC "+"\n"
		+ "             ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) AS next_level "+"\n"
		+ "         ,CONCAT(\'{\', \'\\\'checked\\\'\', \':\', \'false, \', \'\\\'sell_id\\\':\', A.sell_id "+"\n"
		+ "             ,\', \\\'reply_code\\\'\',\':\\\'\',A.reply_code,\'\\\', \\\'up_reply_code\\\'\',\':\\\'\',A.up_reply_code,\'\\\', \\\'level\\\'\',\':\',A.level,\', \\\'content\\\'\',\':\\\'\',A.content,\'\\\', \\\'down_replys\\\'\',\':\',\'[\' "+"\n"
		+ "             ,(CASE "+"\n"
		+ "                 WHEN IFNULL(B.cnt_of_child, 0) <> 0 THEN \'\' "+"\n"
		+ "                 WHEN IFNULL(B.cnt_of_child, 0) = 0 "+"\n"
		+ "                     THEN (CASE "+"\n"
		+ "                              WHEN A.level - LEAD(A.level, 1) OVER( "+"\n"
		+ "                                                          ORDER BY A.reply_code ASC "+"\n"
		+ "                                                          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) = 0 THEN \']},\' "+"\n"
		+ "                              WHEN A.level - LEAD(A.level, 1) OVER( "+"\n"
		+ "                                                          ORDER BY A.reply_code ASC "+"\n"
		+ "                                                          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) = 1 THEN \']}]},\' "+"\n"
		+ "                              WHEN A.level - LEAD(A.level, 1) OVER( "+"\n"
		+ "                                                          ORDER BY A.reply_code ASC "+"\n"
		+ "                                                          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) = 2 THEN \']}]}]},\' "+"\n"
		+ "                              WHEN A.level - LEAD(A.level, 1) OVER( "+"\n"
		+ "                                                          ORDER BY A.reply_code ASC "+"\n"
		+ "                                                          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) = 3 THEN \']}]}]}]},\' "+"\n"
		+ "                              WHEN A.level - LEAD(A.level, 1) OVER( "+"\n"
		+ "                                                          ORDER BY A.reply_code ASC "+"\n"
		+ "                                                          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) = 4 THEN \']}]}]}]}]},\' "+"\n"
		+ "                              WHEN LEAD(A.level, 1) OVER( "+"\n"
		+ "                                                ORDER BY A.reply_code ASC "+"\n"
		+ "                                                ROWS BETWEEN UNBOUNDED PRECEDING AND 1 FOLLOWING) IS NULL THEN CONCAT(REPEAT(\']}\', A.level - 1), \']}\') "+"\n"
		+ "                              ELSE NULL "+"\n"
		+ "                          END) "+"\n"
		+ "                 ELSE \'\' "+"\n"
		+ "              END) "+"\n"
		+ "         ) AS json_data "+"\n"
		+ "     FROM Parent_CTE AS A "+"\n"
		+ "     LEFT OUTER JOIN ( "+"\n"
		+ "         SELECT up_reply_code, COUNT(*) AS cnt_of_child "+"\n"
		+ "         FROM selling_replys "+"\n"
		+ "         WHERE sell_id = ? "+"\n"
		+ "         GROUP BY up_reply_code "+"\n"
		+ "     ) AS B "+"\n"
		+ "     ON A.reply_code = B.up_reply_code "+"\n"
		+ "     ORDER BY A.reply_code ASC "+"\n"
		+ " ) AS AA; "+"\n";
	
	// System.out.println(sql);
	try{
		pstmt = conn.prepareStatement(sql);
		pstmt.setInt(1, sellId);
		pstmt.setInt(2, sellId);
		pstmt.setInt(3, sellId);
		rs    = pstmt.executeQuery();
		rtn   = jdbcDao.getDataOne(rs);
	}catch(Exception e) {
		throw new Exception("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally {
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	if(rtn.get("reply_tree") == null) {
		return new JSONArray();
	}else {
		return new JSONArray(rtn.get("reply_tree"));
	}
}
%>

<%
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" ^
-d "sell_id=3000&TYPE=Selling/Main" ^
http://localhost:8080/MyWeb1/selling/SellingDetail.jsp

curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" ^
-d "sell_id=3383&TYPE=Selling/Replys" ^
http://localhost:8080/MyWeb1/selling/SellingDetail.jsp
*/



String TYPE = request.getParameter("TYPE");
int sellId  = Integer.valueOf(request.getParameter("sell_id"));
Object result = null;

switch(TYPE) {
	case "Selling/Main":
		result = this.getSellingInfo(sellId);
		break;
	case "Selling/Replys":
		result = this.getReplysOfSelling(sellId);
		break;
	default:
		new JSONObject("{XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX}");
		break;
}
out.clear();
out.clearBuffer();
out.write(result.toString());
%>
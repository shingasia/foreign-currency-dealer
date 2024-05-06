<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.io.*, java.net.*, java.sql.*, java.time.*" %>

<%@ page import="commonpkg.dao.*" %>

<%@ page import="org.json.JSONArray" %>
<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");
response.setHeader("Access-Control-Allow-Origin","*");
// response.setContentType("application/json");
%>

<%!
/**
 * 댓글 전체 조회
**/
/*
1. 모든 댓글은 여는 중괄호 '{'로 시작함
2. 자식 댓글이 있는지 확인
2-1 있으면 'down_replys: ['로 열어둠
2-2 없으면 'down_replys: []}' (자시 자신꺼 우선 닫고) 현재 row의 바로 다음 row 댓글의 level이 달라질때 차이만큼 더 닫음 => window 함수 사용
ex1) 5레벨 다음 row가 2레벨 이면 ']},'를 3번 더 추가
ex2) 4레벨 다음 row가 3레벨 이면 ']},'를 1번 더 추가
ex3) 3레벨 다음 row가 1레벨 이면 ']},'를 2번 더 추가
ex4) 2레벨 다음 row가 없으면 ']},'를 1번 더 추가
ex5) 5레벨 다음 row가 없으면 ']},'를 4번 더 추가
*/
public JSONArray getReplyTree(int sell_id) throws Exception {
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
	
	System.out.println(sql);
	pstmt = conn.prepareStatement(sql);
	pstmt.setInt(1, sell_id);
	pstmt.setInt(2, sell_id);
	pstmt.setInt(3, sell_id);
	rs    = pstmt.executeQuery();
	rtn = jdbcDao.getDataOne(rs);
	
	jdbcDao.clearConnection(rs, pstmt);
	return new JSONArray(rtn.get("reply_tree"));
	
}
%>
<%
int sell_id = Integer.valueOf(request.getParameter("sell_id"));
out.clear();
out.clearBuffer();
out.write(this.getReplyTree(sell_id).toString());

// 터미널에서 curl 명령으로 JSON 가져오는지 확인
// curl -G -H "Content-Type: application/json" "http://localhost:8080/MyWeb1/SelectAllReplys.jsp?sell_id=3000"
%>

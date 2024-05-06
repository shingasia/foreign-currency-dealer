<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.io.*, java.net.*, java.sql.*, java.time.*" %>
<%@ page import="java.util.function.*, java.util.stream.*" %>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="commonpkg.dao.*" %>
<%@ page import="org.json.*" %>

<%-- javax.mail 에서 jakarta.mail 로 교체 --%>
<%@ page import="jakarta.mail.internet.MimeMessage" %>
<%@ page import="jakarta.mail.internet.InternetAddress" %>
<%@ page import="jakarta.mail.Authenticator" %>
<%@ page import="jakarta.mail.PasswordAuthentication" %>
<%@ page import="jakarta.mail.Session" %>
<%@ page import="jakarta.mail.Message" %>
<%@ page import="jakarta.mail.Transport" %>


<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");

response.setHeader("Access-Control-Allow-Origin", "*");
response.setContentType("application/json");
%>

<%!
/*
이메일 전송 함수
@param senderID : 송신자 이메일
@param senderPW : 송신자 이메일 비밀번호
@param receiver : 수신자 이메일
@param randomSixDigit : 랜덤 숫자 6자리
*/
public void sendMail(String senderID, String senderPW, String receiver, String randomSixDigit) {
	Properties props = new Properties();
	// 네이버메일 들어가서 환경설정 -> POP3/IMAP 설정 화면에 적용된값들 입력
	props.put("mail.smtp.host", "smtp.naver.com");
	props.put("mail.smtp.port", "587");
	props.put("mail.smtp.auth", "true");
	props.put("mail.smtp.starttls.enable", "true");
	props.put("mail.smtp.ssl.trust", "smtp.naver.com");
	// props.put("mail.smtp.ssl.enable", "true");
	// props.setProperty("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
	
	
	Session session = Session.getInstance(props, new Authenticator() {
		@Override
		protected PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(senderID, senderPW);
		}
	});
	
	String title = "인증번호 발송안내";
	String content = "<p>아래의 인증번호를 화면에 입력하세요.</p><br/><h2 style='color:blue'>"+randomSixDigit+"</h2>";
	
	MimeMessage message = new MimeMessage(session);
	
	try{
		message.setFrom(new InternetAddress(senderID));
		message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
		message.setSubject(title);
		
		message.setContent(content, "text/html; charset=utf-8");
		// message.setText("<p>아래의 인증번호를 화면에 입력하세요.</p><br/><h2 style='color:blue'>"+randomSixDigit+"</h2>");
		
		Transport.send(message);
		
	}catch(Exception e){
		e.printStackTrace();
	}
	
}
/*
관리자 정보 조회
@return String[] : admin의 이메일, 비밀번호
*/
public String[] getAdminEmail() {
	JDBCConnector jdbcDao    = null;
	Connection conn          = null;
	PreparedStatement pstmt  = null;
	ResultSet rs             = null;
	String sql               = "";
	Map<String,String> admin = null;
	String[] rtn             = null;
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		sql = " SELECT admin_email_id, admin_email_pw "
			+ " FROM admin_config; ";
		pstmt = conn.prepareStatement(sql);
		rs = pstmt.executeQuery();
		admin = jdbcDao.getDataOne(rs);
		
		rtn = new String[]{admin.get("admin_email_id"), admin.get("admin_email_pw")};
		
	}catch(Exception e){
		System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally{
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
	return rtn;
}
/*
인증번호 전송이력 저장
@param receiver_email    : 수신자 이메일
@param verification_code : 인증번호 6자리
*/
public void saveMailLog(String receiver_email, String verification_code) {
	JDBCConnector jdbcDao   = null;
	Connection conn         = null;
	PreparedStatement pstmt = null;
	ResultSet rs            = null;
	String sql              = "";
	
	// DB 연결
	try{
		jdbcDao = new JDBCConnector();
		conn = jdbcDao.getConnection();
		
		sql = " INSERT INTO email_send_log ( "
			+ "    member_seq, member_email, verification_code, available_stime, available_etime, memo "
			+ " ) VALUES ( "
			+ "    NULL, ?, ?, NOW(6), DATE_ADD(NOW(6), INTERVAL +3 MINUTE), '신규가입' "
			+ " ); ";
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, receiver_email);
		pstmt.setString(2, verification_code);
		pstmt.executeUpdate();
		
	}catch(Exception e){
		System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	}finally{
		try{
			jdbcDao.clearConnection(rs, pstmt);
		}catch(SQLException | NullPointerException e){ }
	}
}
%>


<%
/*
curl ^
-X POST ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{\"email\": \"shingasia@kakao.com\"}" ^
"http://localhost:8080/MyWeb1/member/join/MailSendService.jsp"
*/
double n = new Random().nextDouble();
String nStr = new DecimalFormat("000000000000000.0000000").format((n * 10.0E+15));
String[] adminInfo = this.getAdminEmail();

// POST 데이터
String paramData    = new BufferedReader(request.getReader()).lines().collect(Collectors.joining(""));
JSONObject paramObj = new JSONObject(paramData);

// 결과 JSON 데이터
JSONObject rtn = null;

//flush()와 다르게 clear(), clearBuffer()는 클라이언트에 내용을 쓰지 않고 버퍼를 비운다.
out.clear();
out.clearBuffer();
PrintWriter pw = response.getWriter();

try{
	this.sendMail(adminInfo[0], adminInfo[1], paramObj.getString("email"), nStr.substring(0, 6));
	this.saveMailLog(paramObj.getString("email"), nStr.substring(0, 6));
	rtn = new JSONObject("{'message':'인증번호를 메일로 전송했습니다.', 'transmit':true}");
	pw.print(rtn.toString());
	
}catch(Exception e){
	System.out.println("EX_CLASS - "+e.getClass().getName()+", EX_MSG - "+e.getMessage());
	rtn = new JSONObject("{'message':'인증번호 전송에 실패했습니다.', 'transmit':false}");
	pw.print(rtn.toString());
}

%>


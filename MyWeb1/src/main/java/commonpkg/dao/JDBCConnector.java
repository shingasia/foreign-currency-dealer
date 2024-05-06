package commonpkg.dao;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.util.*;

import org.json.JSONArray;
import org.json.JSONObject;

// JSON 관련 라이브러리
public class JDBCConnector {
	private Connection conn;
	private String dbUser;
	private String dbPassword;
	private String dbDriver;
	private String dbName;
	
	// 생성자
	public JDBCConnector() {
		this.dbDriver = "org.mariadb.jdbc.Driver";
		this.dbName = "myboard";
	}
	
	// JDBC 연결
	public Connection getConnection() {
		if(conn == null) {
			try {
				Class.forName(dbDriver);
				conn = DriverManager.getConnection("jdbc:mariadb://localhost:3306"+"/"+dbName, "root", "1234");
			}catch(SQLException e) {
				e.printStackTrace();
			}catch(ClassNotFoundException e) {
				e.printStackTrace();
			}
		}
		return conn;
	}
	// JDBC 연결해제
	public void clearConnection(ResultSet rs, Statement stmt) throws SQLException {
		if(rs != null && !rs.isClosed()) {
			rs.close();
			rs = null;
		}
		if(stmt != null && !stmt.isClosed()) {
			stmt.close();
			stmt = null;
		}
		if(conn != null && !conn.isClosed()) {
			conn.close();
			conn = null;
		}
	}
	
	// 조회 결과 데이터가 1개
	public Map<String, String> getDataOne(ResultSet rs) throws SQLException {
		Map<String, String> map = null;
		
		if(rs.next()) {
			map = new HashMap<String, String>();
			for(int colIndex = 1; colIndex <= rs.getMetaData().getColumnCount(); colIndex++) {
				String key   = rs.getMetaData().getColumnLabel(colIndex);
				String value = rs.getString(colIndex);
				
				map.put(key, value);
			}
		}
		return map;
	}
	
	// 조회 결과 데이터가 1개 => JSON
	public JSONObject getDataOneJSON(ResultSet rs, boolean zeroToNull) throws SQLException {
		JSONObject jsonObject = new JSONObject();
		String key = null, value = null;
		if(rs.next()){
			for(int colIndex = 1; colIndex <= rs.getMetaData().getColumnCount(); colIndex++) {
				key   = rs.getMetaData().getColumnLabel(colIndex);
				value = rs.getString(colIndex);
				jsonObject.put(key, value);
			}
		}
		
		if(zeroToNull && jsonObject.isEmpty()){
			jsonObject = null;
		}
		return jsonObject;
	}
	
	// 조회 결과 데이터가 여러개
	public List<Map<String, String>> getDataMany(ResultSet rs) throws SQLException {
		List<Map<String, String>> list = new ArrayList<Map<String, String>>();
		String key = null, value = null;
		
		while(rs.next()) {
			Map<String, String> map = new HashMap<String, String>();
			
			for(int colIndex = 1; colIndex <= rs.getMetaData().getColumnCount(); colIndex++) {
				key   = rs.getMetaData().getColumnLabel(colIndex); // MariaDB
				// rs.getMetaData().getColumnName(colIndex); // SQL Server
				value = rs.getString(colIndex);
				
				map.put(key, value);
			}
			list.add(map);
		}
		return list;
	}
	
	// 조회 결과 데이터가 여러개 => JSON
	public JSONArray getDataManyJSON(ResultSet rs, boolean zeroToNull) throws SQLException {
		JSONArray jsonArr = new JSONArray();
		JSONObject jsonObj = null;
		String key = null, value = null;
		
		while(rs.next()) {
			jsonObj = new JSONObject();
			for(int colIndex = 1; colIndex <= rs.getMetaData().getColumnCount(); colIndex++) {
				key   = rs.getMetaData().getColumnLabel(colIndex); // MariaDB
				// rs.getMetaData().getColumnName(colIndex); // SQL Server
				value = rs.getString(colIndex);
				jsonObj.put(key, value);
			}
			jsonArr.put(jsonObj);
		}
		
		// 조회결과 데이터가 없으면 null 리턴
		if(zeroToNull && jsonArr.length() == 0) {
			return null;
		}
		return jsonArr;
	}
}

package com.sp6mybatis.pro1.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
@EnableTransactionManagement
@PropertySource("classpath:application-local.properties")
public class DBConfig {
    
    @Autowired
	ResourceLoader resourceLoader;
    @Autowired
	private ApplicationContext applicationContext;


    @Value("${spring.datasource.driverClassName}")
    private String databaseDriverClassName;
    @Value("${spring.datasource.username}")
    private String username;
    @Value("${spring.datasource.password}")
    private String password;
    @Value("${spring.datasource.url}")
    private String url;

    @Bean
    public DataSource dataSource() {
        HikariConfig hikariConfig = new HikariConfig();

        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        hikariConfig.setJdbcUrl(url);
        hikariConfig.setConnectionTestQuery("SELECT 1");
        hikariConfig.setMaximumPoolSize(50); // Connection Pool에서 갖고있을 Connection의 개수
        hikariConfig.setDriverClassName(databaseDriverClassName);
        hikariConfig.setIdleTimeout(20000); // 20초
        
        HikariDataSource dataSource = new HikariDataSource(hikariConfig);
        return dataSource;
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
        sqlSessionFactory.setDataSource(dataSource());
        // sqlSessionFactory.setConfigLocation(resourceLoader.getResource("classpath:mybatis/config/mybatis-config.xml"));
        // sqlSessionFactory.setMapperLocations(resourceLoader.getResource("classpath:/mybatis/mappers/*.xml"));
        sqlSessionFactory.setConfigLocation(applicationContext.getResource("classpath:mybatis/config/mybatis-config.xml"));
        sqlSessionFactory.setMapperLocations(applicationContext.getResources("classpath:/mybatis/mappers/**/*.xml"));
        // applicationContext.getResource()

        // resources 폴더 밑에 mybatis 패키지를 만든다.
        return sqlSessionFactory.getObject();
    }

    @Bean(destroyMethod = "clearCache")
    @Qualifier("sqlSessionTemplate")
    public SqlSessionTemplate sqlSessionTemplate() throws Exception {
		return new SqlSessionTemplate(sqlSessionFactory());
	}


    // (Mybatis 를 단독으로 사용할 경우 DataSourceTransactionManager 를 스프링 빈으로 등록이 필요하지만, JPA를 사용할 경우 JPATransactionManager 로 같이 관리가 가능하기 때문에 별도의 TransactionManager 를 등록할 필요는 없다.)
	@Bean
	public PlatformTransactionManager transactionManager() {
		DataSourceTransactionManager tm = new DataSourceTransactionManager();
		tm.setDataSource(dataSource());
		return tm;
	}
}

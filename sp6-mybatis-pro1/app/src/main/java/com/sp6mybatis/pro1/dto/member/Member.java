package com.sp6mybatis.pro1.dto.member;

import java.time.LocalDateTime;
import java.sql.Timestamp;

public class Member {
    private Long seq;
    private String id;
    private String passwd;
    private String name;
    private int age;
    private double point_1;
    private double point_2;
    private double point_3;
    private String s_date;
    private String e_date;
    private String memo;

    // Constructor
    public Member(Long seq, String id, String passwd, String name, int age, double point_1, double point_2,
            double point_3, String sDate, String eDate, String memo) {
        this.seq = seq;
        this.id = id;
        this.passwd = passwd;
        this.name = name;
        this.age = age;
        this.point_1 = point_1;
        this.point_2 = point_2;
        this.point_3 = point_3;
        this.s_date = sDate;
        this.e_date = eDate;
        this.memo = memo;
    }
    public Member() { }

    // Getter / Setter
    public Long getSeq() {
        return seq;
    }
    public void setSeq(Long seq) {
        this.seq = seq;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getPasswd() {
        return passwd;
    }
    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public double getPoint_1() {
        return point_1;
    }
    public void setPoint_1(double point_1) {
        this.point_1 = point_1;
    }
    public double getPoint_2() {
        return point_2;
    }
    public void setPoint_2(double point_2) {
        this.point_2 = point_2;
    }
    public double getPoint_3() {
        return point_3;
    }
    public void setPoint_3(double point_3) {
        this.point_3 = point_3;
    }
    public String getsDate() {
        return s_date;
    }
    public void setsDate(String sDate) {
        this.s_date = sDate;
    }
    public String geteDate() {
        return e_date;
    }
    public void seteDate(String eDate) {
        this.e_date = eDate;
    }
    public String getMemo() {
        return memo;
    }
    public void setMemo(String memo) {
        this.memo = memo;
    }
    @Override
    public String toString() {
        return "Member [seq=" + seq + ", id=" + id + ", passwd=" + passwd + ", name=" + name + ", age=" + age
                + ", point_1=" + point_1 + ", point_2=" + point_2 + ", point_3=" + point_3 + ", sDate=" + s_date
                + ", eDate=" + e_date + ", memo=" + memo + "]";
    }
    
}

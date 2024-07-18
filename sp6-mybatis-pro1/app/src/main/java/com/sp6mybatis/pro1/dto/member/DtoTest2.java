package com.sp6mybatis.pro1.dto.member;

public class DtoTest2 {
    private String p1;
    private int p2;
    // p3, p4 생략
    private double p5;
    
    // Getter / Setter
    public String getP1() {
        return p1;
    }
    public void setP1(String p1) {
        this.p1 = p1;
    }
    public int getP2() {
        return p2;
    }
    public void setP2(int p2) {
        this.p2 = p2;
    }
    public double getP5() {
        return p5;
    }
    public void setP5(double p5) {
        this.p5 = p5;
    }
    @Override
    public String toString() {
        return "DtoTest2 [p1=" + p1 + ", p2=" + p2 + ", p5=" + p5 + "]";
    }
}

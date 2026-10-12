package cn.kejian.app;
import java.time.*;
public final class AlarmPlanTest {
 private static int count=0;
 private static void equal(Object a,Object b){if(!a.equals(b))throw new AssertionError(a+" != "+b);count++;}
 private static void invalid(String d,String t,ZoneId z){try{AlarmPlan.timestamp(d,t,z);throw new AssertionError("Expected rejected time");}catch(IllegalArgumentException|DateTimeException e){count++;}}
 public static void main(String[] args){ZoneId utc=ZoneId.of("UTC");equal(AlarmPlan.timestamp("2027-01-15","19:25",utc),Instant.parse("2027-01-15T19:25:00Z").toEpochMilli());equal(AlarmPlan.timestamp("2027-01-15","19:25",ZoneId.of("Asia/Shanghai")),Instant.parse("2027-01-15T11:25:00Z").toEpochMilli());equal(AlarmPlan.timestamp("2028-02-29","08:00",utc),Instant.parse("2028-02-29T08:00:00Z").toEpochMilli());invalid("2026-02-30","12:00",utc);invalid("2027-01-15","24:00",utc);invalid("2027-01-15","12:99",utc);invalid("2027-01-15","12:00:30",utc);invalid("2027-1-15","12:00",utc);invalid("2027-03-14","02:30",ZoneId.of("America/New_York"));invalid("2027-11-07","01:30",ZoneId.of("America/New_York"));equal(AlarmPlan.status(200,100,false,true,true),"已安排准时提醒");equal(AlarmPlan.status(200,100,false,true,false),"已安排提醒，可能延后");equal(AlarmPlan.status(200,100,false,false,true),"通知未启用");equal(AlarmPlan.status(100,100,false,true,true),"时间已过");equal(AlarmPlan.status(100,200,true,true,true),"已提交系统通知");System.out.println(count+" native time and status checks passed");}
}

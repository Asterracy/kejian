package cn.kejian.app;
import java.time.*;
/** Platform independent time decisions, shared by the native scheduler and tests. */
public final class AlarmPlan {
 private AlarmPlan(){}
 public static long timestamp(String date,String time,ZoneId zone){
  if(!date.matches("\\d{4}-\\d{2}-\\d{2}")||!time.matches("(?:[01]\\d|2[0-3]):[0-5]\\d"))throw new IllegalArgumentException("日期或时间无效");
  LocalDateTime local=LocalDate.parse(date).atTime(LocalTime.parse(time));
  if(zone.getRules().getValidOffsets(local).size()!=1)throw new IllegalArgumentException("此时刻受夏令时影响，请另选明确时间");
  return local.atZone(zone).toInstant().toEpochMilli();
 }
 public static String status(long at,long now,boolean fired,boolean enabled,boolean exact){if(fired)return "已提交系统通知";if(at<=now)return "时间已过";if(!enabled)return "通知未启用";return exact?"已安排准时提醒":"已安排提醒，可能延后";}
}

package cn.kejian.app;
import java.time.*;import java.util.*;
/** Uses committed, date-expanded imports; one-level adjustments match projected() in the UI. */
public final class CoursePlan {
 public static final class Course {
  public final String date,name,location,start,end;
  public Course(String d,String n,String l,String s,String e){date=d;name=n;location=l;start=s;end=e;}
 }
 public static final class Plan {
  public Course current,next;public boolean empty;public int todayCount,untimed;public long boundary;
  public String title(){return empty?"课间 · 尚未导入课表":current!=null?"本节课 · "+current.name:todayCount==0?"今天没有课":next!=null&&next.date.equals(day)?"现在是课间":"今天的课程已结束";}
  private String day;
  private String detail(Course c){return c.date.substring(5)+" · "+c.start+(c.end.isEmpty()?"":" – "+c.end)+(c.location.isEmpty()?"":" · "+c.location);}
  public String text(){String s=current!=null?detail(current):empty?"打开课间导入课表":"";s+=(next==null?"\n暂无后续课程":"\n下节课 · "+next.name+"\n"+detail(next));if(untimed>0)s+="\n"+untimed+" 节时间不完整，暂不参与本节课判断";return s.trim();}
 }
 private static long at(String date,String time,ZoneId zone){return LocalDate.parse(date).atTime(LocalTime.parse(time)).atZone(zone).toInstant().toEpochMilli();}
 private static boolean clock(String s){return s.matches("([01]\\d|2[0-3]):[0-5]\\d");}
 private static List<Course> projected(List<Course> rows,Map<String,String> overrides,String day){String source=overrides.get(day);if(source==null||source.isEmpty())source=day;List<Course> out=new ArrayList<>();for(Course c:rows)if(c.date.equals(source))out.add(new Course(day,c.name,c.location,c.start,c.end));out.sort(Comparator.comparing(c->c.start.isEmpty()?"99:99":c.start));return out;}
 public static Plan calculate(List<Course> rows,Map<String,String> overrides,long now,ZoneId zone){
  Plan p=new Plan();p.empty=rows.isEmpty();LocalDate date=Instant.ofEpochMilli(now).atZone(zone).toLocalDate();String day=date.toString();p.day=day;p.boundary=date.plusDays(1).atStartOfDay(zone).toInstant().toEpochMilli();
  List<Course> today=projected(rows,overrides,day);p.todayCount=today.size();
  for(Course c:today){if(!clock(c.start)||!clock(c.end))p.untimed++;try{if(clock(c.start)){long start=at(day,c.start,zone);if(start>now){if(p.next==null)p.next=c;p.boundary=Math.min(p.boundary,start);}if(clock(c.end)){long end=at(day,c.end,zone);if(start<=now&&now<end&&p.current==null)p.current=c;if(end>now)p.boundary=Math.min(p.boundary,end);}}}catch(DateTimeException e){}}
  if(p.next==null&&!p.empty){SortedSet<String> dates=new TreeSet<>(overrides.keySet());for(Course c:rows)dates.add(c.date);for(String d:dates){if(d.compareTo(day)<=0)continue;try{LocalDate.parse(d);for(Course c:projected(rows,overrides,d))if(clock(c.start)){p.next=c;break;}}catch(DateTimeException e){}if(p.next!=null)break;}}
  return p;
 }
}

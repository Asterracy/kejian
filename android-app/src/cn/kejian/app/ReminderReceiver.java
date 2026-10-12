package cn.kejian.app;
import android.content.*;
public final class ReminderReceiver extends BroadcastReceiver {public void onReceive(Context c,Intent i){String id=i.getStringExtra("id");if(id!=null)AlarmScheduler.deliver(c,id);}}

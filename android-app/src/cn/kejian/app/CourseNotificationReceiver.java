package cn.kejian.app;
import android.content.*;
public final class CourseNotificationReceiver extends BroadcastReceiver {public void onReceive(Context c,Intent i){CourseNotification.reconcile(c);}}

package cn.kejian.app;
import android.content.*;
public final class RestoreReceiver extends BroadcastReceiver {public void onReceive(Context c,Intent i){AlarmScheduler.reconcile(c);}}

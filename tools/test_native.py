"""Run native pure-Java tests without an Android device or SDK."""
from pathlib import Path
import os,subprocess
root=Path(__file__).resolve().parents[1]
java_value=os.environ.get('KEJIAN_JAVA_HOME') or os.environ.get('JAVA_HOME')
if not java_value:raise SystemExit('Set JAVA_HOME or KEJIAN_JAVA_HOME to your JDK 21 directory.')
java=Path(java_value);target=root/'android-build/native-tests';target.mkdir(parents=True,exist_ok=True)
src=root/'android-app/src/cn/kejian/app';tests=root/'android-app/tests'
subprocess.run([str(java/'bin/javac'),'--release','8','-d',str(target),*[str(p) for p in [src/'AlarmPlan.java',src/'RawInflater.java',tests/'AlarmPlanTest.java',tests/'RawInflaterTest.java']]],check=True)
subprocess.run([str(java/'bin/java'),'-cp',str(target),'cn.kejian.app.AlarmPlanTest'],check=True)
subprocess.run([str(java/'bin/java'),'-cp',str(target),'cn.kejian.app.RawInflaterTest',*[str(root/'prototype/examples'/p)for p in ['general-dated-week-sheets.xlsx','general-shared-period-clock.xlsx','tuantuan.pet.zip']]],check=True)

"""JVM tests of production selection and scheduling; Android services and JSON parser are test doubles."""
from pathlib import Path
import os,subprocess
root=Path(__file__).resolve().parents[1];java=Path(os.environ['JAVA_HOME'])/'bin';out=root/'android-build/course-tests';out.mkdir(parents=True,exist_ok=True)
src=root/'android-app/src/cn/kejian/app';mocks=root/'android-app/tests/course-mocks'
files=[src/'CoursePlan.java',src/'CourseNotification.java',root/'android-app/tests/CoursePlanTest.java',*mocks.rglob('*.java')]
subprocess.run([str(java/'javac'),'--release','8','-encoding','UTF-8','-d',str(out),*map(str,files)],check=True)
for name in ['CoursePlanTest','CourseNotificationTest']:
 subprocess.run([str(java/'java'),'-cp',str(out),'cn.kejian.app.'+name],check=True)

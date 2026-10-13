"""Build a genuine Android APK with official SDK tools; private signing lives outside source."""
from pathlib import Path
import os,subprocess,shutil,zipfile,sys
project=Path(__file__).resolve().parents[1];task=project.parent
sdk_value=os.environ.get('KEJIAN_ANDROID_SDK') or os.environ.get('ANDROID_SDK_ROOT')
if not sdk_value:raise SystemExit('Set KEJIAN_ANDROID_SDK or ANDROID_SDK_ROOT to your licensed Android SDK directory.')
sdk=Path(sdk_value)
java_value=os.environ.get('KEJIAN_JAVA_HOME') or os.environ.get('JAVA_HOME')
if not java_value:raise SystemExit('Set KEJIAN_JAVA_HOME or JAVA_HOME to your JDK 21 directory.')
java=Path(java_value)
bt=sdk/'build-tools/35.0.0';platform=sdk/'platforms/android-35/android.jar'
signing_value=os.environ.get('KEJIAN_SIGNING_DIR')
if not signing_value:raise SystemExit('Set KEJIAN_SIGNING_DIR to your private signing directory outside the checkout.')
signing=Path(signing_value)
for p in [bt/'aapt2',bt/'d8',bt/'zipalign',bt/'apksigner',platform,java/'bin/javac']:
 if not p.exists():raise SystemExit('Missing official build component: '+str(p))
if not (signing/'kejian-release.p12').exists() or not(signing/'password.txt').exists():raise SystemExit('Private signing files required outside source package: '+str(signing))
build=task/'android-build/apk';build.mkdir(parents=True,exist_ok=True);(build/'classes').mkdir(exist_ok=True);(build/'generated').mkdir(exist_ok=True);(build/'dex').mkdir(exist_ok=True)
env={**os.environ,'JAVA_HOME':str(java),'PATH':str(java/'bin')+':'+os.environ.get('PATH','')}
def run(*args):subprocess.run([str(a) for a in args],check=True,env=env)
run(sys.executable,project/'tools/prepare_assets.py')
run(bt/'aapt2','compile','--dir',project/'res','-o',build/'compiled.zip')
run(bt/'aapt2','link','-o',build/'resources.apk','--manifest',project/'AndroidManifest.xml','-I',platform,'--java',build/'generated','-A',project/'assets',build/'compiled.zip')
sources=list((project/'src').rglob('*.java'))+list((build/'generated').rglob('*.java'))
run(java/'bin/javac','--release','8','-encoding','UTF-8','-classpath',platform,'-d',build/'classes',*sources)
run(java/'bin/jar','cf',build/'classes.jar','-C',build/'classes','.')
run(bt/'d8','--release','--min-api','26','--lib',platform,'--output',build/'dex',build/'classes.jar')
shutil.copyfile(build/'resources.apk',build/'unsigned.apk')
with zipfile.ZipFile(build/'unsigned.apk','a',compression=zipfile.ZIP_DEFLATED)as z:
 for p in (build/'dex').glob('*.dex'):z.write(p,p.name)
run(bt/'zipalign','-f','4',build/'unsigned.apk',build/'aligned.apk')
dist=task/'dist';dist.mkdir(exist_ok=True);output=dist/'kejian-0.3.0.apk'
run(bt/'apksigner','sign','--ks',signing/'kejian-release.p12','--ks-key-alias','kejian-release','--ks-pass','file:'+str(signing/'password.txt'),'--v1-signing-enabled','true','--v2-signing-enabled','true','--v3-signing-enabled','true','--out',output,build/'aligned.apk')
run(bt/'apksigner','verify','--verbose','--print-certs',output)
run(bt/'zipalign','-c','4',output)
print('Signed APK:',output,output.stat().st_size,'bytes')

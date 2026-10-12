from pathlib import Path
import re, shutil
project=Path(__file__).resolve().parents[1];source=project.parent/'prototype';dest=project/'assets'
s=(source/'index.html').read_text().replace('localStorage.','AppStorage.')
s=s.replace('<script>','<script src="native-storage.js"></script><script>',1)
s=s.replace("let mode=new URLSearchParams(location.search).get('state')||(persisted.courses.length?'live':'class');","let mode='live';")
s=s.replace('（仅原型记录）','（请查看通知状态）').replace('原型演示：保存记录，不发送系统通知。','保存记录后安排系统提醒；通知权限另行确认。')
s=s.replace('<title>课间 · 手机课表助手原型</title>','<title>课间</title>')
s=s.replace("catch{storageOK=false;return false;}","catch{storageOK=false;try{persisted=JSON.parse(AppStorage.getItem(STORE)||'{\"courses\":[],\"overrides\":{},\"reminders\":[],\"reduce\":false}');}catch{}return false;}",1)
s=s.replace("const ok=mode!=='live'||save();drafts[kind]", "const ok=mode!=='live'||save();if(!ok){saveBusy=false;$('reminder-save').disabled=false;return error('reminder-error','本机保存失败，记录未添加。请检查存储空间后重试。');}drafts[kind]")
s=s.replace("const ok=mode!=='live'||save();$('adjust-error')", "const ok=mode!=='live'||save();if(!ok){saveBusy=false;return error('adjust-error','本机保存失败，调休未更改。请检查存储空间后重试。');}$('adjust-error')")
s=s.replace("pending=null;const ok=save();mode='live';", "const next=pending;pending=null;const ok=save();if(!ok){pending=next;return toast('本机保存失败，原课表已保留。请检查存储空间后重试。');}mode='live';")
s=s.replace("if(mode==='live')save();refresh();toast('提醒已删除');", "const ok=mode!=='live'||save();refresh();toast(ok?'提醒已删除':'本机保存失败，提醒仍保留');")
s=s.replace("if(mode==='live')save();refresh();toast('已恢复这一天的原课表');", "const ok=mode!=='live'||save();refresh();toast(ok?'已恢复这一天的原课表':'本机保存失败，调休仍保留');")
s=s.replace('</body>','<script src="native-adapter.js"></script></body>')
(dest/'index.html').write_text(s)
for name in ['pets.js','excel-core.js','excel.js']:
 text=(source/name).read_text().replace('localStorage.','AppStorage.')
 if name=='pets.js':
  a=text.index('if(item.method===8){if(typeof DecompressionStream');b=text.index('if(bytes.length!==item.raw',a)
  text=text[:a]+"if(item.method===8){bytes=await window.AndroidInflate(bytes,item.raw);}"+text[b:]
 if name=='excel-core.js':
  a=text.index('if(method===8){const reader');b=text.index('else if(method!==0)',a)
  text=text[:a]+"if(method===8){body=await window.AndroidInflate(body,length);}"+text[b:]
 (dest/name).write_text(text)
shutil.copytree(source/'vendor',dest/'vendor',dirs_exist_ok=True)
notices=project.parent/'THIRD_PARTY_NOTICES.md';licenses=project.parent/'third-party-licenses'
if notices.exists():shutil.copyfile(notices,dest/'THIRD_PARTY_NOTICES.md')
if licenses.exists():shutil.copytree(licenses,dest/'third-party-licenses',dirs_exist_ok=True)
print('Offline Android assets prepared')

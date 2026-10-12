"""Check tracked/public-candidate bytes and nested archives before publication.
This is a scoped defense-in-depth scan, not a guarantee of absence of all secrets.
Run from any directory. Optional arguments inspect release artifacts too.
"""
from pathlib import Path
import io,json,re,subprocess,sys,zipfile,struct,zlib
root=Path(__file__).resolve().parents[1]
patterns={
 'personal absolute path':re.compile(rb'(?:/'+b'Users'+rb'/[^/\s]+/|/'+b'home'+rb'/[^/\s]+/|[A-Za-z]:\\'+b'Users'+rb'\\[^\\\s]+\\)'),
 'private Library identity':re.compile(rb'(?:lib'+rb'file_[a-zA-Z0-9]+|sedi'+rb'ment://|oai-'+rb'library://|file_'+rb'00000000[a-zA-Z0-9]+)'),
 'GitHub credential':re.compile(rb'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})'),
 'private key payload':re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----\s+[A-Za-z0-9+/=\r\n]{80,}'),
 'AWS access key':re.compile(rb'(?:AKIA|ASIA)[A-Z0-9]{16}'),
}
private_names={'inputs','references','screenshots','backups','android-signing','.library-helpers','LOCAL_CODEX_PET_FINDING.md','DELIVERY_ANDROID.json','DELIVERY_EXCEL.json','LIBRARY_TRANSFER_DIAGNOSTIC.md','real-workbook.test.cjs','real-workbook-results.json','real-inspection.json','password.txt'}
forbidden_ext={'.p12','.pfx','.jks','.keystore','.pem','.key'}
issues=[];count=0;archive_entries=0

def scan_bytes(data,label,depth=0):
 global archive_entries
 for name,pattern in patterns.items():
  if pattern.search(data):issues.append({'path':label,'reason':name})
 if zipfile.is_zipfile(io.BytesIO(data)):
  if depth>=5:issues.append({'path':label,'reason':'archive nesting too deep'});return
  try:
   with zipfile.ZipFile(io.BytesIO(data))as z:
    for item in z.infolist():
     archive_entries+=1
     if item.is_dir():continue
     if item.file_size>16*1024*1024:issues.append({'path':label,'reason':'oversized nested entry'});continue
     try:scan_bytes(z.read(item),label+'!'+item.filename,depth+1)
     except (RuntimeError,zipfile.BadZipFile):
      # Explicitly generated corruption/encryption fixtures are meant to fail reading.
      if Path(label.split('!')[0]).name not in {'encrypted.xlsx','broken.xlsx','fake.xlsx','legacy.xls'}:issues.append({'path':label,'reason':'unreadable nested entry'})
  except zipfile.BadZipFile:issues.append({'path':label,'reason':'unreadable archive'})
 if data.startswith(b'\x89PNG\r\n\x1a\n'):
  offset=8
  while offset+12<=len(data):
   n=struct.unpack('>I',data[offset:offset+4])[0];kind=data[offset+4:offset+8];body=data[offset+8:offset+8+n]
   if kind in {b'tEXt',b'iTXt',b'zTXt',b'eXIf'}:
    try:
     if kind==b'zTXt':body=zlib.decompress(body.split(b'\0',1)[1][1:])
     elif kind==b'iTXt':
      parts=body.split(b'\0',5)
      if len(parts)==6 and parts[1]==b'\x01':body=zlib.decompress(parts[5])
    except (ValueError,IndexError,zlib.error):issues.append({'path':label,'reason':'malformed compressed image metadata'})
    for name,pattern in patterns.items():
     if pattern.search(body):issues.append({'path':label,'reason':'image metadata: '+name})
   offset+=n+12

try:
 listed=subprocess.run(['git','-C',str(root),'ls-files','-z'],capture_output=True,check=True).stdout.split(b'\0')
 paths=[root/p.decode()for p in listed if p]
except subprocess.CalledProcessError:
 paths=[p for p in root.rglob('*')if p.is_file() and not any(x in {'.git','node_modules','android-build','dist','__pycache__'}for x in p.relative_to(root).parts)]
if not paths:raise SystemExit('No files selected; stage the reviewed public tree before scanning.')
for p in paths:
 rel=p.relative_to(root)
 if any(part in private_names for part in rel.parts) or p.suffix.lower()in forbidden_ext:issues.append({'path':str(rel),'reason':'private file name or material'})
 # Real-workbook CLI branch should never be inherited by the public DOM test.
 if p.name=='auto-ui.test.cjs' and b'if(process.argv[2])'in p.read_bytes():issues.append({'path':str(rel),'reason':'private workbook test branch'})
 scan_bytes(p.read_bytes(),str(rel));count+=1
for arg in sys.argv[1:]:
 p=Path(arg).resolve()
 scan_bytes(p.read_bytes(),p.name);count+=1
report={'files_checked':count,'nested_archive_entries_checked':archive_entries,'issues':issues}
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(1 if issues else 0)

from pathlib import Path
import re,html
root=Path(__file__).resolve().parents[1]
s=(root/'index.html').read_text()
def inline(m):
 text=(root/m[1]).read_text().replace('</script','<\\/script')
 text=re.sub(r'\n?//# sourceMappingURL=.*','',text)
 return '<script>'+text+'</script>'
s=re.sub(r'<script src="([^"]+)"></script>',inline,s)
licenses=root.parent/'third-party-licenses';notices=root.parent/'THIRD_PARTY_NOTICES.md'
if licenses.exists() and notices.exists():
 text=notices.read_text()+'\n\n'+'\n\n'.join(p.name+'\n'+p.read_text()for p in sorted(licenses.rglob('*'))if p.is_file() and p.suffix!='.json')
 s=s.replace('</body>','<template id="third-party-license-notices"><pre>'+html.escape(text)+'</pre></template></body>')
(root/'preview.html').write_text(s)
print('Self-contained preview:',len(s.encode()),'bytes')

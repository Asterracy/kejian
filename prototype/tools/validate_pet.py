#!/usr/bin/env python3
"""Validate Kejian v1 pet packages without extracting or executing content."""
import json, re, struct, sys, zipfile, zlib
from pathlib import Path

def require(ok, message):
    if not ok:
        raise ValueError(message)

def int_range(v, low, high):
    return type(v) is int and low <= v <= high

def png_size(data):
    require(data[:8] == b'\x89PNG\r\n\x1a\n' and len(data) >= 33, 'PNG signature invalid')
    require(data[12:16] == b'IHDR' and struct.unpack('>I', data[8:12])[0] == 13, 'PNG IHDR invalid')
    width, height = struct.unpack('>II', data[16:24])
    require(1 <= width <= 2048 and 1 <= height <= 2048, 'PNG dimensions out of range')
    require(zlib.crc32(data[12:29]) & 0xffffffff == struct.unpack('>I', data[29:33])[0], 'PNG IHDR CRC invalid')
    return width, height

def validate(path):
    require(path.stat().st_size <= 5*1024*1024, 'ZIP larger than 5 MB')
    with zipfile.ZipFile(path) as z:
        infos = z.infolist()
        require(2 <= len(infos) <= 3, 'Expected 2 or 3 root files')
        names = [i.filename for i in infos]
        require(len(set(names)) == len(names), 'Duplicate entry')
        require('manifest.json' in names, 'manifest.json missing')
        total = 0
        for i in infos:
            require(i.filename in ('manifest.json','LICENSE.txt') or re.fullmatch(r'[A-Za-z0-9_-]{1,76}\.png', i.filename), 'Unsafe or unsupported path')
            require(not i.is_dir() and ((i.external_attr >> 16) & 0xf000) != 0xa000, 'Directory/symlink prohibited')
            require(not i.flag_bits & 1, 'Encrypted ZIP prohibited')
            require(i.compress_type in (zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED), 'Unsupported compression')
            require(i.file_size <= 4*1024*1024, 'Entry too large')
            total += i.file_size
        require(total <= 8*1024*1024, 'Expanded ZIP too large')
        require(z.getinfo('manifest.json').file_size <= 16384, 'Manifest too large')
        if 'LICENSE.txt' in names:
            require(z.getinfo('LICENSE.txt').file_size <= 32768, 'License too large')
        m = json.loads(z.read('manifest.json').decode('utf8'))
        require(isinstance(m,dict) and m.get('version') == 1, 'Unsupported manifest version')
        require(isinstance(m.get('name'), str) and 1 <= len(m['name'].strip()) <= 40, 'Invalid name')
        image = m.get('image')
        require(isinstance(image,str) and len(image) <= 80 and re.fullmatch(r'[A-Za-z0-9_-]+\.png', image), 'Unsafe image path')
        require(image in names and set(names) <= {'manifest.json',image,'LICENSE.txt'}, 'Missing image or extra files')
        width, height = png_size(z.read(image))
        f = m.get('frame',{})
        require(all(int_range(f.get(k),32,256) for k in ('width','height')), 'Invalid frame dimensions')
        require(all(int_range(f.get(k),1,16) for k in ('columns','rows')) and f['columns']*f['rows'] <= 64, 'Invalid grid')
        require(width == f['width']*f['columns'] and height == f['height']*f['rows'], 'Grid/image dimensions mismatch')
        anim = m.get('animations')
        require(isinstance(anim,dict) and 'idle' in anim and set(anim) <= {'idle','tap'}, 'Invalid animations')
        for action,a in anim.items():
            require(isinstance(a,dict), 'Invalid action')
            frames = a.get('frames')
            require(isinstance(frames,list) and 1 <= len(frames) <= 64 and all(int_range(x,0,f['columns']*f['rows']-1) for x in frames), 'Invalid frame indices')
            require(int_range(a.get('fps'),1,12), 'Invalid fps')
            require('loop' not in a or isinstance(a['loop'],bool), 'Invalid loop')
        for i in infos:
            z.read(i.filename)  # ZipFile checks CRC for every allowed entry.
        return m['name'],width,height,len(infos)

if __name__ == '__main__':
    try:
        require(len(sys.argv)==2, 'Usage: python3 tools/validate_pet.py package.zip')
        name,w,h,count=validate(Path(sys.argv[1]))
        print(f'PASS: {name} · {w}×{h} · {count} safe root files')
        print('Next: visually inspect transparency, baseline consistency and loop continuity in the prototype.')
    except Exception as exc:
        print(f'FAIL: {exc}',file=sys.stderr)
        sys.exit(1)

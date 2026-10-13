# coding: utf-8
from pathlib import Path
import subprocess,json,math,wave,array,shutil
root=Path(__file__).resolve().parent;out=root/'output';out.mkdir(parents=True,exist_ok=True)
segments=[(.15,2.1,'课间，让课表一眼清楚。'),(2.75,3.35,'本节、下节，时间地点，顺手查看。'),(6.65,5.15,'导入 Excel 课表，自动识别。查看汇总，确认后保存。'),(12.55,4.05,'遇到调休，指定日期，课表跟着换。'),(17.4,4.65,'作业、活动，自定义提醒。重要的事，留个时间。'),(22.8,3.4,'开启锁屏课程卡片，详情也能隐藏。'),(26.7,2.0,'课间，离线，轻量，开源。')]
inputs=[];filters=[];tags=[]
for i,(start,limit,line) in enumerate(segments):
 p=out/f'voice-{i}.aiff';subprocess.run(['/usr/bin/say','-v','Tingting','-r','235','-o',str(p),line],check=True)
 dur=float(subprocess.check_output([shutil.which('ffprobe'),'-v','error','-show_entries','format=duration','-of','json',str(p)]).decode().split('"duration": "')[1].split('"')[0]);speed=max(1,dur/limit)
 inputs+=['-i',str(p)];filters.append(f'[{i}:a]atempo={speed:.5f},highpass=f=90,loudnorm=I=-16:TP=-2:LRA=7,aresample=48000,adelay={int(start*1000)}:all=1[v{i}]');tags.append(f'[v{i}]')
rate=48000;pcm=array.array('h');chords=[[57,60,64],[53,57,60],[55,59,62],[52,55,59]];beat=60/108
for n in range(int(29*rate)):
 t=n/rate;chord=chords[int(t/(beat*4))%4];phase=t%(beat/2);note=chord[int(t/(beat/2))%3]+12;f=440*2**((note-69)/12);env=math.exp(-phase*8);pluck=math.sin(2*math.pi*f*t)*env*.065+math.sin(2*math.pi*f*2*t)*env*.016
 pad=sum(math.sin(2*math.pi*440*2**((k-69)/12)*t) for k in chord)*.012;bass=math.sin(2*math.pi*440*2**((chord[0]-12-69)/12)*t)*.026
 fade=min(1,t/.7,max(0,(29-t)/.8));v=(pluck+pad+bass)*fade
 pcm.append(int(max(-1,min(1,v))*32767))
p=out/'original-music.wav'
with wave.open(str(p),'wb')as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(pcm.tobytes())
inputs+=['-i',str(p)];filters.append('[7:a]volume=0.42[music]');filters.append(''.join(tags)+'[music]amix=inputs=8:normalize=0,alimiter=limit=0.9,atrim=0:29[a]')
subprocess.run([shutil.which('ffmpeg'),'-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filters),'-map','[a]','-t','29','-ar','48000','-ac','2',str(out/'soundtrack.wav')],check=True)
(root/'narration.json').write_text(json.dumps(segments,ensure_ascii=False,indent=2))
print('Chinese narration and original synthesized soundtrack ready')

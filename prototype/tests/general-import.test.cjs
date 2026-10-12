/* Independent synthetic fixtures for the automatic workbook importer.
 * No real workbook content or personal data is used here. Run from prototype:
 *   node tests/general-import.test.cjs
 * Generates auditable general-*.xlsx files, then reloads their XLSX bytes.
 */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ExcelJS=require('../vendor/exceljs-4.4.0.min.js');
const E=require('../excel-core.js');
const root=path.resolve(__dirname,'..');
const results=[];
let failures=0;
function check(name,fn){try{fn();results.push({name,status:'pass'});}catch(error){failures++;results.push({name,status:'fail',message:error.message});console.error('FAIL '+name+'\n'+error.message);}}
function sheet(w,name,rows,merges=[]){const s=w.addWorksheet(name);for(const row of rows)s.addRow(row);for(const range of merges)s.mergeCells(range);return s;}
function book(){return new ExcelJS.Workbook();}
async function reload(name,w){const bytes=await w.xlsx.writeBuffer();const fixture=path.join(root,'examples','general-'+name+'.xlsx');if(process.env.KEJIAN_WRITE_FIXTURES==='1'||!fs.existsSync(fixture))fs.writeFileSync(fixture,Buffer.from(bytes));const loaded=book();await loaded.xlsx.load(await E.normalizeXlsx(bytes));return loaded;}
function analyze(w,options={}){const r=E.analyzeWorkbook(w,options);assert.ok(Array.isArray(r.candidates),'candidates array');assert.ok(Array.isArray(r.sheets),'sheet summaries');assert.ok(Array.isArray(r.issues),'issues array');assert.equal(typeof r.needsTerm,'boolean');return r;}
function dated(r,options={}){return E.materialize(r.candidates,options);}
function course(rows,name){const found=rows.filter(c=>c.name===name);assert.ok(found.length,'missing course '+name);return found;}
function facts(rows){return rows.map(c=>[c.name,c.date,c.start,c.end,c.location||''].join('|')).sort();}
function provenance(rows){for(const c of rows){assert.ok(c.source&&typeof c.source==='string','every session keeps its worksheet/cell source');assert.ok(c.raw&&((Array.isArray(c.raw)&&c.raw.length)||typeof c.raw==='string'),'every session keeps original text');}}
(async()=>{
  // Fixture creation is intentionally independent from the importer's mapping logic.
  const list=book();sheet(list,'导入说明',[['使用说明：本文件为合成测试'],['请在导入时核对信息']]);sheet(list,'空白',[]);
  const ls=sheet(list,'带前导行的课程清单',[
    ['2026 秋季课表（合成）'],[],['请核对课程地点'],
    ['  教室  ','结束时间','课程名称','日期','开始时间'],
    ['北楼 203','09:45','离散数学',new Date('2026-10-12T00:00:00Z'),8.5/24],
    ['', '11:40','英语听说','2026/10/13','10:10'],
    [],['南楼 5','15:20','材料实验','2026年10月14日','13:30']
  ],['A1:E1']);ls.getCell('D5').numFmt='yyyy-mm-dd';ls.getCell('E5').numFmt='hh:mm';
  const listW=await reload('list-shifted',list);
  if(typeof E.analyzeWorkbook!=='function'||typeof E.materialize!=='function')throw Error('Automatic-import API is not yet present; synthetic fixtures were generated.');
  const lr=analyze(listW),lc=dated(lr);
  check('list: shifted header, column permutation, blank rows and three date formats',()=>assert.deepEqual(facts(lc),[
    '离散数学|2026-10-12|08:30|09:45|北楼 203','英语听说|2026-10-13|10:10|11:40|','材料实验|2026-10-14|13:30|15:20|南楼 5'
  ].sort()));
  check('list: explicit dates need no semester anchor',()=>assert.equal(lr.needsTerm,false));
  check('list: instructions and blank worksheets yield no course candidates',()=>{assert.equal(lc.length,3);assert.ok(lr.sheets.some(s=>s.name==='导入说明'&&s.count===0));assert.ok(lr.sheets.some(s=>s.name==='空白'&&s.count===0));});
  check('list: missing classroom is nonblocking and remains blank',()=>assert.equal(course(lc,'英语听说')[0].location,''));
  check('list: all dated sessions retain provenance',()=>provenance(lc));

  const english=book();sheet(english,'English reordered',[
    ['Synthetic course list'],[],[' END ','NAME','LOCATION',' DATE ',' START '],
    ['10:00','Computing','Lab C','2026-10-15','09:00'],['12:15','Writing','','2026-10-16','11:30']
  ]);
  const er=analyze(await reload('list-english',english));
  check('English list: whitespace and case do not change header recognition',()=>assert.deepEqual(facts(dated(er)),['Computing|2026-10-15|09:00|10:00|Lab C','Writing|2026-10-16|11:30|12:15|']));

  const h=book();sheet(h,'横向星期课表',[
    ['测试：横向星期、合并与单双周'],[],
    ['钟点','星期一','星期二','星期三','星期四','星期五'],
    ['第1节 08:00–08:45','课程：网络原理\n地点：A201\n周次：1-4周（单周）','','课程：艺术史\n周次：1-4周（双周）','',''],
    ['第2节 08:55–09:40','','','','',''],
    ['第3节 10:00–10:45','','课程：体育\n周次：2,4周','','','']
  ],['A1:F1','B4:B5','D4:D5']);
  const hr=analyze(await reload('horizontal-parity-merged',h));const hc=dated(hr,{monday:'2026-09-07',maxWeeks:4});
  check('horizontal grid: course spanning two clock rows appears once per scheduled week',()=>assert.deepEqual(facts(course(hc,'网络原理')),['网络原理|2026-09-07|08:00|09:40|A201','网络原理|2026-09-21|08:00|09:40|A201']));
  check('horizontal grid: odd/even weeks and isolated week list preserve correct dates',()=>{assert.deepEqual(course(hc,'艺术史').map(c=>c.date).sort(),['2026-09-16','2026-09-30']);assert.deepEqual(course(hc,'体育').map(c=>c.date).sort(),['2026-09-15','2026-09-29']);assert.equal(hc.length,6);});
  check('horizontal grid: semester anchor is required and not invented',()=>{assert.equal(hr.needsTerm,true);assert.throws(()=>dated(hr));});
  check('horizontal grid: merged course raw text and worksheet source survive expansion',()=>provenance(hc));

  const v=book();sheet(v,'Vertical',[
    ['Rotated timetable'],[],['Day','08:15–09:00','10:00–10:45'],
    ['Monday','Course: Algebra\nRoom: M12\nWeeks: 1-2',''],
    ['Wednesday','','Course: Ecology\nWeeks: 2'],
    ['Friday','','']
  ]);
  const vr=analyze(await reload('vertical-english',v));const vc=dated(vr,{monday:'2026-09-07',maxWeeks:2});
  check('vertical grid: English day axis and course labels',()=>assert.deepEqual(facts(vc),['Algebra|2026-09-07|08:15|09:00|M12','Algebra|2026-09-14|08:15|09:00|M12','Ecology|2026-09-16|10:00|10:45|']));

  const weekly=book();sheet(weekly,'第1周',[
    ['第1周 2026-09-07 至 2026-09-13'],[],['时间','周一','周三'],
    ['09:00-09:50','课程：化学\n地点：楼1','课程：音乐']
  ],['A1:C1']);sheet(weekly,'第2周',[
    ['第2周 2026/09/14 - 2026/09/20'],['时间','周一','周三'],
    ['09:00-09:50','课程：化学\n地点：楼2','']
  ],['A1:C1']);sheet(weekly,'附注',[['调课请以学校通知为准']]);
  const wr=analyze(await reload('dated-week-sheets',weekly));const wc=dated(wr);
  check('weekly sheets: exact Monday-Sunday sheet date ranges remove need for term input',()=>{assert.equal(wr.needsTerm,false);assert.deepEqual(facts(wc),['化学|2026-09-07|09:00|09:50|楼1','化学|2026-09-14|09:00|09:50|楼2','音乐|2026-09-09|09:00|09:50|'].sort());});
  check('weekly sheets: same course in different sheets is not collapsed',()=>{assert.equal(course(wc,'化学').length,2);assert.notEqual(course(wc,'化学')[0].source,course(wc,'化学')[1].source);provenance(wc);});

  const multi=book();sheet(multi,'单格两课程',[
    ['钟点','周二','周四'],['14:00–14:45',
      '课程：数值分析\n教室：计算楼102\n周次：1-2周（单周）\n\n课程：概率论\n教室：计算楼105\n周次：1-2周（双周）','']
  ]);
  const mr=analyze(await reload('multiple-blocks',multi));const mc=dated(mr,{monday:'2026-09-07',maxWeeks:2});
  check('mixed cell: two explicit course blocks retain their own weeks and classrooms',()=>assert.deepEqual(facts(mc),['数值分析|2026-09-08|14:00|14:45|计算楼102','概率论|2026-09-15|14:00|14:45|计算楼105'].sort()));
  check('mixed cell: both blocks keep original cell source',()=>{assert.equal(mc[0].source,mc[1].source);provenance(mc);});

  const shared=book();sheet(shared,'作息时间',[
    ['节次','开始时间','结束时间'],['第1节','08:00','08:45'],['第2节','08:55','09:40'],['第3节','10:00','10:45']
  ]);sheet(shared,'第1周',[
    ['节次','周一','周五'],['第1节','课程：机械制图',''],['第2节','',''],['第3节','','课程：伦理学']
  ],['B2:B3']);
  const sr=analyze(await reload('shared-period-clock',shared));const sc=dated(sr,{monday:'2026-09-07',maxWeeks:2});
  check('shared period table: merged periods use supplied clock table, not estimated times',()=>assert.deepEqual(facts(sc),['机械制图|2026-09-07|08:00|09:40|','伦理学|2026-09-11|10:00|10:45|'].sort()));
  check('shared period table: clock rows are not imported as courses',()=>assert.equal(sc.length,2));

  const conflicting=book();sheet(conflicting,'节次时间表A',[
    ['节次','开始时间','结束时间'],['第1节','08:00','08:45']
  ]);sheet(conflicting,'节次时间表B',[
    ['节次','开始时间','结束时间'],['第1节','09:00','09:45']
  ]);sheet(conflicting,'第1周',[
    ['节次','周一','周二'],['第1节','课程：钟点有歧义','']
  ]);
  const clr=analyze(await reload('conflicting-period-clock',conflicting));
  check('conflicting clock tables: importer does not select an arbitrary campus schedule',()=>{assert.equal(clr.candidates.length,1);assert.equal(clr.candidates[0].start,'');assert.equal(clr.candidates[0].end,'');assert.ok(clr.candidates[0].warnings.length||clr.issues.length);});

  const missing=book();sheet(missing,'缺钟点和范围',[
    ['节次','周一','周二'],['第1-2节','课程：公共管理\n周次：1-2周','课程：研究讨论']
  ]);
  const nr=analyze(await reload('missing-key-fields',missing));
  check('missing critical fields: analysis flags term dependence and exposes issues',()=>{assert.equal(nr.needsTerm,true);assert.ok(nr.issues.length||nr.candidates.some(c=>c.warnings?.length),'reviewable missing-field warning');});
  check('missing critical fields: neither period clocks nor semester date are guessed',()=>{for(const c of nr.candidates){assert.equal(c.start,'');assert.equal(c.end,'');assert.ok(!c.date);}assert.throws(()=>dated(nr));});
  check('missing week bounds: user supplied maxWeeks explicitly expands unspecified range',()=>{const nc=dated(nr,{monday:'2026-09-07',maxWeeks:2});assert.equal(course(nc,'研究讨论').length,2);assert.equal(course(nc,'公共管理').length,2);for(const c of nc){assert.equal(c.start,'');assert.equal(c.end,'');}});

  const ambiguous=book();sheet(ambiguous,'跨星期合并',[
    ['时间','周一','周二','周三'],['08:00-08:45','课程：跨日研讨\n周次：1-2周','','']
  ],['B2:C2']);
  const ar=analyze(await reload('ambiguous-day-merge',ambiguous));
  check('ambiguous day: horizontal merge cannot silently pick the first weekday',()=>{assert.equal(ar.candidates.length,1);assert.ok(!ar.candidates[0].day);assert.throws(()=>dated(ar,{monday:'2026-09-07',maxWeeks:2}));});

  const formula=book();const fsheet=sheet(formula,'公式',[
    ['date','name','start','end'],['2026-10-12',null,'09:00','10:00']
  ]);fsheet.getCell('B2').value={formula:'"Cached fake course"',result:'Cached fake course'};
  const fr=analyze(await reload('formula-review',formula));
  check('formula: cached results are never accepted as course names',()=>{assert.ok(!fr.candidates.some(c=>c.name==='Cached fake course'));assert.ok(fr.issues.length||fr.candidates.some(c=>c.warnings?.length));});

  const dayList=book();sheet(dayList,'星期列表',[
    ['课程名','星期','周次','时间','地点'],
    ['科学写作','星期四','1-4周（双周）','15:00至15:45','未提供'],
    ['统计学','Mon','1,3周','08:00—08:50','B-205']
  ]);
  const dlr=analyze(await reload('weekday-list',dayList));const dlc=dated(dlr,{monday:'2026-09-07',maxWeeks:4});
  check('weekday list: bounded rules need only a semester anchor',()=>assert.deepEqual(facts(dated(dlr,{monday:'2026-09-07'})),facts(dlc)));
  check('weekday list: week rules and explicit time ranges produce exact sessions',()=>assert.deepEqual(facts(dlc),[
    '科学写作|2026-09-17|15:00|15:45|','科学写作|2026-10-01|15:00|15:45|',
    '统计学|2026-09-07|08:00|08:50|B-205','统计学|2026-09-21|08:00|08:50|B-205'
  ].sort()));

  const partial=book();sheet(partial,'第3周',[
    ['2026-09-21 至 2026-09-26'],['时间','星期一','星期三'],
    ['08:00-08:45','课程：不完整日期范围','']
  ],['A1:C1']);
  const ptr=analyze(await reload('partial-week-range',partial));
  check('incomplete week range: Monday-Saturday cannot supply an inferred semester anchor',()=>{assert.equal(ptr.needsTerm,true);assert.ok(!ptr.candidates[0].date);assert.throws(()=>dated(ptr));});
  check('week number: explicit 第3周 still preserves week offset after user provides anchor',()=>assert.equal(dated(ptr,{monday:'2026-09-07'})[0].date,'2026-09-21'));

  const duplicate=book();for(const n of ['原表','重复视图'])sheet(duplicate,n,[
    ['date','name','start','end'],['2026-10-12','同一节课','08:00','08:45']
  ]);
  const dur=analyze(await reload('duplicate-provenance',duplicate));const duc=dated(dur);
  check('duplicate views: deduplicated session retains both worksheet sources',()=>{assert.equal(duc.length,1);assert.equal(duc[0].sources.length,2);assert.ok(duc[0].sources.some(s=>s.source.startsWith('原表!')));assert.ok(duc[0].sources.some(s=>s.source.startsWith('重复视图!')));});

  const invalid=book();sheet(invalid,'非法日期',[
    ['date','name','start','end'],['2026-02-30','不应滚到三月','08:00','08:45']
  ]);
  const ir=analyze(await reload('invalid-calendar-date',invalid));
  check('invalid calendar date: cannot normalize to a different real day',()=>{assert.ok(!ir.candidates[0].date);assert.throws(()=>dated(ir));});

  const parityWeek=book();sheet(parityWeek,'第2周',[
    ['第2周 2026-09-14 至 2026-09-20'],['时间','周一','周三'],
    ['08:00-08:45','课程：单周课不应出现\n周次：1-4周（单周）','课程：偶数周课\n周次：1-4周（双周）']
  ],['A1:C1']);
  const pwr=analyze(await reload('dated-week-parity',parityWeek));
  check('dated week grid: parity rule filters classes that do not meet in that page week',()=>assert.deepEqual(facts(dated(pwr)),['偶数周课|2026-09-16|08:00|08:45|']));

  const parityList=book();sheet(parityList,'第2周',[
    ['第2周 2026-09-14 至 2026-09-20'],['name','day','weeks','start','end'],
    ['列表单周课','Monday','1-4周（单周）','08:00','08:45'],
    ['列表双周课','Wednesday','1-4周（双周）','10:00','10:45']
  ],['A1:E1']);const plw=await reload('dated-week-list-parity',parityList);
  check('dated week list: excluded first row does not corrupt later course provenance',()=>{const r=analyze(plw),c=dated(r);assert.deepEqual(facts(c),['列表双周课|2026-09-16|10:00|10:45|']);assert.ok(c[0].raw.join(' ').includes('列表双周课'));});

  const parityMerge=book();sheet(parityMerge,'第2周过滤首条',[
    ['第2周 2026-09-14 至 2026-09-20'],['时间','周一','周二','周三'],
    ['08:00-08:45','课程：过滤的跨日单周课\n周次：1-4周（单周）','','课程：保留的周三课\n周次：1-4周（双周）']
  ],['A1:D1','B3:C3']);sheet(parityMerge,'第2周过滤后条',[
    ['第2周 2026-09-14 至 2026-09-20'],['时间','周一','周二','周三'],
    ['10:00-10:45','课程：保留的周一课\n周次：1-4周（双周）','课程：过滤的第二跨日单周课\n周次：1-4周（单周）','']
  ],['A1:D1','C3:D3']);const pmw=await reload('dated-week-filtered-merge',parityMerge);
  check('dated week merge: filtered ambiguous course cannot clear another course date or crash',()=>{const c=dated(analyze(pmw));assert.deepEqual(facts(c),['保留的周一课|2026-09-14|10:00|10:45|','保留的周三课|2026-09-16|08:00|08:45|'].sort());});

  function anchorBook(conflict=false){const w=book();sheet(w,'第1周',[
    ['第1周 2026-09-07 至 2026-09-13'],['时间','周一','周三'],['08:00-08:45','课程：锚点课程一','']
  ],['A1:C1']);sheet(w,'第3周',[
    [conflict?'第3周 2026-09-28 至 2026-10-04':'第3周 2026-09-21 至 2026-09-27'],
    ['时间','周一','周三'],['08:00-08:45','','课程：锚点课程三']
  ],['A1:C1']);sheet(w,'星期课程列表',[
    ['name','day','weeks','start','end'],['跨表锚点统计学','Friday','2,4周','13:00','13:45']
  ]);return w;}
  const abr=analyze(await reload('consistent-cross-sheet-anchor',anchorBook()));
  check('cross-sheet anchor: consistent week numbers and full dates determine first-week Monday',()=>{assert.equal(abr.needsTerm,false);assert.deepEqual(facts(course(dated(abr),'跨表锚点统计学')),['跨表锚点统计学|2026-09-18|13:00|13:45|','跨表锚点统计学|2026-10-02|13:00|13:45|']);});
  check('cross-sheet anchor: derived value retains explicit source evidence',()=>{const c=abr.candidates.find(c=>c.name==='跨表锚点统计学');assert.equal(c.anchorMonday,'2026-09-07');assert.ok(c.anchorSource);});
  const acr=analyze(await reload('conflicting-cross-sheet-anchor',anchorBook(true)));
  check('conflicting anchors: undated classes remain blocked until user chooses a semester date',()=>{assert.equal(acr.needsTerm,true);assert.ok(acr.issues.length);assert.throws(()=>dated(acr));assert.ok(!acr.candidates.find(c=>c.name==='跨表锚点统计学').anchorMonday);});

  const looseBlocks=book();sheet(looseBlocks,'明确分组的混合文本',[
    ['time','Monday','Wednesday'],['09:00-09:45','Graph theory\nA-101\n1-2周\n\nEnglish grammar\nB-102\n1-2周','']
  ]);
  const lbr=analyze(await reload('unlabeled-separated-blocks',looseBlocks));
  check('unlabeled mixed text: explicit blank-line groups preserve separate names and locations',()=>assert.deepEqual(facts(dated(lbr,{monday:'2026-09-07'})),[
    'Graph theory|2026-09-07|09:00|09:45|A-101','Graph theory|2026-09-14|09:00|09:45|A-101',
    'English grammar|2026-09-07|09:00|09:45|B-102','English grammar|2026-09-14|09:00|09:45|B-102'
  ].sort()));
  const noGroups=book();sheet(noGroups,'没有明确分组的混合文本',[
    ['时间','周一','周三'],['09:00-09:45','Graph theory\nA-101\nEnglish grammar\nB-102\n1-2周','']
  ]);
  const ngr=analyze(await reload('unlabeled-ambiguous-text',noGroups));
  check('unlabeled mixed text: uncertain grouping is warned and remains in original raw text',()=>{assert.ok(ngr.candidates.length);assert.ok(ngr.candidates.some(c=>c.warnings.length)||ngr.issues.length);assert.ok(ngr.candidates.some(c=>c.raw.join(' ').includes('English grammar')));});

  const footer=book();sheet(footer,'列表底部合并说明',[
    ['date','name','location','start','end'],
    ['2026-10-12','测量学','工程楼101','08:00','08:45'],
    ['2026-10-13','地形学','工程楼102','10:00','10:45'],[],
    ['说明：本表仅用于课程安排；如有调课以学院通知为准'],[]
  ],['A5:E6']);
  const ftr=analyze(await reload('list-merged-footer',footer));
  check('merged footer: annotation spanning key columns and two rows yields no fake courses',()=>{assert.equal(ftr.candidates.length,2);assert.deepEqual(facts(dated(ftr)),['测量学|2026-10-12|08:00|08:45|工程楼101','地形学|2026-10-13|10:00|10:45|工程楼102'].sort());assert.ok(!ftr.candidates.some(c=>c.name.includes('说明')));});

  const nameMerge=book();sheet(nameMerge,'课程名纵向合并',[
    ['date','name','location','start','end'],
    ['2026-10-12','同一课程两次授课','东楼201','08:00','08:45'],
    ['2026-10-13','','西楼302','10:00','10:45']
  ],['B2:B3']);
  const nmr=analyze(await reload('list-name-only-merge',nameMerge));const nmc=dated(nmr);
  check('name-only vertical merge: different dated rows remain distinct courses',()=>assert.deepEqual(facts(nmc),['同一课程两次授课|2026-10-12|08:00|08:45|东楼201','同一课程两次授课|2026-10-13|10:00|10:45|西楼302'].sort()));
  check('name-only vertical merge: each dated row retains its own provenance',()=>{assert.notEqual(nmc[0].source,nmc[1].source);assert.ok(nmc[0].raw.join(' ').includes('2026-10-12'));assert.ok(nmc[1].raw.join(' ').includes('2026-10-13'));});

  const naturalPlace=book();const placeholders=['教务系统未提供具体时间地点','学院暂未注明具体地点，待班级通知','教务记录未提供时间和地点'];sheet(naturalPlace,'自然语言地点占位',[
    ['date','name','location','start','end'],
    ...placeholders.map((t,i)=>['2026-10-'+(12+i),'自然地点样本'+i,t,'08:00','08:45'])
  ]);
  const npr=analyze(await reload('natural-language-missing-place',naturalPlace));const npc=dated(npr);
  check('natural-language missing place: absence text remains blank instead of becoming a classroom',()=>{assert.equal(npc.length,3);for(const c of npc)assert.equal(c.location,'');});
  check('natural-language missing place: original absence wording stays in row raw',()=>{for(let i=0;i<placeholders.length;i++)assert.ok(course(npc,'自然地点样本'+i)[0].raw.join(' ').includes(placeholders[i]));});

  const complexWeeks=book();const complexRule='1-8周（第3周可能调课，详见教务公告）';sheet(complexWeeks,'有复杂附注的周次列表',[
    ['name','day','weeks','start','end'],['课程附注样本','Monday',complexRule,'08:00','08:45']
  ]);
  const cwr=analyze(await reload('complex-week-annotation-list',complexWeeks));
  check('complex week annotation: whole rule and original note are preserved for concentrated review',()=>{assert.equal(cwr.candidates[0].weeks,complexRule);assert.ok(cwr.candidates[0].raw.join(' ').includes(complexRule));assert.ok(cwr.candidates[0].warnings.some(w=>/周次|附注|未解析/.test(w)));});
  check('complex week annotation: cannot silently expand the valid prefix before rule is resolved',()=>assert.throws(()=>dated(cwr,{monday:'2026-09-07',maxWeeks:8})));
  check('complex week annotation: explicit rule correction permits expansion without losing original raw',()=>{const edited={...cwr.candidates[0],weeks:'1-8周'};const c=E.materialize([edited],{monday:'2026-09-07',maxWeeks:8});assert.equal(c.length,8);assert.ok(c.every(x=>x.raw.join(' ').includes(complexRule)));});

  // Metamorphic controls use equivalent data with different positions and text.
  const compact=book();sheet(compact,'原布局',[
    ['date','name','start','end','location'],['2026-10-12','控制样本','08:00','08:45','A1']
  ]);
  const perturbed=book();sheet(perturbed,'扰动布局',[
    ['Independent synthetic workbook'],[],[],['location','end','date','start','name'],
    ['A1','08:45','2026/10/12','08:00','控制样本']
  ],['A1:E1']);
  const cr=analyze(await reload('metamorphic-base',compact)),pr=analyze(await reload('metamorphic-perturbed',perturbed));
  check('metamorphic: leading rows, reordered columns and date punctuation preserve sessions',()=>assert.deepEqual(facts(dated(cr)),facts(dated(pr))));
  check('metamorphic: provenance updates to the new sheet and row',()=>{assert.notEqual(dated(cr)[0].source,dated(pr)[0].source);});

  fs.writeFileSync(path.join(root,'examples','general-results.json'),JSON.stringify({method:'Independent synthetic XLSX roundtrip; no physical-device claim',checks:results.length,failures,results},null,2)+'\n');
  console.log(`${results.length-failures}/${results.length} general importer checks passed (${failures} failures).`);
  if(failures)process.exitCode=1;
})().catch(error=>{console.error(error.stack);process.exitCode=1;});

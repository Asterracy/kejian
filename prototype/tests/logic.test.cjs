const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const main=fs.readFileSync('index.html','utf8'),pets=fs.readFileSync('pets.js','utf8');
function section(src,start,end){return src.slice(src.indexOf(start),src.indexOf(end,src.indexOf(start)));}
const ctx={TextDecoder,Uint8Array,DataView,Blob,DecompressionStream,MiB:1024*1024};vm.createContext(ctx);
vm.runInContext(section(main,'function localDate(','function now(')+section(main,'function validDate(','function projected(')+section(main,'function parseCSV(','$(\'file\').addEventListener(')+section(pets,'function fail(','async function png('),ctx);
const tests=[];function check(name,fn){fn();tests.push({name,status:'pass'});}
check('invalid calendar date rejected',()=>assert.equal(ctx.validDate('2026-02-30'),false));
check('leap calendar date accepted',()=>assert.equal(ctx.validDate('2028-02-29'),true));
check('minute precision and bounds',()=>{assert.equal(ctx.validTime('23:59'),true);assert.equal(ctx.validTime('24:00'),false);assert.equal(ctx.validTime('12:99'),false);});
check('quoted CSV comma and newline',()=>{const r=ctx.parseCSV('date,name,location\r\n2026-10-12,"English, I","Room\nB"');assert.equal(r[0].name,'English, I');assert.equal(r[0].location,'Room\nB');});
check('unclosed CSV quote rejected',()=>assert.throws(()=>ctx.parseCSV('date,name\n2026-10-12,"Bad')));
check('duplicate CSV header rejected',()=>assert.throws(()=>ctx.parseCSV('date,name,name\n2026-10-12,A,A')));
check('invalid date course rejected',()=>assert.throws(()=>ctx.validateCourses([{date:'2026-02-30',name:'A'}])));
check('missing optional location and time retained as empty',()=>{const r=ctx.validateCourses([{date:'2026-10-12',name:'A'}]);assert.equal(r[0].location,'');assert.equal(r[0].start,'');});
check('reversed course time rejected',()=>assert.throws(()=>ctx.validateCourses([{date:'2026-10-12',name:'A',start:'17:00',end:'16:00'}])));
check('overlapping courses rejected',()=>assert.throws(()=>ctx.validateCourses([{date:'2026-10-12',name:'A',start:'08:00',end:'10:00'},{date:'2026-10-12',name:'B',start:'09:00',end:'11:00'}])));
check('adjacent courses accepted',()=>assert.equal(ctx.validateCourses([{date:'2026-10-12',name:'A',start:'08:00',end:'09:00'},{date:'2026-10-12',name:'B',start:'09:00',end:'10:00'}]).length,2));
check('zip slip path rejected',()=>{assert.equal(ctx.safePath('../sprite.png'),false);assert.equal(ctx.safePath('/sprite.png'),false);assert.equal(ctx.safePath('a\\sprite.png'),false);assert.equal(ctx.safePath('sprite.png'),true);});
const manifest=JSON.parse(fs.readFileSync('examples/pet-manifest.json','utf8'));
check('valid sprite manifest accepted',()=>assert.equal(ctx.validateManifest(manifest,512,128).name,'小团示例'));
check('sprite dimension mismatch rejected',()=>assert.throws(()=>ctx.validateManifest(manifest,256,128)));
check('out of range frame rejected',()=>{const m=structuredClone(manifest);m.animations.idle.frames=[999];assert.throws(()=>ctx.validateManifest(m,512,128));});
check('excessive fps rejected',()=>{const m=structuredClone(manifest);m.animations.idle.fps=60;assert.throws(()=>ctx.validateManifest(m,512,128));});
check('missing idle rejected',()=>{const m=structuredClone(manifest);delete m.animations.idle;assert.throws(()=>ctx.validateManifest(m,512,128));});
check('known CRC32 value',()=>assert.equal(ctx.crc32(new TextEncoder().encode('123456789')),0xcbf43926));
(async()=>{for(const file of ['tuantuan.pet.zip','tuantuan-stored.pet.zip']){const b=fs.readFileSync('examples/'+file);const out=await ctx.unzip(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));assert.ok(out['sprite.png']);tests.push({name:file+' verified',status:'pass'});}for(const file of ['unsafe-path.zip','unsafe-script.zip']){const b=fs.readFileSync('examples/'+file);await assert.rejects(ctx.unzip(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)));tests.push({name:file+' rejected',status:'pass'});}const b=fs.readFileSync('examples/tuantuan-stored.pet.zip');b[45]^=1;await assert.rejects(ctx.unzip(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)));tests.push({name:'corrupt CRC rejected',status:'pass'});fs.writeFileSync('tests/logic-results.json',JSON.stringify(tests,null,2));console.log(tests.length+' logic and package checks passed');})().catch(e=>{console.error(e);process.exitCode=1;});

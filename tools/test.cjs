'use strict';
const path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const [script,cwd]of [['tests/logic.test.cjs','prototype'],['tests/excel.test.cjs','prototype'],['tests/general-import.test.cjs','prototype'],['prototype/tests/auto-ui.test.cjs','.']]){
 const r=spawnSync(process.execPath,[script],{cwd:path.join(root,cwd),stdio:'inherit'});
 if(r.error)throw r.error;
 if(r.status!==0)process.exit(r.status||1);
}
console.log('All synthetic parser, package and DOM/native-bridge mock tests passed.');

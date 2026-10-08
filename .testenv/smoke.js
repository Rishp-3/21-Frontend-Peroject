const {JSDOM}=require('jsdom');const fs=require('fs'),path=require('path');
process.on('uncaughtException',e=>{console.log(CURRENT+': UNCAUGHT '+e.message);});
let CURRENT='';
const root='/workspace';
const dirs=fs.readdirSync(root).filter(d=>/^\d\d-/.test(d)&&fs.statSync(path.join(root,d)).isDirectory());
(async()=>{
for(const d of dirs){
  CURRENT=d;
  const html=fs.readFileSync(path.join(root,d,'index.html'),'utf8');
  const errs=[];
  const dom=new JSDOM(html,{url:'http://localhost/'+d+'/index.html',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;
  w.addEventListener('error',e=>errs.push('window: '+e.message));
  w.fetch=()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({list:[],Search:[],Error:'',weather:[],main:{},visibility:1000})});
  w.navigator.clipboard={writeText:()=>Promise.resolve()};
  w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addEventListener(){},removeEventListener(){}}));
  const scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m=>m[1]);
  for(const s of scripts){
    const p=path.join(root,d,s);
    let code; try{code=fs.readFileSync(p,'utf8');}catch(e){errs.push('missing script '+s);continue;}
    try{w.eval(code);}catch(e){errs.push('load '+s+': '+e.message);}
  }
  await new Promise(r=>setTimeout(r,150));
  console.log(`${d}: ${errs.length?'ERRORS -> '+errs.join(' | '):'OK'}`);
}
console.log('DONE');
})();

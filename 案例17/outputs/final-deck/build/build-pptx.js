const path = require('path');
const fs = require('fs');
const PptxGenJS = require('pptxgenjs');

const root = path.resolve(__dirname, '..');
const spec = JSON.parse(fs.readFileSync(path.join(root, 'slide-spec.json'), 'utf8'));
const out = path.join(root, 'case17-ai-video-creative-control.pptx');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Case 17 / Codex';
pptx.subject = 'AI video creative control methodology';
pptx.title = spec.deck.title;
pptx.company = 'Case 17';
pptx.lang = 'zh-CN';
pptx.theme = {
  headFontFace: 'Microsoft YaHei', bodyFontFace: 'Microsoft YaHei', lang: 'zh-CN'
};
pptx.defineSlideMaster({
  title: 'BLANK_WIDE',
  background: { color: 'F2EEE3' },
  objects: [],
  slideNumber: { x: 12.45, y: 7.18, w: 0.45, h: 0.16, fontFace: 'Consolas', fontSize: 6.8, color: '67635C', align: 'right', margin: 0 }
});

const C = { black:'101112', ivory:'F2EEE3', orange:'F34A2A', white:'FFFFFF', teal:'57D8C8', muted:'67635C', pale:'C8C2B7', line:'CFC8BA' };
const SH = pptx.ShapeType;
const imgPath = name => path.join(root, name.replaceAll('/', path.sep));
const addText = (s, text, x, y, w, h, o={}) => s.addText(Array.isArray(text) ? text : String(text), {
  x,y,w,h, fontFace:o.fontFace || 'Microsoft YaHei', fontSize:o.fontSize || 18,
  color:o.color || C.black, bold:!!o.bold, breakLine:false, margin:o.margin ?? 0,
  valign:o.valign || 'mid', align:o.align || 'left', fit:'shrink',
  charSpacing:o.charSpacing || 0, paraSpaceAfterPt:0, lineSpacingMultiple:1,
  isTextBox:true, transparency:o.transparency || 0,
  ...o
});
const rect = (s,x,y,w,h,fill,line='none',transparency=0) => s.addShape(SH.rect,{x,y,w,h,fill:{color:fill,transparency},line:line==='none'?{color:fill,transparency:100}:{color:line,width:0.7},radius:0});
const line = (s,x,y,w,h,color=C.black,width=1,dash='solid') => s.addShape(SH.line,{x,y,w,h,line:{color,width,dashType:dash,beginArrowType:'none',endArrowType:'none'}});
const arrow = (s,x,y,w,h,color=C.orange,width=0.8,dash='solid') => s.addShape(SH.line,{x,y,w,h,line:{color,width,dashType:dash,beginArrowType:'none',endArrowType:'triangle'}});
const circle = (s,x,y,d,fill) => s.addShape(SH.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,transparency:100}});
const image = (s,file,x,y,w,h,alt='') => s.addImage({path:imgPath(file),x,y,w,h,sizing:{type:'cover',x,y,w,h},altText:alt,objectName:alt||path.basename(file)});
const label = (s,text,x,y,w,color=C.black,size=7.5) => addText(s,text,x,y,w,0.18,{fontFace:'Consolas',fontSize:size,bold:true,color,charSpacing:1.2});
function footer(s, slide, dark=false){
  line(s,0.67,7.05,12,0,dark?'6A6A6A':'2A2926',0.45);
  label(s, slide.source_timestamps.length ? `CASE 13 · ${slide.source_timestamps.join(' / ')}` : 'CASE 17 · METHOD DECK',0.67,7.16,3.8,dark?'AAA49B':C.muted,6.2);
  label(s, `render_mode: ${slide.render_mode}`,10.25,7.16,1.65,dark?'AAA49B':C.muted,6.2);
  addText(s,`${slide.id} / 10`,12.08,7.14,0.58,0.18,{fontFace:'Consolas',fontSize:7.3,bold:true,color:dark?C.white:C.black,align:'right'});
}
function header(s, slide, eyebrow, dark=false){
  label(s,eyebrow,0.67,0.39,5,dark?C.white:C.black,7.4);
  addText(s,slide.title,0.67,0.72,9.9,0.56,{fontSize:27.5,bold:true,color:dark?C.white:C.black,charSpacing:-1.1});
  addText(s,slide.subtitle,0.7,1.31,10.8,0.28,{fontSize:11.2,color:dark?C.pale:C.muted});
}
function notes(s, slide){
  const n=slide.speaker_notes;
  s.addNotes(`讲述：${n.talk}\n核心句：${n.key_line}\n转场：${n.transition}${slide.source_timestamps.length?`\n来源时间码：${slide.source_timestamps.join(' / ')}`:''}`);
}
function heroSlide(slide, closing=false){
  const s=pptx.addSlide('BLANK_WIDE'); s.background={color:C.black};
  image(s,slide.visual_assets[0].file,0,0,13.333,7.5,closing?'AI 视频结尾关键帧':'AI 视频封面关键帧');
  rect(s,0,0,6.9,7.5,C.black,'none',16); rect(s,0,5.8,13.333,1.7,'000000','none',28);
  label(s,`${slide.content.scene} · ${closing?'CREATIVE JUDGEMENT':'CREATIVE CONTROL'}`,0.75,0.55,5,C.white,7.3);
  label(s,slide.content.timecode,11.4,0.55,1.2,C.teal,7.2);
  if(!closing){
    addText(s,'把 AI 视频',0.75,2.08,5.8,0.72,{fontSize:45,bold:true,color:C.white,charSpacing:-2});
    addText(s,[{text:'从“',options:{color:C.white}},{text:'抽卡',options:{color:C.orange,bold:true}},{text:'”变成',options:{color:C.white}}],0.75,2.72,6.3,0.72,{fontSize:45,bold:true,charSpacing:-2});
    addText(s,'可控创作',0.75,3.36,5.5,0.72,{fontSize:45,bold:true,color:C.white,charSpacing:-2});
    addText(s,slide.subtitle,0.79,5.14,6.5,0.42,{fontSize:12.2,color:'DDD6CB'});
    rect(s,0.76,6.7,11.78,0.05,'6A6A6A'); rect(s,0.76,6.7,6.85,0.05,C.orange); rect(s,7.58,6.64,0.02,0.17,C.white);
  } else {
    addText(s,slide.title,0.76,3.12,6.2,0.62,{fontSize:31,bold:true,color:C.white,charSpacing:-1.1});
    addText(s,slide.subtitle,0.76,3.85,7.2,0.52,{fontSize:22,bold:true,color:C.orange});
    line(s,0.76,6.62,11.8,0,'6A6A6A',0.7);
  }
  footer(s,slide,true); notes(s,slide);
}
function slide02(slide){
  const s=pptx.addSlide('BLANK_WIDE'); header(s,slide,'DIAGNOSIS / CONTROL GAP');
  const rows=[['UNCONTROLLED',slide.content.uncontrolled,C.muted,2.18],['CONTROLLED',slide.content.controlled,C.orange,4.22]];
  rows.forEach(([name,arr,col,y])=>{
    label(s,name,0.68,y+0.12,1.4,col,7.5); line(s,2.08,y,10.59,0,col, name==='CONTROLLED'?3:1);
    arr.forEach((v,i)=>{ const x=2.18+i*2.62; addText(s,String(i+1).padStart(2,'0'),x,y+0.18,0.5,0.33,{fontSize:20,bold:true,color:col}); addText(s,v,x,y+0.56,2.1,0.3,{fontSize:12.2,bold:true}); if(i<3) line(s,x+2.05,y+0.36,0.36,0,col,0.7); });
  });
  line(s,0.67,5.87,12,0,C.black,0.7);
  slide.content.root_causes.forEach((v,i)=>{const x=0.67+i*4; if(i)line(s,x,5.87,0,0.82,'AFA89C',0.5); label(s,`ROOT 0${i+1}`,x+(i?0.22:0),6.03,1,C.orange,6.7); addText(s,v,x+(i?0.22:0),6.30,3.55,0.3,{fontSize:12.3,bold:true});});
  footer(s,slide); notes(s,slide);
}
function slide03(slide){
  const s=pptx.addSlide('BLANK_WIDE'); header(s,slide,'METHOD / PROMPT STRUCTURE');
  image(s,slide.visual_assets[0].file,9.15,0.82,3.52,4.62,'提示词结构证据'); line(s,9.15,0.82,3.52,0,C.black,5);
  slide.content.layers.forEach((d,i)=>{const y=2.16+i*1.31; line(s,0.67,y,7.75,0,C.black,0.7); addText(s,d.number,0.67,y+0.18,0.85,0.43,{fontSize:28,bold:true,color:C.orange}); addText(s,d.title,1.87,y+0.17,2.95,0.35,{fontSize:15,bold:true}); label(s,d.question,1.87,y+0.63,2.1,C.muted,6.7); addText(s,d.description,4.28,y+0.15,4.05,0.7,{fontSize:11.8,bold:true});});
  rect(s,0.67,6.33,0.98,0.08,C.orange); addText(s,slide.content.takeaway,1.91,6.14,7.3,0.48,{fontSize:12.7,bold:true});
  footer(s,slide); notes(s,slide);
}
function slide04(slide){
  const s=pptx.addSlide('BLANK_WIDE'); header(s,slide,'PRODUCTION BOARD / ASSET SYSTEM');
  rect(s,0.67,2.08,0.12,3.65,C.orange); addText(s,'剧本 /\nSHOT INTENT',0.97,2.25,1.45,0.7,{fontSize:16,bold:true}); addText(s,'镜头要发生什么\n\n谁在画面里\n哪些关系必须保持',0.97,3.08,1.42,1.2,{fontSize:9.6,color:C.muted,breakLine:true});
  line(s,2.98,2.18,0,3.55,C.black,0.8);
  slide.content.assets.forEach((v,i)=>{const y=2.2+i*0.65; line(s,2.98,y,4.25,0,'756F65',0.5); circle(s,2.94,y-0.04,0.08,C.orange); addText(s,String(i+1).padStart(2,'0'),3.15,y+0.05,0.45,0.3,{fontSize:15,bold:true,color:C.orange}); addText(s,v,3.78,y+0.03,2.5,0.32,{fontSize:13.6,bold:true});});
  image(s,slide.visual_assets[0].file,7.7,2.04,4.97,3.18,'资产画布证据'); line(s,7.7,2.04,4.97,0,C.black,4);
  slide.content.checks.forEach((v,i)=>{const x=7.7+i*1.66; if(i)line(s,x,5.43,0,0.45,'AFA89C',0.5); addText(s,v,x+(i?0.12:0),5.48,1.45,0.3,{fontSize:10.2,bold:true});});
  addText(s,slide.content.takeaway,2.98,6.16,8.7,0.42,{fontSize:14,bold:true}); footer(s,slide); notes(s,slide);
}
function slide05(slide){
  const s=pptx.addSlide('BLANK_WIDE'); s.background={color:C.black}; header(s,slide,'SELECTION WORKSPACE / TAKE REVIEW',true);
  image(s,slide.visual_assets[0].file,0.67,1.67,12,3.28,'候选池工作台'); rect(s,0.67,1.67,4.2,3.28,C.black,'none',28);
  addText(s,'同一镜头\n多次生成\n按标准留片',0.98,2.08,3.0,1.35,{fontSize:23,bold:true,color:C.white}); label(s,'SOURCE FRAME · 25:20',1.0,4.47,2.1,C.teal,6.5);
  line(s,0.67,5.42,12,0,'727272',0.7);
  slide.content.flow.forEach((v,i)=>{const x=0.67+i*3.13; label(s,`0${i+1} / TAKE`,x,5.61,1.2,C.orange,6.4); addText(s,v,x,5.91,2.3,0.33,{fontSize:13,bold:true,color:C.white}); if(i<3)line(s,x+2.3,5.78,0.55,0,C.orange,0.7);});
  slide.content.criteria.forEach((v,i)=>{const x=0.67+i*3.13; label(s,`CHECK 0${i+1}`,x,6.51,0.9,C.teal,5.9); addText(s,v,x+0.72,6.45,2.15,0.3,{fontSize:8.4,color:'D1CAC0'});});
  footer(s,slide,true); notes(s,slide);
}
function slide06(slide){
  const s=pptx.addSlide('BLANK_WIDE'); header(s,slide,'SHOT DESIGN / CONTROL BOUNDARY');
  slide.visual_assets.forEach((asset,i)=>{ const x=0.67+i*4.08; image(s,asset.file,x,1.79,3.84,1.38,asset.role); line(s,x,1.79,3.84,0,C.black,4); label(s,asset.annotation,x,3.27,3.5,C.muted,6.3); });
  slide.content.beats.forEach((d,i)=>{const x=0.67+i*4; if(i)line(s,x,3.88,0,2.35,C.black,0.8); addText(s,d.number,x+(i?0.3:0),3.83,0.85,0.62,{fontSize:37,bold:true,color:C.orange}); addText(s,d.title,x+(i?0.3:0),4.62,2.8,0.37,{fontSize:15.5,bold:true}); label(s,'LOCK',x+(i?0.3:0),5.2,0.65,C.muted,6.4); addText(s,d.fixed,x+(i?0.3:0)+0.63,5.08,2.74,0.37,{fontSize:10}); label(s,'FREE',x+(i?0.3:0),5.73,0.65,C.muted,6.4); addText(s,d.free,x+(i?0.3:0)+0.63,5.61,2.85,0.37,{fontSize:10});});
  addText(s,slide.content.takeaway,0.67,6.5,8.5,0.32,{fontSize:13.2,bold:true}); footer(s,slide); notes(s,slide);
}
function slide07(slide){
  const s=pptx.addSlide('BLANK_WIDE'); s.background={color:C.black}; header(s,slide,'POST / CONTINUITY CHECK',true);
  image(s,slide.visual_assets[0].file,0.67,1.51,5.28,2.53,'人物与字幕层级'); image(s,slide.visual_assets[1].file,6.18,1.51,6.49,2.53,'剪辑时间线');
  line(s,0.67,1.51,5.28,0,C.white,1); line(s,6.18,1.51,6.49,0,C.white,1);
  label(s,'SOURCE FRAME · 33:54 / LAYER OPERATION',0.67,4.15,3.3,C.teal,6.3); label(s,'SOURCE FRAME · 36:40 / EDITING TIMELINE',6.18,4.15,3.4,C.teal,6.3);
  addText(s,slide.content.layer_operation,0.67,4.55,6.3,0.38,{fontSize:15,bold:true,color:C.white}); line(s,0.67,5.28,12,0,'777777',0.7);
  slide.content.checks.forEach((v,i)=>{const x=0.67+i*2; if(i)line(s,x,5.28,0,0.82,'555555',0.5); label(s,`0${i+1}`,x+(i?0.14:0),5.49,0.45,C.orange,6.3); addText(s,v,x+(i?0.14:0),5.84,1.7,0.28,{fontSize:10,bold:true,color:C.white});});
  addText(s,slide.content.takeaway,0.67,6.5,10.1,0.32,{fontSize:11.3,color:'D2CBC1'}); footer(s,slide,true); notes(s,slide);
}
function slide08(slide){
  const s=pptx.addSlide('BLANK_WIDE'); header(s,slide,'WORKFLOW / FEEDBACK LOOP');
  const top=slide.content.steps.slice(0,4), bottom=slide.content.steps.slice(4).reverse();
  [...top,...bottom].forEach((v,i)=>{const row=i<4?0:1;const col=i%4;const x=0.67+col*2.83;const y=row?4.56:2.45; line(s,x,y,2.25,0,C.black,1.2); addText(s,String(i<4?i+1:8-(i-4)).padStart(2,'0'),x,y+0.13,0.7,0.38,{fontSize:20,bold:true,color:C.orange}); addText(s,v,x,y+0.54,1.7,0.32,{fontSize:11.4,bold:true});});
  arrow(s,1.24,3.34,8.84,0,C.orange,0.8); arrow(s,10.08,3.34,0,1.35,C.orange,0.8); arrow(s,10.08,4.69,-8.84,0,C.orange,0.8);
  if((slide.content.feedback_paths||[]).some(p=>p.id==='candidate_to_generate')){
    line(s,10.68,5.27,1.18,0,C.orange,0.55,'dash'); line(s,11.86,5.27,0,-2.78,C.orange,0.55,'dash'); arrow(s,11.86,2.49,-0.98,0,C.orange,0.55,'dash');
  }
  if((slide.content.feedback_paths||[]).some(p=>p.id==='continuity_to_candidate')){
    line(s,4.10,5.30,0,0.28,C.orange,0.55,'dash'); line(s,4.10,5.58,6.35,0,C.orange,0.55,'dash'); arrow(s,10.45,5.58,0,-0.28,C.orange,0.55,'dash');
  }
  label(s,slide.content.loops[0],3.05,5.86,2.8,C.muted,6.4); label(s,slide.content.loops[1],7.05,5.86,3.7,C.muted,6.4);
  addText(s,slide.content.takeaway,0.67,6.53,10.3,0.33,{fontSize:12.7,bold:true}); footer(s,slide); notes(s,slide);
}
function slide09(slide){
  const s=pptx.addSlide('BLANK_WIDE'); header(s,slide,'PLAYBOOK / FIVE PRINCIPLES');
  slide.content.principles.forEach((v,i)=>{const y=2.02+i*0.76; if(i===4)rect(s,0.52,y-0.02,12.28,0.68,C.black); else line(s,0.67,y-0.03,12,0,'AFA89C',0.5); addText(s,String(i+1).padStart(2,'0'),0.67,y+0.06,0.65,0.35,{fontSize:20,bold:true,color:C.orange}); addText(s,v,1.72,y+0.04,8.4,0.34,{fontSize:12.7,bold:true,color:i===4?C.white:C.black}); line(s,11.93,y+0.25,0.53,0,i===4?C.orange:C.black,1.6);});
  footer(s,slide); notes(s,slide);
}

for(const slide of spec.slides){
  if(slide.id==='01') heroSlide(slide,false);
  else if(slide.id==='02') slide02(slide);
  else if(slide.id==='03') slide03(slide);
  else if(slide.id==='04') slide04(slide);
  else if(slide.id==='05') slide05(slide);
  else if(slide.id==='06') slide06(slide);
  else if(slide.id==='07') slide07(slide);
  else if(slide.id==='08') slide08(slide);
  else if(slide.id==='09') slide09(slide);
  else if(slide.id==='10') heroSlide(slide,true);
}

pptx.writeFile({ fileName: out, compression: true }).then(()=>{
  console.log(`pptx=${out}`);
  console.log(`slides=${spec.slides.length}`);
}).catch(err=>{console.error(err);process.exitCode=1;});

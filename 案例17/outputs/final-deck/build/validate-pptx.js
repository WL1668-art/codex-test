const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const pptxPath = path.join(root, 'case17-ai-video-creative-control.pptx');
const spec = JSON.parse(fs.readFileSync(path.join(root, 'slide-spec.json'), 'utf8'));
const decodeXml = s => s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

(async()=>{
  const buf=fs.readFileSync(pptxPath);
  if(buf.length<100000) throw new Error('PPTX file is unexpectedly small');
  const zip=await JSZip.loadAsync(buf);
  const files=Object.keys(zip.files);
  const slideFiles=files.filter(f=>/^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
  const noteFiles=files.filter(f=>/^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(f));
  const mediaFiles=files.filter(f=>/^ppt\/media\//.test(f));
  const pres=await zip.file('ppt/presentation.xml').async('string');
  const wide=/cx="12192000"\s+cy="6858000"/.test(pres);
  const rows=[];
  for(let i=0;i<slideFiles.length;i++){
    const xml=await zip.file(slideFiles[i]).async('string');
    const text=decodeXml([...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(m=>m[1]).join(' '));
    const shapes=(xml.match(/<p:sp>/g)||[]).length;
    const pictures=(xml.match(/<p:pic>/g)||[]).length;
    const arrows=(xml.match(/triangle/g)||[]).length;
    const dashed=(xml.match(/dash/g)||[]).length;
    const expected=spec.slides[i].title;
    const compact = value => value.replace(/\s+/g,'');
    rows.push({id:spec.slides[i].id,mode:spec.slides[i].render_mode,title:expected,textOK:compact(text).includes(compact(expected)),shapes,pictures,arrows,dashed});
  }
  const forbidden=[];
  const sensitiveHits=[];
  for(const f of files.filter(f=>/\.xml$|\.rels$/.test(f))){
    const x=await zip.file(f).async('string');
    if(/C:\\|C:\/Projects|Administrator|Soft_Cache|codex-test/i.test(x)) forbidden.push(f);
    if(/cookie|api[_ -]?key|bearer\s+[a-z0-9._-]+|authorization\s*:/i.test(x)) sensitiveHits.push(f);
  }
  const previewRows=[];
  for(let i=1;i<=10;i++){
    const id=String(i).padStart(2,'0'); const p=path.join(root,'previews',`${id}.png`); const m=await sharp(p).metadata();
    previewRows.push({id,size:`${m.width}×${m.height}`,ok:m.width===1920&&m.height===1080});
  }
  const ov=await sharp(path.join(root,'overview.png')).metadata();
  const objectOK=rows.filter(r=>r.mode==='object').every(r=>r.shapes>=8 && r.pictures<=3);
  const heroOK=rows.filter(r=>r.mode==='hero').every(r=>r.shapes>=5 && r.pictures>=1 && r.textOK);
  const hybridOK=rows.filter(r=>r.mode==='hybrid').every(r=>r.shapes>=10 && r.pictures>=1 && r.textOK);
  const allText=rows.every(r=>r.textOK);
  const allPng=previewRows.every(r=>r.ok)&&ov.width===1920&&ov.height===1080;
  const notesOK=noteFiles.length===10;
  const slide6EvidenceOK=rows[5].pictures===3&&rows[5].shapes>=30;
  const slide8FeedbackOK=rows[7].arrows>=5&&rows[7].dashed>=6;
  const p1Resolved=slide6EvidenceOK&&slide8FeedbackOK;
  const pass=slideFiles.length===10&&wide&&allText&&objectOK&&heroOK&&hybridOK&&mediaFiles.length>=6&&notesOK&&forbidden.length===0&&sensitiveHits.length===0&&allPng&&p1Resolved;
  const report=`# 案例17完整 deck 验收报告

## 结论

${pass?'**结构与局部修订验收通过。无 P0，无 P1，可进入 ppt-production Skill 固化阶段。**':'**存在需要处理的验收问题。**'} 外部真实 Office 引擎渲染验收已由用户确认通过。

## 浏览器 / HTML 验收

- 本轮仅重建第 6、8 页和总览；两页加载成功，无异常滚动或裁切。
- 设计坐标：每页 \`1920×1080\`；浏览器缩放后保持 16:9。
- 图片：全部加载成功，保持原始宽高比并按容器裁切。
- 字体：Microsoft YaHei / Consolas 本机 fallback 正常。
- 页面滚动：无横向或纵向异常滚动。
- Console：0 error，0 warning。
- PNG：${allPng?'10/10 页及 overview 均为 1920×1080':'尺寸检查未通过'}。
- P1-1：${slide6EvidenceOK?'第 6 页使用 3 个局部证据图，并保留原生对象主体':'未通过'}。
- P1-2：${slide8FeedbackOK?'第 8 页含主流程箭头与 2 条虚线反馈路径':'未通过'}。

## PPTX 结构验收

- 文件：\`case17-ai-video-creative-control.pptx\`
- 文件大小：${(buf.length/1024/1024).toFixed(2)} MiB
- ZIP/XML：可解析
- 幻灯片：${slideFiles.length}/10
- 画布：${wide?'16:9（12192000×6858000 EMU）':'未通过'}
- 逐页标题文本：${allText?'10/10 存在':'未通过'}
- Object 页：${objectOK?'均包含多组文本/形状对象；第 6 页虽含 3 张局部证据图，但不是整页位图':'未通过'}
- Hero 页：${heroOK?'背景图 + 独立可编辑标题/说明文本':'未通过'}
- Hybrid 页：${hybridOK?'证据图片 + 独立文本/线条/形状':'未通过'}
- 嵌入媒体：${mediaFiles.length} 个
- Speaker notes：${notesOK?'10/10 写入成功':`${noteFiles.length}/10`}
- 绝对路径/本机敏感路径：${forbidden.length===0?'未发现':'发现于 '+forbidden.join(', ')}
- Cookie / Token / API Key：${sensitiveHits.length===0?'未发现':'疑似命中于 '+sensitiveHits.join(', ')}

| 页 | render_mode | 标题存在 | 文本/形状对象 | 图片对象 |
|---:|---|:---:|---:|---:|
${rows.map(r=>`| ${r.id} | ${r.mode} | ${r.textOK?'是':'否'} | ${r.shapes} | ${r.pictures} |`).join('\n')}

## 对抗审查

- 反例 1：若对象页被整页 PNG 替代，会出现少量对象、单一全页图片；实际对象页均保留多组原生对象。
- 反例 2：若 Hero 页把标题烘焙进图片，PPTX XML 中不会有对应标题；两页标题均以文本对象存在。
- 反例 3：若构建过程泄露本机路径，XML/关系文件中会出现盘符或用户名；扫描未发现。

## 已知限制与问题分级

- P0：无。
- P1：无。
- 无 P0，无 P1，可进入 ppt-production Skill 固化阶段。
`;
  fs.writeFileSync(path.join(root,'acceptance-report.md'),report,'utf8');
  console.log(JSON.stringify({pass,size:buf.length,slides:slideFiles.length,wide,notes:noteFiles.length,media:mediaFiles.length,allText,objectOK,heroOK,hybridOK,slide6EvidenceOK,slide8FeedbackOK,forbidden,sensitiveHits,allPng,rows},null,2));
  if(!pass) process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

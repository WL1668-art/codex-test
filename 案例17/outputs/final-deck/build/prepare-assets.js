const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceRoot = process.argv[2];
const outputRoot = process.argv[3];
if (!sourceRoot || !outputRoot) throw new Error('Usage: node prepare-assets.js <case13> <assets>');

fs.mkdirSync(outputRoot, { recursive: true });

const jobs = [
  { src: 'source/BV1xuVC6AEbg.jpg', out: 'hero.jpg' },
  { src: 'source/BV1xuVC6AEbg.jpg', out: 'closing.jpg' },
  { src: 'frames/t0045.jpg', out: 'prompt-detail.jpg', crop: { left: 0, top: 70, width: 1600, height: 950 } },
  { src: 'frames/t1105.jpg', out: 'asset-board.jpg', crop: { left: 560, top: 115, width: 1300, height: 760 } },
  { src: 'frames/t1520.jpg', out: 'candidate-pool.jpg', crop: { left: 430, top: 115, width: 1240, height: 790 } },
  { src: 'frames/t1800.jpg', out: 'multi-shot-detail.jpg', crop: { left: 300, top: 130, width: 1320, height: 830 } },
  { src: 'frames/t2034.jpg', out: 'layer-operation.jpg', crop: { left: 640, top: 55, width: 900, height: 455 } },
  { src: 'frames/t2200.jpg', out: 'editing-timeline.jpg', crop: { left: 145, top: 505, width: 1730, height: 560 } }
];

async function run() {
  for (const job of jobs) {
    const src = path.join(sourceRoot, job.src);
    const out = path.join(outputRoot, job.out);
    if (!fs.existsSync(src)) throw new Error(`Missing source: ${src}`);
    let pipeline = sharp(src).rotate();
    if (job.crop) pipeline = pipeline.extract(job.crop);
    await pipeline.jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(out);
    const meta = await sharp(out).metadata();
    process.stdout.write(`${job.out}|${meta.width}x${meta.height}\n`);
  }
}

run().catch(error => { console.error(error); process.exitCode = 1; });

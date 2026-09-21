const path = require('path');
const sharp = require('sharp');

const assets = path.resolve(__dirname, '..', 'assets');
const jobs = [
  { src: 'multi-shot-detail.jpg', out: '06-action-phase.jpg', crop: { left: 0, top: 252, width: 430, height: 220 } },
  { src: 'multi-shot-detail.jpg', out: '06-camera-goal.jpg', crop: { left: 425, top: 252, width: 470, height: 240 } },
  { src: 'candidate-pool.jpg', out: '06-selection-boundary.jpg', crop: { left: 285, top: 125, width: 780, height: 400 } }
];

(async () => {
  for (const job of jobs) {
    const output = path.join(assets, job.out);
    await sharp(path.join(assets, job.src)).extract(job.crop).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(output);
    const meta = await sharp(output).metadata();
    console.log(`${job.out}|${meta.width}x${meta.height}`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

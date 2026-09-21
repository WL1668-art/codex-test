/* Generic editable 16:9 PptxGenJS scaffold. Supply content and design tokens from slide-spec.json. */
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const theme = {
  fonts: { display: 'Arial', body: 'Arial', mono: 'Courier New' },
  colors: { canvas: 'FFFFFF', ink: '111111', accent: 'D04A32', muted: '6F6F6F' },
  safe: { x: 0.67, y: 0.5 },
  type: { title: 28, body: 14, label: 7, page: 8 }
};

function addText(slide, text, box, options = {}) {
  slide.addText(text, {
    x: box.x, y: box.y, w: box.w, h: box.h,
    margin: 0, fit: 'shrink', valign: 'mid',
    fontFace: options.fontFace || theme.fonts.body,
    fontSize: options.fontSize || theme.type.body,
    color: options.color || theme.colors.ink,
    bold: Boolean(options.bold),
    ...options
  });
}

function addImageCover(slide, imagePath, box, altText = '') {
  slide.addImage({
    path: imagePath, x: box.x, y: box.y, w: box.w, h: box.h,
    sizing: { type: 'cover', x: box.x, y: box.y, w: box.w, h: box.h },
    altText
  });
}

function addRule(slide, x, y, w, color = theme.colors.ink, width = 0.7) {
  slide.addShape(pptx.ShapeType.line, { x, y, w, h: 0, line: { color, width } });
}

function addSlideNumber(slide, index, total) {
  addText(slide, `${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    { x: 12.1, y: 7.12, w: 0.55, h: 0.18 },
    { fontFace: theme.fonts.mono, fontSize: theme.type.page, align: 'right', bold: true });
}

function addNotes(slide, notes) {
  slide.addNotes(`讲述：${notes.talk}\n核心句：${notes.key_line}\n转场：${notes.transition}`);
}

module.exports = { pptx, theme, addText, addImageCover, addRule, addSlideNumber, addNotes };

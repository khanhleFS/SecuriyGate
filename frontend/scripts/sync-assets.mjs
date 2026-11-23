import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(frontendRoot, "assets");
const webPublicDir = path.join(frontendRoot, "apps", "web", "public");

/* =========================================================
 * FONT SYNC
 * ========================================================= */
const fontSrc = path.join(assetsDir, "fonts", "Extenda-30-Deca.otf");
const fontDest = path.join(webPublicDir, "fonts", "Extenda-30-Deca.otf");

if (fs.existsSync(fontSrc)) {
  fs.mkdirSync(path.dirname(fontDest), { recursive: true });
  fs.copyFileSync(fontSrc, fontDest);
  console.log(`Copied ${path.relative(frontendRoot, fontDest)}`);
}

/* =========================================================
 * BRAND SVG SYNC
 * ========================================================= */
function rewriteSvgRoot(svgContent, { width, height, viewBox }) {
  return svgContent.replace(/<svg\b[^>]*>/, (openTag) =>
    openTag
      .replace(/\bwidth="[^"]*"/, `width="${width}"`)
      .replace(/\bheight="[^"]*"/, `height="${height}"`)
      .replace(/\bviewBox="[^"]*"/, `viewBox="${viewBox}"`)
  );
}

const svgSpecs = [
  { file: "logo.svg", crop: null },
  {
    file: "logo-text.svg",
    crop: { width: "382", height: "100", viewBox: "0 50 382 100" },
  },
  {
    file: "footer.svg",
    crop: { width: "1030", height: "262", viewBox: "0 142 1030 262" },
  },
];

const brandSrcDir = path.join(assetsDir, "brand");
const brandDestDir = path.join(webPublicDir, "brand");
fs.mkdirSync(brandDestDir, { recursive: true });

for (const { file, crop } of svgSpecs) {
  const srcPath = path.join(brandSrcDir, file);
  const destPath = path.join(brandDestDir, file);
  if (!fs.existsSync(srcPath)) continue;
  if (crop) {
    const rawSvg = fs.readFileSync(srcPath, "utf8");
    fs.writeFileSync(destPath, rewriteSvgRoot(rawSvg, crop), "utf8");
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
  console.log(`Synced ${path.relative(frontendRoot, destPath)}`);
}

/* =========================================================
 * EXTRACT & COMPOSITE STATUS PHONE PNG FROM 404.SVG
 * ========================================================= */
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC32_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function decodePngBuffer(buf) {
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  const bpp = colorType === 0 ? 1 : colorType === 2 ? 3 : colorType === 6 ? 4 : 0;
  if (!bpp || bitDepth !== 8) {
    throw new Error(`Unsupported embedded PNG format (bitDepth=${bitDepth}, colorType=${colorType})`);
  }

  let offset = 8;
  const idats = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.slice(offset + 4, offset + 8).toString("ascii");
    if (type === "IDAT") {
      idats.push(buf.slice(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idats));
  const stride = width * bpp;
  const pixels = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const rowStart = y * (stride + 1) + 1;
    const outStart = y * stride;
    for (let x = 0; x < stride; x++) {
      const v = raw[rowStart + x];
      const a = x >= bpp ? pixels[outStart + x - bpp] : 0;
      const b = y > 0 ? pixels[outStart - stride + x] : 0;
      const c = x >= bpp && y > 0 ? pixels[outStart - stride + x - bpp] : 0;
      let val = v;
      if (filter === 1) val = (v + a) & 0xff;
      else if (filter === 2) val = (v + b) & 0xff;
      else if (filter === 3) val = (v + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        val = (v + pr) & 0xff;
      }
      pixels[outStart + x] = val;
    }
  }

  return { width, height, bpp, pixels };
}

function encodeRgbaPng(width, height, rgba) {
  const stride = width * 4;
  const filtered = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const inStart = y * stride;
    const outStart = y * (stride + 1);
    filtered[outStart] = 1; // Sub filter for compact lossless compression
    for (let x = 0; x < stride; x++) {
      const cur = rgba[inStart + x];
      const left = x >= 4 ? rgba[inStart + x - 4] : 0;
      filtered[outStart + 1 + x] = (cur - left) & 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(filtered, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    signature,
    makePngChunk("IHDR", ihdr),
    makePngChunk("IDAT", compressed),
    makePngChunk("IEND", Buffer.alloc(0)),
  ]);
}

const statusPhoneSrcSvg = path.join(assetsDir, "illustrations", "404.svg");
const illustrationsDestDir = path.join(webPublicDir, "illustrations");
const statusPhoneDest = path.join(illustrationsDestDir, "status-phone.png");

if (fs.existsSync(statusPhoneSrcSvg)) {
  fs.mkdirSync(illustrationsDestDir, { recursive: true });
  const svgContent = fs.readFileSync(statusPhoneSrcSvg, "utf8");
  const embeddedPngs = [
    ...svgContent.matchAll(/xlink:href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/g),
  ];
  if (embeddedPngs.length < 2) {
    throw new Error("Expected 2 embedded PNG layers inside assets/illustrations/404.svg");
  }

  const maskImg = decodePngBuffer(Buffer.from(embeddedPngs[0][1], "base64"));
  const colorImg = decodePngBuffer(Buffer.from(embeddedPngs[1][1], "base64"));
  if (maskImg.width !== colorImg.width || maskImg.height !== colorImg.height) {
    throw new Error("Mismatched mask and color dimensions inside assets/illustrations/404.svg");
  }

  const { width: pw, height: ph } = maskImg;
  const isExterior = new Uint8Array(pw * ph);
  const queue = new Int32Array(pw * ph);
  let head = 0;
  let tail = 0;

  const tryPushExterior = (x, y) => {
    const idx = y * pw + x;
    if (!isExterior[idx] && maskImg.pixels[idx] < 250) {
      isExterior[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < pw; x++) {
    tryPushExterior(x, 0);
    tryPushExterior(x, ph - 1);
  }
  for (let y = 0; y < ph; y++) {
    tryPushExterior(0, y);
    tryPushExterior(pw - 1, y);
  }
  while (head < tail) {
    const idx = queue[head++];
    const x = idx % pw;
    const y = (idx - x) / pw;
    if (x > 0) tryPushExterior(x - 1, y);
    if (x < pw - 1) tryPushExterior(x + 1, y);
    if (y > 0) tryPushExterior(x, y - 1);
    if (y < ph - 1) tryPushExterior(x, y + 1);
  }

  const rgba = Buffer.alloc(pw * ph * 4);
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      const idx = y * pw + x;
      const a = maskImg.pixels[idx];
      const ci = idx * colorImg.bpp;
      const r = colorImg.pixels[ci];
      const g = colorImg.pixels[ci + 1];
      const b = colorImg.pixels[ci + 2];
      const oi = idx * 4;

      const inYellowBadge =
        !isExterior[idx] && x >= 650 && x <= 1110 && y >= 95 && y <= 580 && a < 255;

      if (inYellowBadge) {
        const alphaNorm = a / 255;
        const invAlpha = 1 - alphaNorm;
        rgba[oi] = Math.round(r * alphaNorm + 255 * invAlpha);
        rgba[oi + 1] = Math.round(g * alphaNorm + 255 * invAlpha);
        rgba[oi + 2] = Math.round(b * alphaNorm + 255 * invAlpha);
        rgba[oi + 3] = 255;
      } else {
        rgba[oi] = r;
        rgba[oi + 1] = g;
        rgba[oi + 2] = b;
        rgba[oi + 3] = a;
      }
    }
  }

  const pngOut = encodeRgbaPng(pw, ph, rgba);
  fs.writeFileSync(statusPhoneDest, pngOut);
  console.log(`Extracted ${path.relative(frontendRoot, statusPhoneDest)} (${pngOut.length} bytes)`);
}

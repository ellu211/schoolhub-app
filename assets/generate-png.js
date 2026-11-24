/**
 * Generates valid PNG icons without any external npm packages using Node.js built-in zlib.
 */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateIconPNG(size, outPath) {
  const width = size;
  const height = size;
  const rowSize = 1 + width * 4; // 1 filter byte + RGBA
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const rCorner = size * 0.22; // rounded squircle radius

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Squircle check
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      const maxDist = width / 2;
      
      let inside = true;
      if (dx > maxDist - rCorner && dy > maxDist - rCorner) {
        const cdx = dx - (maxDist - rCorner);
        const cdy = dy - (maxDist - rCorner);
        if (cdx * cdx + cdy * cdy > rCorner * rCorner) {
          inside = false;
        }
      }

      if (!inside) {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Blue gradient background (#147fc1 to #0f3b64)
      const gradT = (y / height) * 0.8 + (x / width) * 0.2;
      let r = Math.round(20 * (1 - gradT) + 15 * gradT);
      let g = Math.round(127 * (1 - gradT) + 59 * gradT);
      let b = Math.round(193 * (1 - gradT) + 100 * gradT);

      // Schoolhouse drawing in center
      const nx = (x - cx) / (size * 0.35); // -1 to 1 normalized in center
      const ny = (y - cy) / (size * 0.35);

      // Triangular Roof
      const roof = ny < -0.15 && ny > -0.7 && Math.abs(nx) < (ny + 0.7) * 1.5;
      // Building Body
      const body = ny >= -0.15 && ny < 0.65 && Math.abs(nx) < 0.75;
      // Door
      const door = ny >= 0.25 && ny <= 0.65 && Math.abs(nx) < 0.22;
      // Pillars
      const pillar = body && !door && (
        (nx > -0.65 && nx < -0.45) ||
        (nx > -0.35 && nx < -0.22) ||
        (nx > 0.22 && nx < 0.35) ||
        (nx > 0.45 && nx < 0.65)
      ) && ny > -0.05 && ny < 0.55;

      if (roof || (body && !pillar && !door)) {
        r = 255; g = 255; b = 255;
      } else if (door) {
        r = 16; g = 59; b = 101;
      } else if (pillar) {
        r = 20; g = 127; b = 193;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = 255;
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // filter 0
  ihdr[12] = 0; // no interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated ${size}x${size} PNG: ${outPath} (${pngBuffer.length} bytes)`);
}

const iconsDir = path.join(__dirname, 'icons');
generateIconPNG(192, path.join(iconsDir, 'icon-192.png'));
generateIconPNG(512, path.join(iconsDir, 'icon-512.png'));

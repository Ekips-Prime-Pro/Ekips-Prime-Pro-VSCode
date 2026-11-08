// Generates the placeholder Marketplace icon (images/icon.png, 128x128).
// Replace images/icon.png with a real design later; this script is only
// kept so the placeholder can be regenerated without extra tools.
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const SIZE = 128;
const BACKGROUND = [255, 205, 0]; // LEGO-like yellow
const FOREGROUND = [30, 30, 30];

// Simple pixel art "E" drawn on a 8x8 grid, scaled up.
const LETTER = [
  "........",
  ".######.",
  ".##.....",
  ".#####..",
  ".##.....",
  ".##.....",
  ".######.",
  "........",
];

function pixel(x, y) {
  const cell = SIZE / LETTER.length;
  const row = LETTER[Math.floor(y / cell)];
  return row[Math.floor(x / cell)] === "#" ? FOREGROUND : BACKGROUND;
}

function crc32(buf) {
  let crc = ~0;
  for (const byte of buf) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const header = Buffer.alloc(13);
header.writeUInt32BE(SIZE, 0);
header.writeUInt32BE(SIZE, 4);
header[8] = 8; // bit depth
header[9] = 2; // color type: RGB

const raw = Buffer.alloc(SIZE * (SIZE * 3 + 1));
for (let y = 0; y < SIZE; y++) {
  const offset = y * (SIZE * 3 + 1);
  raw[offset] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const [r, g, b] = pixel(x, y);
    raw.set([r, g, b], offset + 1 + x * 3);
  }
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", header),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(new URL("../images/icon.png", import.meta.url), png);

// Cereal Kingdom: island shape, heights and ground colors (pure functions, no Three.js scene objects).
import { Color } from './vendor/three.module.min.js';

export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

function hash2(x, y){
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
export function vnoise(x, y){
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y){ let s = 0, a = 0.5, f = 1; for (let i = 0; i < 4; i++) { s += a * vnoise(x * f, y * f); f *= 2.03; a *= 0.5; } return s / 0.9375; }
const g = (x, z, cx, cz, r) => { const dx = x - cx, dz = z - cz; return Math.exp(-(dx * dx + dz * dz) / (2 * r * r)); };

// Places on the island. North is -z.
export const SITES = {
  village:  { x: 0,   z: 14,  r: 15 },
  meadow:   { x: -52, z: 24,  r: 10 },
  mountain: { x: 2,   z: -56, r: 6 },
  caves:    { x: 56,  z: -8,  r: 9 },
  beach:    { x: 4,   z: 57,  r: 13 },
  forest:   { x: -50, z: -24, r: 18 }
};
export const PATHS = [
  [[0, 14], [-18, 19], [-36, 23], [-52, 24]],
  [[0, 14], [0, -4], [-3, -22], [2, -40], [2, -56]],
  [[0, 14], [18, 8], [38, -2], [56, -8]],
  [[0, 14], [2, 32], [4, 46], [4, 57]]
];

export function islandR(x, z){
  const a = Math.atan2(z, x);
  return 84 + 6 * Math.sin(a * 3 + 0.6) + 4 * Math.sin(a * 5 + 1.7) + 10 * (fbm(Math.cos(a) * 1.7 + 9.1, Math.sin(a) * 1.7 + 3.3) - 0.5);
}
function segDist(px, pz, ax, az, bx, bz){
  const vx = bx - ax, vz = bz - az; const t = clamp(((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz), 0, 1);
  return Math.hypot(px - (ax + vx * t), pz - (az + vz * t));
}
export function pathDist(x, z){
  let m = 1e9;
  for (const p of PATHS) for (let i = 0; i < p.length - 1; i++) m = Math.min(m, segDist(x, z, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]));
  return m;
}
function flat(h, x, z, cx, cz, r, target){ const k = 1 - smoothstep(r * 0.55, r, Math.hypot(x - cx, z - cz)); return h + (target - h) * k; }
function raw(x, z){
  let h = 1.7 + (fbm(x * 0.03 + 11, z * 0.03 + 7) - 0.5) * 3.4;
  h += 16 * g(x, z, 2, -56, 15) + 6.5 * g(x, z, -15, -47, 8) + 5.5 * g(x, z, 17, -50, 7.5) + 4 * g(x, z, -8, -66, 7);
  h += 5.5 * g(x, z, 68, -14, 9) + 4 * g(x, z, 64, 6, 7) + 3.5 * g(x, z, 74, -2, 6);
  h += 2.2 * g(x, z, -62, -30, 10);
  return h;
}
const SUMMIT = raw(2, -56);
export function height(x, z){
  let h = raw(x, z);
  h = flat(h, x, z, 0, 14, 17, 1.9);
  h = flat(h, x, z, -52, 24, 12, 1.8);
  h = flat(h, x, z, 56, -8, 10, 2.6);
  h = flat(h, x, z, 4, 57, 15, 1.3);
  h = flat(h, x, z, 2, -56, 8, SUMMIT);
  const pd = pathDist(x, z);
  if (pd < 3) h = lerp(h, h * 0.92 + 0.12, 1 - pd / 3);
  const d = Math.hypot(x, z), R = islandR(x, z);
  const t = smoothstep(R - 15, R, d);
  h = lerp(h, -0.9, t);
  if (d > R) h = -0.9 - (d - R) * 0.12;
  return h;
}
export const SUMMIT_H = height(2, -56);

const C = h => new Color(h);
const PAL = {
  oat: C('#E6BA5E'), toast: C('#CF9443'), sand: C('#F2DCA4'), path: C('#E3C894'), plaza: C('#EFDDB9'),
  pink: C('#F2A9C6'), cream: C('#F9DCE8'), mint: C('#AEE0CB'), cocoa: C('#6B4127'), cocoaLt: C('#8E5C36'),
  forest: C('#C98236'), seabed: C('#D9C9A6')
};
export function groundColor(x, z, h, out){
  out.copy(PAL.oat);
  out.lerp(PAL.toast, smoothstep(0.45, 0.68, fbm(x * 0.055 + 3, z * 0.055 + 1)) * 0.8);
  const wM = g(x, z, 2, -56, 24);
  const pinkW = smoothstep(4.2, 7.5, h) * smoothstep(0.08, 0.3, wM);
  out.lerp(PAL.pink, pinkW);
  if (pinkW > 0.3 && fbm(x * 0.12, z * 0.12) > 0.62) out.lerp(PAL.mint, 0.6);
  const creamW = smoothstep(11, 14.5, h);
  out.lerp(PAL.cream, creamW);
  const wC = smoothstep(0.22, 0.6, g(x, z, 63, -6, 15));
  out.lerp(PAL.cocoaLt, wC);
  out.lerp(PAL.cocoa, wC * smoothstep(3.6, 6.2, h));
  out.lerp(PAL.forest, smoothstep(0.3, 0.75, g(x, z, -50, -24, 15)) * 0.55);
  const d = Math.hypot(x, z), R = islandR(x, z);
  out.lerp(PAL.sand, Math.max(smoothstep(R - 22, R - 9, d), smoothstep(1.5, 0.6, h), 1 - smoothstep(9, 17, Math.hypot(x - 4, z - 57))));
  if (h < -0.15) out.lerp(PAL.seabed, 0.55);
  out.lerp(PAL.path, (1 - smoothstep(1.0, 2.3, pathDist(x, z))) * (1 - creamW * 0.6) * (h > 0 ? 1 : 0));
  out.lerp(PAL.plaza, 1 - smoothstep(9, 11.5, Math.hypot(x, z - 14)));
  const n = (hash2(Math.floor(x * 1.3), Math.floor(z * 1.3)) - 0.5) * 0.07;
  out.r *= 1 + n; out.g *= 1 + n; out.b *= 1 + n;
  return out;
}
export function isLand(x, z){ return height(x, z) > 0.45; }

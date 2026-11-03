// Cereal Kingdom: a small 3D adventure. Three.js, no other dependencies.
import * as THREE from './vendor/three.module.min.js';
import { SITES, PATHS, height, groundColor, islandR, pathDist, clamp, lerp, smoothstep, fbm } from './terrain.js';
import { initAudio, playTrack, sfxPlay, setSound, soundOn, suspendAudio } from './audio.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');
const isTouch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k, d){ try { const v = localStorage.getItem('ck:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v){ try { localStorage.setItem('ck:' + k, JSON.stringify(v)); } catch {} }
};
let quality = params.get('q') || store.get('quality', isTouch ? 'medium' : 'high');
setSound(store.get('sound', true));
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
const angLerp = (a, b, t) => a + angDiff(a, b) * t;

/* ================= renderer, scene, light ================= */
const canvas = $('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isTouch, powerPreference: 'high-performance' });
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.98;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.5, 800);
camera.position.set(0, 60, 120);

const DAY = { top: new THREE.Color('#3F82FF'), hor: new THREE.Color('#CFE6FF'), sun: new THREE.Color('#FFF1D2'), light: new THREE.Color('#FFF1D6'), hemi: new THREE.Color('#D3E5FF') };
const DUSK = { top: new THREE.Color('#3E35A8'), hor: new THREE.Color('#FF9C6C'), sun: new THREE.Color('#FFB27A'), light: new THREE.Color('#FFB487'), hemi: new THREE.Color('#B9A8FF') };
const sky = { top: DAY.top.clone(), hor: DAY.hor.clone(), sun: DAY.sun.clone(), light: DAY.light.clone(), hemi: DAY.hemi.clone(), dusk: 0, duskTarget: 0 };
scene.fog = new THREE.Fog(sky.hor.clone(), 90, 320);
const hemi = new THREE.HemisphereLight(sky.hemi, '#E5BE78', 1.25); scene.add(hemi);
const sunLight = new THREE.DirectionalLight(sky.light, 2.3);
const SUN_DIR = new THREE.Vector3(0.45, 0.78, 0.43).normalize();
sunLight.position.copy(SUN_DIR).multiplyScalar(80);
scene.add(sunLight, sunLight.target);
sunLight.shadow.mapSize.set(2048, 2048);
Object.assign(sunLight.shadow.camera, { left: -36, right: 36, top: 36, bottom: -36, near: 5, far: 200 });
sunLight.shadow.bias = -0.0005; sunLight.shadow.normalBias = 0.04;

let fogFar = 320;
function applyQuality(q, first){
  quality = q; store.set('quality', q);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, q === 'high' ? 2 : q === 'medium' ? 1.5 : 1));
  const sh = q === 'high';
  if (first || renderer.shadowMap.enabled !== sh) {
    renderer.shadowMap.enabled = sh; sunLight.castShadow = sh;
    if (!first) scene.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.needsUpdate = true; }); });
  }
  fogFar = q === 'low' ? 230 : 320;
  for (const id of ['segQ', 'segQ2']) $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === q)));
}

/* ================= helpers ================= */
const matCache = new Map();
function M(color, opts){ const k = color + (opts ? JSON.stringify(opts) : ''); if (!matCache.has(k)) matCache.set(k, new THREE.MeshLambertMaterial(Object.assign({ color }, opts || {}))); return matCache.get(k); }
function MS(color, rough = 0.5, metal = 0, opts){ return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, opts || {})); }
function mk(geo, mat, cast = true, recv = false){ const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = recv; return m; }
const colliders = [];
function addCol(x, z, r){ colliders.push({ x, z, r }); }
function pushOut(o, r){
  for (const c of colliders) {
    const dx = o.x - c.x, dz = o.z - c.z, min = r + c.r, d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 1e-8) { const d = Math.sqrt(d2), k = (min - d) / d; o.x += dx * k; o.z += dz * k; }
  }
}
function moveOnLand(o, nx, nz){
  if (height(nx, nz) > 0.45) { o.x = nx; o.z = nz; }
  else if (height(nx, o.z) > 0.45) o.x = nx;
  else if (height(o.x, nz) > 0.45) o.z = nz;
}
function canvasTex(w, h, draw){ const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const glowTex = canvasTex(128, 128, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const blobTex = canvasTex(64, 64, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(20,20,50,.55)'); gr.addColorStop(1, 'rgba(20,20,50,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const blobGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
const blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
function blob(size){ const m = new THREE.Mesh(blobGeo, blobMat); m.scale.set(size, 1, size); m.renderOrder = 1; scene.add(m); return m; }
const tmpV = new THREE.Vector3();
let clock = 0;

/* ================= sky, sea, terrain ================= */
const WORLD = 300;
const skyMat = new THREE.ShaderMaterial({
  uniforms: { uTop: { value: sky.top }, uHor: { value: sky.hor }, uSunCol: { value: sky.sun }, uSun: { value: SUN_DIR } },
  vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }',
  fragmentShader: `uniform vec3 uTop, uHor, uSunCol, uSun; varying vec3 vDir;
    void main(){ vec3 d = normalize(vDir); float y = d.y; vec3 col = mix(uHor, uTop, smoothstep(0.0, 0.6, y)); col = mix(col, uHor, smoothstep(0.02, -0.25, y));
      float s = max(dot(d, uSun), 0.0); col += uSunCol * (pow(s, 700.0) * 1.6 + pow(s, 10.0) * 0.22);
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  side: THREE.BackSide, depthWrite: false, fog: false
});
const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), skyMat); skyMesh.renderOrder = -10; skyMesh.frustumCulled = false; scene.add(skyMesh);

// heights texture so the sea knows where the shore is
const HT = 160; const htData = new Uint8Array(HT * HT * 4);
for (let j = 0; j < HT; j++) for (let i = 0; i < HT; i++) {
  const x = (i / (HT - 1) - 0.5) * WORLD, z = (j / (HT - 1) - 0.5) * WORLD;
  const v = clamp((height(x, z) + 4) / 8, 0, 1) * 255; const k = (j * HT + i) * 4; htData[k] = v; htData[k + 3] = 255;
}
const htTex = new THREE.DataTexture(htData, HT, HT); htTex.magFilter = THREE.LinearFilter; htTex.minFilter = THREE.LinearFilter; htTex.needsUpdate = true;
const seaUniforms = {
  uTime: { value: 0 }, uDeep: { value: new THREE.Color('#BCD0F4') }, uShallow: { value: new THREE.Color('#FFF8EC') }, uSand: { value: new THREE.Color('#F2DCA4') },
  uFog: { value: scene.fog.color }, uFogNear: { value: 90 }, uFogFar: { value: 320 }, uSun: { value: SUN_DIR }, uSunCol: { value: sky.sun }, uHt: { value: htTex }, uWorld: { value: WORLD }
};
const seaMat = new THREE.ShaderMaterial({
  uniforms: seaUniforms,
  vertexShader: `uniform float uTime; varying vec3 vW; varying vec3 vN;
    void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); float t = uTime;
      float a = wp.x * 0.08 + t * 1.1, b = wp.z * 0.11 - t * 0.9, c = (wp.x + wp.z) * 0.05 + t * 0.6;
      wp.y += sin(a) * 0.16 + sin(b) * 0.12 + sin(c) * 0.2;
      float dx = cos(a) * 0.0128 + cos(c) * 0.01, dz = cos(b) * 0.0132 + cos(c) * 0.01;
      vN = normalize(vec3(-dx * 6.0, 1.0, -dz * 6.0)); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
  fragmentShader: `uniform float uTime, uFogNear, uFogFar, uWorld; uniform vec3 uDeep, uShallow, uSand, uFog, uSun, uSunCol; uniform sampler2D uHt; varying vec3 vW; varying vec3 vN;
    void main(){ vec3 V = normalize(cameraPosition - vW);
      vec3 n = normalize(vN + vec3(sin(vW.x * 1.3 + uTime * 2.0) * 0.04, 0.0, cos(vW.z * 1.1 - uTime * 1.7) * 0.04));
      float h = texture2D(uHt, vW.xz / uWorld + 0.5).r * 8.0 - 4.0;
      vec3 col = mix(uDeep, uShallow, smoothstep(-3.5, 0.0, h));
      col = mix(col, uSand, smoothstep(-1.4, 0.3, h) * 0.3);
      col *= 0.82 + 0.25 * clamp(dot(n, uSun), 0.0, 1.0);
      float fres = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 4.0); col = mix(col, vec3(1.0), fres * 0.3);
      vec3 H = normalize(uSun + V); col += uSunCol * pow(clamp(dot(n, H), 0.0, 1.0), 140.0) * 0.9;
      float band = smoothstep(-1.0, -0.2, h) * (1.0 - smoothstep(0.15, 0.55, h));
      float foam = band * (0.55 + 0.45 * sin(h * 14.0 - uTime * 2.4 + vW.x * 0.25));
      col = mix(col, vec3(1.0), clamp(foam, 0.0, 1.0) * 0.85);
      col = mix(col, uFog, smoothstep(uFogNear, uFogFar, length(vW - cameraPosition)));
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
});
const sea = new THREE.Mesh(new THREE.PlaneGeometry(700, 700, 110, 110).rotateX(-Math.PI / 2), seaMat);
sea.receiveShadow = false; scene.add(sea);

function buildTerrain(){
  const seg = quality === 'low' ? 130 : 180;
  const geo = new THREE.PlaneGeometry(WORLD, WORLD, seg, seg).rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, cols = new Float32Array(pos.count * 3), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = height(x, z);
    pos.setY(i, h); groundColor(x, z, h, c); cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  m.receiveShadow = true; scene.add(m);
}
buildTerrain();

/* ================= swaying instanced plants ================= */
const swayTime = { value: 0 };
function swayMat(color, amount){
  const m = new THREE.MeshLambertMaterial({ color, flatShading: true });
  m.onBeforeCompile = sh => {
    sh.uniforms.uTime = swayTime;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        float ph = instanceMatrix[3].x * 0.31 + instanceMatrix[3].z * 0.23;
        float sw = sin(uTime * 1.8 + ph) * ${amount.toFixed(3)} * position.y;
        transformed.x += sw; transformed.z += sw * 0.6;
      #endif`);
  };
  m.customProgramCacheKey = () => 'sway' + amount;
  return m;
}
function scatter(n, place, tries = 30){ const out = []; for (let i = 0; i < n; i++) for (let k = 0; k < tries; k++) { const p = place(); if (p) { out.push(p); break; } } return out; }
const nearSite = (x, z, pad = 0) => Object.values(SITES).some(s => Math.hypot(x - s.x, z - s.z) < s.r * 0.75 + pad);
function instanced(geo, mat, items, setup){
  const im = new THREE.InstancedMesh(geo, mat, items.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
  items.forEach((it, i) => {
    const r = setup(it, i);
    p.set(r.x, r.y, r.z); e.set(r.rx || 0, r.ry || 0, r.rz || 0); q.setFromEuler(e); s.set(r.sx || r.s || 1, r.sy || r.s || 1, r.sz || r.s || 1);
    m4.compose(p, q, s); im.setMatrixAt(i, m4);
    if (r.color) { col.set(r.color); im.setColorAt(i, col); }
  });
  im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
  im.castShadow = true; im.receiveShadow = true; scene.add(im); return im;
}

/* ================= world dressing ================= */
const signs = [];
function makeSign(x, z, rot, lines){
  const g = new THREE.Group(); const y = height(x, z); g.position.set(x, y, z); g.rotation.y = rot;
  g.add(mk(new THREE.CylinderGeometry(0.12, 0.14, 2.4, 6), M('#8E5C36')).translateY(1.2));
  const tex = canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = '#FFF4DC'; c.strokeStyle = '#14215C'; c.lineWidth = 14; roundRect(c, 8, 8, w - 16, h - 16, 34); c.fill(); c.stroke();
    c.fillStyle = '#14215C'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const fs = lines.length > 1 ? 58 : 72; c.font = `600 ${fs}px Fraunces, Georgia, serif`;
    lines.forEach((ln, i) => c.fillText(ln, w / 2, h / 2 + (i - (lines.length - 1) / 2) * fs * 1.15));
  });
  const board = mk(new THREE.BoxGeometry(2.6, 1.3, 0.14), [M('#C98A4A'), M('#C98A4A'), M('#C98A4A'), M('#C98A4A'), new THREE.MeshLambertMaterial({ map: tex }), M('#C98A4A')]);
  board.position.y = 2.3; g.add(board); scene.add(g); addCol(x, z, 0.4); signs.push(g); return g;
}
function roundRect(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

function house(x, z, body, roof){
  const g = new THREE.Group(); const y = height(x, z) - 0.2; g.position.set(x, y, z);
  g.rotation.y = Math.atan2(0 - x, 14 - z);
  g.add(mk(new THREE.BoxGeometry(4.2, 3.4, 3.2), M(body), true, true).translateY(1.7));
  g.add(mk(new THREE.BoxGeometry(4.26, 0.5, 3.26), M('#FFFBF2')).translateY(2.6));
  const tri = new THREE.Shape(); tri.moveTo(-2.45, 0); tri.lineTo(2.45, 0); tri.lineTo(0, 1.9); tri.closePath();
  const rf = mk(new THREE.ExtrudeGeometry(tri, { depth: 3.7, bevelEnabled: false }).translate(0, 0, -1.85), M(roof, { flatShading: true })); rf.position.y = 3.4;
  g.add(rf);
  g.add(mk(new THREE.BoxGeometry(1, 1.7, 0.1), M('#14215C')).translateY(0.85).translateZ(1.62));
  const win = new THREE.MeshBasicMaterial({ color: '#FFE7A0' });
  for (const s of [-1, 1]) g.add(mk(new THREE.BoxGeometry(0.75, 0.75, 0.1), win, false).translateX(s * 1.35).translateY(1.9).translateZ(1.62));
  g.add(mk(new THREE.BoxGeometry(0.5, 1.2, 0.5), M('#E7D3B0')).translateX(1.2).translateY(4.7).translateZ(-0.5));
  scene.add(g); addCol(x, z, 2.5);
}
function oatRing(x, z, ry, r = 2.4, tube = 0.78, sink = 0.5, color = '#E8B95C'){
  const m = mk(new THREE.TorusGeometry(r, tube, 14, 36), M(color, { flatShading: true }), true, true);
  m.position.set(x, height(x, z) + r - sink, z); m.rotation.y = ry; scene.add(m);
  const px = Math.cos(ry) * r, pz = -Math.sin(ry) * r;
  addCol(x + px, z + pz, tube + 0.1); addCol(x - px, z - pz, tube + 0.1);
  return m;
}

function buildVillage(){
  const V = SITES.village;
  [[12, 3, '#FF8A5B', '#14215C'], [-12, 3, '#6C8CFF', '#FF5A3C'], [13, 25, '#FFD447', '#2340E8'], [-13, 25, '#7ED6B2', '#14215C'], [19, 16, '#F7A8C8', '#2340E8'], [-19, 9, '#B58CFF', '#FFD447']]
    .forEach(([x, z, b, r]) => house(x, z, b, r));
  // gate arches where the paths leave the village
  for (const p of PATHS) { const [a, b] = p; if (b[1] > a[1] + 10) continue; const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); const gx = a[0] + dx / L * 16, gz = a[1] + dz / L * 16; oatRing(gx, gz, Math.atan2(dx, dz), 2.6, 0.8, 0.4); }
  // fountain with a spoon statue
  const fx = 0, fz = 11, fy = height(fx, fz);
  const f = new THREE.Group(); f.position.set(fx, fy, fz); scene.add(f);
  f.add(mk(new THREE.CylinderGeometry(3.4, 3.6, 0.7, 28), M('#EAD7B3'), true, true).translateY(0.35));
  f.add(mk(new THREE.CylinderGeometry(3.0, 3.0, 0.2, 28), MS('#FFFDF7', 0.15, 0), false, true).translateY(0.62));
  f.add(mk(new THREE.CylinderGeometry(0.5, 0.7, 2.2, 12), M('#EAD7B3')).translateY(1.6));
  const spoon = new THREE.Group(); spoon.position.y = 2.6; spoon.rotation.z = 0.5; f.add(spoon);
  const steel = MS('#E8ECF4', 0.25, 0.6);
  spoon.add(mk(new THREE.CylinderGeometry(0.16, 0.22, 3.4, 10), steel).translateY(1.7));
  const bowl = mk(new THREE.SphereGeometry(0.9, 20, 14), steel); bowl.scale.set(0.85, 0.32, 1.25); bowl.position.y = 3.7; spoon.add(bowl);
  addCol(fx, fz, 3.6);
  fountainTip.set(fx - 2.0, fy + 6.0, fz);
  // lamps
  const lampGlow = new THREE.MeshBasicMaterial({ color: '#FFE6A3' });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.39; const x = V.x + Math.cos(a) * 10.5, z = V.z + Math.sin(a) * 10.5; if (pathDist(x, z) < 1.8) continue;
    const y = height(x, z); scene.add(mk(new THREE.CylinderGeometry(0.1, 0.14, 3.2, 6), M('#14215C')).translateX(x).translateY(y + 1.6).translateZ(z));
    scene.add(mk(new THREE.SphereGeometry(0.32, 12, 10), lampGlow, false).translateX(x).translateY(y + 3.35).translateZ(z)); addCol(x, z, 0.3); }
  // bakery stall
  const sx = 9, sz = 21, sy = height(sx, sz); const st = new THREE.Group(); st.position.set(sx, sy, sz); st.rotation.y = -0.6; scene.add(st);
  st.add(mk(new THREE.BoxGeometry(3.4, 1.1, 1.4), M('#C98A4A')).translateY(0.55));
  for (const [a, b] of [[-1.6, -0.6], [1.6, -0.6], [-1.6, 0.6], [1.6, 0.6]]) st.add(mk(new THREE.CylinderGeometry(0.07, 0.07, 2.6, 6), M('#FFFBF2')).translateX(a).translateY(1.3).translateZ(b));
  for (let i = 0; i < 6; i++) st.add(mk(new THREE.BoxGeometry(0.62, 0.14, 1.9), M(i % 2 ? '#FFFBF2' : '#FF5A3C')).translateX(-1.55 + i * 0.62).translateY(2.65));
  for (let i = 0; i < 5; i++) { const lo = mk(new THREE.TorusGeometry(0.22, 0.12, 8, 16), M('#D99A44')); lo.rotation.x = Math.PI / 2; lo.position.set(-1.2 + i * 0.6, 1.2, 0); st.add(lo); }
  addCol(sx, sz, 1.9);
  // bushes of marshmallow
  const bushes = scatter(26, () => { const a = rand(0, TAU), r = rand(13, 22), x = V.x + Math.cos(a) * r, z = V.z + Math.sin(a) * r; return pathDist(x, z) > 3 ? { x, z } : null; });
  instanced(new THREE.IcosahedronGeometry(0.8, 1), M('#FFFFFF', { flatShading: true }), bushes, b => ({ x: b.x, y: height(b.x, b.z) + 0.4, z: b.z, s: rand(0.7, 1.3), color: ['#FFD6E5', '#D9F2E6', '#FFF4D6', '#E0D9FF'][Math.floor(rand(0, 4))] }));
  makeSign(3.5, 26.5, 0.2, ['Ring Village']);
  makeSign(-6, -2, 0, ['↑ Marshmallow', 'Mountain']);
  makeSign(-14, 23, Math.PI / 2 - 0.25, ['← Oat Meadow']);
  makeSign(14, 13, -Math.PI / 2 - 0.3, ['Cocoa Caves →']);
  makeSign(6, 33, Math.PI, ['↓ Milk Beach']);
}
const fountainTip = new THREE.Vector3();

function buildMeadow(){
  const S = SITES.meadow;
  const stalks = scatter(quality === 'low' ? 160 : 300, () => { const a = rand(0, TAU), r = Math.sqrt(Math.random()) * 26, x = S.x + Math.cos(a) * r, z = S.z + Math.sin(a) * r; return r > 8 && pathDist(x, z) > 2.2 && height(x, z) > 0.8 ? { x, z } : null; });
  const stalkGeo = new THREE.ConeGeometry(0.11, 1.4, 5).translate(0, 0.7, 0);
  instanced(stalkGeo, swayMat('#F0C86A', 0.12), stalks, s => ({ x: s.x, y: height(s.x, s.z) - 0.1, z: s.z, s: rand(0.75, 1.15), ry: rand(0, TAU), color: rand() > 0.5 ? '#F5D27A' : '#E2B054' }));
  const ringsAt = [[-40, 36, 0.4], [-64, 30, 1.2], [-62, 12, 2.2], [-44, 10, 0.9], [-56, 40, 2.7], [-70, 20, 0.2]];
  ringsAt.forEach(([x, z, r]) => oatRing(x, z, r, rand(1.8, 2.6), rand(0.6, 0.85), rand(0.6, 1.1), rand() > 0.5 ? '#E8B95C' : '#D9A048'));
}
function buildMountain(){
  const S = SITES.mountain;
  const items = scatter(quality === 'low' ? 30 : 50, () => { const a = rand(0, TAU), r = rand(9, 30), x = S.x + Math.cos(a) * r, z = S.z + Math.sin(a) * r; return pathDist(x, z) > 2.6 && height(x, z) > 2 ? { x, z } : null; });
  instanced(new THREE.CapsuleGeometry(0.9, 0.9, 4, 10), M('#FFFFFF'), items, it => { const s = rand(0.8, 1.9); addCol(it.x, it.z, 0.85 * s); return { x: it.x, y: height(it.x, it.z) + 0.6 * s, z: it.z, s, ry: rand(0, TAU), rz: rand(-0.3, 0.3), color: ['#FFE1EC', '#FFFFFF', '#DFF5EA', '#FFF1D9', '#EEE3FF'][Math.floor(rand(0, 5))] }; });
  // summit flags
  for (const [dx, dz] of [[-6, -4], [6, -3], [0, -8]]) { const x = S.x + dx, z = S.z + dz, y = height(x, z);
    scene.add(mk(new THREE.CylinderGeometry(0.08, 0.08, 4, 6), M('#FFFBF2')).translateX(x).translateY(y + 2).translateZ(z));
    const fl = mk(new THREE.PlaneGeometry(1.4, 0.8), M('#FF5A3C', { side: THREE.DoubleSide }), false); fl.position.set(x + 0.7, y + 3.5, z); scene.add(fl); flags.push(fl); }
}
const flags = [];
function buildCaves(){
  const S = SITES.caves;
  const puffs = scatter(quality === 'low' ? 26 : 44, () => { const a = rand(0, TAU), r = rand(9, 26), x = S.x + 6 + Math.cos(a) * r, z = S.z + Math.sin(a) * r; return pathDist(x, z) > 2.6 && height(x, z) > 1 && Math.hypot(x - S.x, z - S.z) > 8 ? { x, z } : null; });
  instanced(new THREE.IcosahedronGeometry(1, 1), M('#FFFFFF', { flatShading: true }), puffs, it => { const s = rand(0.8, 2.2); addCol(it.x, it.z, 0.9 * s); return { x: it.x, y: height(it.x, it.z) + 0.5 * s, z: it.z, s, ry: rand(0, TAU), color: rand() > 0.5 ? '#5A3520' : '#744528' }; });
  // cave mouth
  const cx = S.x + 11, cz = S.z - 3, cy = height(cx, cz);
  const cave = new THREE.Group(); cave.position.set(cx, cy, cz); cave.rotation.y = -Math.PI / 2 + 0.3; scene.add(cave);
  const rock = M('#6B4127', { flatShading: true });
  cave.add(mk(new THREE.SphereGeometry(5.5, 12, 8, 0, TAU, 0, Math.PI / 2), rock, true, true).translateZ(-2));
  const mouth = mk(new THREE.CircleGeometry(2.6, 20, 0, Math.PI), new THREE.MeshBasicMaterial({ color: '#1A0F08' }), false); mouth.position.set(0, 0.05, 3.3); cave.add(mouth);
  const arch = mk(new THREE.TorusGeometry(2.8, 0.7, 8, 20, Math.PI), rock); arch.position.set(0, 0, 3.3); cave.add(arch);
  addCol(cx, cz, 5);
  const crystals = scatter(18, () => { const a = rand(0, TAU), r = rand(5, 14); const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; return height(x, z) > 1 && Math.hypot(x - S.x, z - S.z) > 6 ? { x, z } : null; });
  instanced(new THREE.OctahedronGeometry(0.6, 0), MS('#CFF2FF', 0.2, 0.1, { emissive: '#7FD3FF', emissiveIntensity: 0.6, flatShading: true }), crystals, it => ({ x: it.x, y: height(it.x, it.z) + 0.5, z: it.z, sx: rand(0.6, 1), sy: rand(1.2, 2.2), sz: rand(0.6, 1), ry: rand(0, TAU), rz: rand(-0.4, 0.4) }));
}
function buildForest(){
  const S = SITES.forest;
  const inForest = scatter(quality === 'low' ? 34 : 56, () => { const a = rand(0, TAU), r = Math.sqrt(Math.random()) * 24, x = S.x + Math.cos(a) * r, z = S.z + Math.sin(a) * r; return pathDist(x, z) > 3 && height(x, z) > 0.9 && !nearSite(x, z, 3) ? { x, z } : null; });
  const extra = scatter(quality === 'low' ? 20 : 40, () => { const x = rand(-80, 80), z = rand(-80, 80); return height(x, z) > 1.2 && height(x, z) < 9 && pathDist(x, z) > 4 && !nearSite(x, z, 6) && Math.hypot(x, z - 18) > 26 ? { x, z } : null; });
  const trees = inForest.concat(extra).map(t => ({ ...t, s: rand(0.8, 1.35), ry: rand(0, TAU) }));
  instanced(new THREE.CylinderGeometry(0.28, 0.42, 3.6, 7).translate(0, 1.8, 0), M('#9C6438', { flatShading: true }), trees, t => { addCol(t.x, t.z, 0.6 * t.s); return { x: t.x, y: height(t.x, t.z) - 0.1, z: t.z, s: t.s, ry: t.ry }; });
  const flakeGeo = new THREE.DodecahedronGeometry(1.6, 0);
  const flakes = []; trees.forEach(t => { for (let k = 0; k < 3; k++) flakes.push({ t, k }); });
  instanced(flakeGeo, swayMat('#FFFFFF', 0.03), flakes, ({ t, k }) => ({ x: t.x + Math.sin(k * 2.1 + t.ry) * 0.5 * t.s, y: height(t.x, t.z) + (3.3 + k * 0.85) * t.s, z: t.z + Math.cos(k * 2.1 + t.ry) * 0.5 * t.s, sx: (1.5 - k * 0.3) * t.s, sy: 0.42 * t.s, sz: (1.4 - k * 0.28) * t.s, ry: t.ry + k, rx: rand(-0.15, 0.15), color: ['#F0A63A', '#F6C15A', '#E58A2E', '#FFCF6E'][Math.floor(rand(0, 4))] }));
}
function buildBeach(){
  const S = SITES.beach;
  for (const [dx, dz, c] of [[-13, 3, '#FF5A3C'], [12, -4, '#2340E8'], [14, 7, '#FFD447']]) {
    const x = S.x + dx, z = S.z + dz, y = height(x, z);
    scene.add(mk(new THREE.CylinderGeometry(0.08, 0.08, 3, 6), M('#FFFBF2')).translateX(x).translateY(y + 1.5).translateZ(z));
    scene.add(mk(new THREE.ConeGeometry(2, 0.8, 10), M(c, { flatShading: true })).translateX(x).translateY(y + 3.1).translateZ(z));
    addCol(x, z, 0.4);
  }
  // spoon boat out at sea
  const b = new THREE.Group(); b.position.set(-22, 0.1, 90); b.rotation.y = 0.6; scene.add(b); boat = b;
  const steel = MS('#E8ECF4', 0.25, 0.6);
  const hull = mk(new THREE.SphereGeometry(2.2, 20, 12, 0, TAU, Math.PI / 2, Math.PI / 2), steel); hull.scale.set(1, 0.6, 1.6); b.add(hull);
  const handle = mk(new THREE.CylinderGeometry(0.25, 0.35, 7, 10), steel); handle.rotation.x = Math.PI / 2 - 0.25; handle.position.set(0, 0.8, -5.5); b.add(handle);
}
let boat = null;
function buildDecor(){
  const n = quality === 'low' ? 500 : quality === 'medium' ? 900 : 1400;
  const tufts = scatter(n, () => { const x = rand(-85, 85), z = rand(-85, 85); const h = height(x, z); return h > 0.9 && h < 10 && pathDist(x, z) > 1.8 && Math.hypot(x, z - 14) > 11 && !(Math.hypot(x - SITES.beach.x, z - SITES.beach.z) < 12) ? { x, z } : null; }, 8);
  instanced(new THREE.ConeGeometry(0.14, 0.9, 4).translate(0, 0.45, 0), swayMat('#FFFFFF', 0.18), tufts, t => ({ x: t.x, y: height(t.x, t.z) - 0.05, z: t.z, s: rand(0.7, 1.4), ry: rand(0, TAU), color: rand() > 0.6 ? '#F2CF78' : '#D9A750' })).castShadow = false;
  const pebbles = scatter(90, () => { const x = rand(-85, 85), z = rand(-85, 85); return height(x, z) > 0.9 && pathDist(x, z) > 2 && !nearSite(x, z, 2) ? { x, z } : null; });
  instanced(new THREE.DodecahedronGeometry(0.5, 0), M('#FFFFFF', { flatShading: true }), pebbles, p => ({ x: p.x, y: height(p.x, p.z) + 0.1, z: p.z, s: rand(0.5, 1.2), ry: rand(0, TAU), color: rand() > 0.5 ? '#C98A43' : '#B5763A' })).castShadow = false;
}
// clouds
const cloudParts = [];
function buildClouds(){
  const clouds = [];
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + rand(-0.2, 0.2), r = rand(30, 170); clouds.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, y: rand(74, 96), sp: rand(0.6, 1.4) }); }
  clouds.forEach(c => { const k = Math.floor(rand(4, 7)); for (let j = 0; j < k; j++) cloudParts.push({ c, ox: (j - k / 2) * rand(3, 4.5), oy: rand(-1, 1.5), oz: rand(-2.5, 2.5), s: rand(3, 5.5) }); });
  const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshLambertMaterial({ color: '#FFFFFF', emissive: '#FFF4E8', emissiveIntensity: 0.35, fog: false }), cloudParts.length);
  im.castShadow = false; scene.add(im); cloudMesh = im;
}
let cloudMesh = null;
const cm4 = new THREE.Matrix4(), cq = new THREE.Quaternion(), cs = new THREE.Vector3(), cp = new THREE.Vector3();
function updateClouds(dt){
  cloudParts.forEach((p, i) => {
    if (i === 0 || p.c !== cloudParts[i - 1].c) { p.c.x += p.c.sp * dt; if (p.c.x > 170) p.c.x = -170; }
    cp.set(p.c.x + p.ox, p.c.y + p.oy, p.c.z + p.oz); cs.set(p.s, p.s * 0.7, p.s); cm4.compose(cp, cq, cs); cloudMesh.setMatrixAt(i, cm4);
  });
  cloudMesh.instanceMatrix.needsUpdate = true;
}

/* ================= particles ================= */
class Particles {
  constructor(max, additive){
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.col = new Float32Array(max * 3); this.size = new Float32Array(max); this.alpha = new Float32Array(max);
    this.vel = new Float32Array(max * 3); this.life = new Float32Array(max); this.maxLife = new Float32Array(max); this.grav = new Float32Array(max); this.s0 = new Float32Array(max);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('acolor', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 400 } }, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: 'uniform float uScale; attribute vec3 acolor; attribute float size; attribute float alpha; varying vec3 vC; varying float vA; void main(){ vC = acolor; vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vC, vA * smoothstep(0.5, 0.15, d));\n#include <colorspace_fragment>\n}'
    });
    this.points = new THREE.Points(g, this.mat); this.points.frustumCulled = false; this.points.renderOrder = 5; scene.add(this.points);
  }
  emit(x, y, z, vx, vy, vz, life, size, color, grav = 0){
    if (this.n >= this.max) return; const i = this.n++;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.col[i * 3] = color.r; this.col[i * 3 + 1] = color.g; this.col[i * 3 + 2] = color.b;
    this.life[i] = this.maxLife[i] = life; this.size[i] = this.s0[i] = size; this.grav[i] = grav; this.alpha[i] = 1;
  }
  update(dt){
    for (let i = 0; i < this.n; i++) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) { const j = --this.n; this.copy(j, i); i--; continue; }
      this.vel[i * 3 + 1] -= this.grav[i] * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt; this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt; this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      const k = this.life[i] / this.maxLife[i]; this.alpha[i] = Math.min(1, k * 2); this.size[i] = this.s0[i] * (0.4 + 0.6 * k);
    }
    this.geo.setDrawRange(0, this.n);
    for (const a of ['position', 'acolor', 'size', 'alpha']) this.geo.attributes[a].needsUpdate = true;
  }
  copy(from, to){
    for (let k = 0; k < 3; k++) { this.pos[to * 3 + k] = this.pos[from * 3 + k]; this.vel[to * 3 + k] = this.vel[from * 3 + k]; this.col[to * 3 + k] = this.col[from * 3 + k]; }
    this.life[to] = this.life[from]; this.maxLife[to] = this.maxLife[from]; this.size[to] = this.size[from]; this.s0[to] = this.s0[from]; this.grav[to] = this.grav[from]; this.alpha[to] = this.alpha[from];
  }
}
const sparks = new Particles(900, true), debris = new Particles(1400, false);
const COL = { milk: new THREE.Color('#FFFFFF'), gold: new THREE.Color('#FFD447'), crumb: new THREE.Color('#D9A048'), dust: new THREE.Color('#E8CF9C'), red: new THREE.Color('#FF7A5A'), blue: new THREE.Color('#9FD8FF'), pink: new THREE.Color('#FFB3D1'), cocoa: new THREE.Color('#6B4127') };
function burst(sys, x, y, z, n, color, speed = 6, life = 0.7, size = 0.35, grav = 12, up = 0.6){
  for (let i = 0; i < n; i++) { const a = rand(0, TAU), s = rand(0.3, 1) * speed; sys.emit(x, y, z, Math.cos(a) * s, (rand(0.2, 1) + up) * speed * 0.8, Math.sin(a) * s, life * rand(0.6, 1.2), size * rand(0.6, 1.3), color, grav); }
}

/* ================= characters ================= */
function heroModel(){
  const root = new THREE.Group(), rig = new THREE.Group(); root.add(rig);
  const mats = { tunic: new THREE.MeshLambertMaterial({ color: '#2340E8' }), navy: new THREE.MeshLambertMaterial({ color: '#14215C' }), skin: new THREE.MeshLambertMaterial({ color: '#FFDDB8' }), silver: MS('#E6EBF3', 0.3, 0.55), gold: MS('#FFD447', 0.35, 0.3), red: new THREE.MeshLambertMaterial({ color: '#FF5A3C', side: THREE.DoubleSide }) };
  const torso = mk(new THREE.CapsuleGeometry(0.42, 0.5, 4, 14), mats.tunic); torso.position.y = 1.08; rig.add(torso);
  const belt = mk(new THREE.TorusGeometry(0.43, 0.07, 6, 22), mats.gold); belt.rotation.x = Math.PI / 2; belt.position.y = 0.95; rig.add(belt);
  const head = new THREE.Group(); head.position.y = 1.86; rig.add(head);
  head.add(mk(new THREE.SphereGeometry(0.42, 22, 16), mats.skin));
  const helm = mk(new THREE.SphereGeometry(0.45, 22, 12, 0, TAU, 0, Math.PI * 0.5), mats.silver); helm.position.y = 0.04; helm.rotation.x = -0.12; head.add(helm);
  const plume = mk(new THREE.ConeGeometry(0.13, 0.55, 10), mats.gold); plume.position.set(0, 0.6, -0.06); plume.rotation.x = -0.35; head.add(plume);
  const eyeM = new THREE.MeshBasicMaterial({ color: '#14215C' }), hiM = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
  for (const s of [-1, 1]) { const e = mk(new THREE.SphereGeometry(0.07, 10, 8), eyeM, false); e.position.set(0.15 * s, -0.04, 0.37); e.scale.set(1, 1.35, 0.6); head.add(e); const h = mk(new THREE.SphereGeometry(0.022, 6, 6), hiM, false); h.position.set(0.15 * s + 0.02, 0.0, 0.41); head.add(h); }
  const legs = [], arms = [];
  for (const s of [-1, 1]) {
    const lp = new THREE.Group(); lp.position.set(0.19 * s, 0.66, 0); rig.add(lp);
    const leg = mk(new THREE.CapsuleGeometry(0.13, 0.34, 4, 8), mats.navy); leg.position.y = -0.27; lp.add(leg);
    const boot = mk(new THREE.SphereGeometry(0.16, 10, 8), mats.navy); boot.scale.set(1, 0.7, 1.35); boot.position.set(0, -0.55, 0.06); lp.add(boot);
    legs.push(lp);
    const ap = new THREE.Group(); ap.position.set(0.53 * s, 1.36, 0); rig.add(ap);
    const arm = mk(new THREE.CapsuleGeometry(0.11, 0.32, 4, 8), mats.tunic); arm.position.y = -0.23; ap.add(arm);
    const hand = mk(new THREE.SphereGeometry(0.13, 10, 8), mats.skin); hand.position.y = -0.48; ap.add(hand);
    arms.push(ap);
  }
  const spoon = new THREE.Group(); spoon.position.set(0, -0.5, 0.05); arms[1].add(spoon);
  const handle = mk(new THREE.CylinderGeometry(0.05, 0.065, 1.25, 8), mats.silver); handle.rotation.x = Math.PI / 2; handle.position.z = 0.55; spoon.add(handle);
  const bowl = mk(new THREE.SphereGeometry(0.26, 14, 10), mats.silver); bowl.scale.set(1, 0.34, 1.45); bowl.position.z = 1.3; spoon.add(bowl);
  const cape = mk(new THREE.PlaneGeometry(0.85, 1.05, 1, 4).translate(0, -0.52, 0), mats.red); cape.position.set(0, 1.55, -0.42); rig.add(cape);
  root.scale.setScalar(0.95);
  return { root, rig, head, legs, arms, spoon, cape, mats };
}
function soggyModel(kind){
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const mat = MS(kind === 'boss' ? '#E3E9FF' : '#F3F6FF', 0.16, 0, { emissive: '#000000' });
  const b = mk(new THREE.SphereGeometry(0.85, 26, 20), mat); b.scale.set(1, 0.85, 1); b.position.y = 0.75; body.add(b);
  for (let i = 0; i < 3; i++) { const d = mk(new THREE.SphereGeometry(0.2, 10, 8), mat); const a = i * 2.1 + 0.4; d.position.set(Math.cos(a) * 0.78, 0.18, Math.sin(a) * 0.78); d.scale.set(1, 0.7, 1); body.add(d); }
  const eyeM = new THREE.MeshBasicMaterial({ color: '#14215C' }), hiM = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
  for (const s of [-1, 1]) {
    const e = mk(new THREE.SphereGeometry(0.12, 10, 8), eyeM, false); e.position.set(0.27 * s, 0.95, 0.7); e.scale.set(1, 1.2, 0.6); body.add(e);
    const h = mk(new THREE.SphereGeometry(0.04, 6, 6), hiM, false); h.position.set(0.27 * s + 0.04, 1.0, 0.77); body.add(h);
    const brow = mk(new THREE.BoxGeometry(0.28, 0.06, 0.06), eyeM, false); brow.position.set(0.27 * s, 1.14, 0.7); brow.rotation.z = -0.45 * s; body.add(brow);
  }
  const mouth = mk(new THREE.TorusGeometry(0.12, 0.035, 6, 12, Math.PI), eyeM, false); mouth.position.set(0, 0.7, 0.8); mouth.rotation.z = 0; body.add(mouth);
  const flake = mk(new THREE.CylinderGeometry(0.38, 0.42, 0.08, 7), M('#D29A45', { flatShading: true })); flake.position.set(0.18, 1.48, 0); flake.rotation.set(0.35, 0, 0.5); body.add(flake);
  if (kind !== 'small') {
    const crown = new THREE.Group(); crown.position.y = 1.45; body.add(crown);
    const cm = M(kind === 'boss' ? '#C98A3A' : '#B07A3A', { flatShading: true });
    for (let i = 0; i < 6; i++) { const f = mk(new THREE.CylinderGeometry(0.22, 0.26, 0.06, 6), cm); const a = i / 6 * TAU; f.position.set(Math.cos(a) * 0.42, 0.1, Math.sin(a) * 0.42); f.rotation.set(Math.sin(a) * 0.9, 0, Math.cos(a) * 0.9 + 0.3); crown.add(f); }
  }
  const s = kind === 'boss' ? 3.8 : kind === 'big' ? 1.55 : 1;
  g.scale.setScalar(s);
  return { g, body, mat, s };
}
function villagerModel(color, hat){
  const g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
  rig.add(mk(new THREE.CapsuleGeometry(0.45, 0.55, 4, 12), M(color)).translateY(1.0));
  const head = new THREE.Group(); head.position.y = 1.85; rig.add(head);
  head.add(mk(new THREE.SphereGeometry(0.42, 20, 14), M('#FFE0C2')));
  const eyeM = new THREE.MeshBasicMaterial({ color: '#14215C' });
  for (const s of [-1, 1]) { const e = mk(new THREE.SphereGeometry(0.06, 8, 6), eyeM, false); e.position.set(0.14 * s, 0, 0.38); e.scale.set(1, 1.3, 0.6); head.add(e); }
  const smile = mk(new THREE.TorusGeometry(0.1, 0.025, 6, 12, Math.PI), eyeM, false); smile.position.set(0, -0.13, 0.39); smile.rotation.z = Math.PI; head.add(smile);
  if (hat === 'top') { head.add(mk(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 18), M('#14215C')).translateY(0.32)); head.add(mk(new THREE.CylinderGeometry(0.32, 0.34, 0.6, 16), M('#14215C')).translateY(0.62)); head.add(mk(new THREE.CylinderGeometry(0.345, 0.345, 0.1, 16), M('#FFD447')).translateY(0.42)); }
  if (hat === 'chef') { head.add(mk(new THREE.CylinderGeometry(0.34, 0.34, 0.35, 14), M('#FFFFFF')).translateY(0.42)); for (let i = 0; i < 4; i++) head.add(mk(new THREE.SphereGeometry(0.22, 10, 8), M('#FFFFFF')).translateX(Math.cos(i * 1.57) * 0.18).translateY(0.7).translateZ(Math.sin(i * 1.57) * 0.18)); }
  if (hat === 'bonnet') { const bn = mk(new THREE.SphereGeometry(0.47, 16, 10, 0, TAU, 0, Math.PI / 2), M('#FFB3D1')); bn.rotation.x = -0.4; head.add(bn); }
  if (hat === 'cap') { const c = mk(new THREE.SphereGeometry(0.44, 16, 10, 0, TAU, 0, Math.PI / 2), M('#FF5A3C')); head.add(c); head.add(mk(new THREE.BoxGeometry(0.5, 0.05, 0.35), M('#FF5A3C')).translateY(0.08).translateZ(0.42)); }
  return { g, rig, head };
}

/* ================= player ================= */
const hero = heroModel(); scene.add(hero.root);
const trailMat = new THREE.MeshBasicMaterial({ color: '#FFFBE6', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
const trail = new THREE.Mesh(new THREE.RingGeometry(1.1, 2.7, 36, 1, -Math.PI * 0.4, Math.PI * 0.8).rotateX(-Math.PI / 2), trailMat); scene.add(trail);
const spinTrail = new THREE.Mesh(new THREE.RingGeometry(1.0, 3.4, 48).rotateX(-Math.PI / 2), trailMat.clone()); scene.add(spinTrail);
const P = { x: 0, z: 25, y: 0, vx: 0, vz: 0, kx: 0, kz: 0, face: Math.PI, hp: 10, maxHp: 10, level: 1, xp: 0, next: 6, dmg: 1,
  atkCd: 0, combo: 0, lastAtk: -9, swingT: 0, swingDur: 0.24, swingHit: true, spin: false, dashT: 0, dashCd: 0, dashX: 0, dashZ: 0, inv: 0, special: 0, walk: 0, moving: 0, alive: true, flash: 0 };
const pShadow = blob(1.8);
function setDmg(){ P.dmg = 1 + Math.floor((P.level - 1) / 2); }

/* ================= sites, rings ================= */
const RING_SITES = [
  { key: 'meadow', name: 'Oat Meadow', ...SITES.meadow, guards: [['small', -4, -3], ['small', 4, -2], ['small', 0, 5]] },
  { key: 'mountain', name: 'Marshmallow Mountain', ...SITES.mountain, guards: [['small', -4, 2], ['small', 4, 3], ['big', 0, -5]] },
  { key: 'caves', name: 'Cocoa Caves', ...SITES.caves, guards: [['small', -4, 4], ['small', 3, 5], ['small', 5, -3], ['big', -2, -5]] }
];
const ringMat = MS('#FFD447', 0.28, 0.35, { emissive: '#B86E00', emissiveIntensity: 0.55 });
RING_SITES.forEach(s => {
  const y = height(s.x, s.z); s.y = y; s.cleared = false; s.collected = false; s.enemies = [];
  const g = new THREE.Group(); g.position.set(s.x, y, s.z); scene.add(g); s.group = g;
  g.add(mk(new THREE.CylinderGeometry(1.7, 2.0, 0.6, 20), M('#EAD7B3'), true, true).translateY(0.3));
  g.add(mk(new THREE.CylinderGeometry(1.25, 1.45, 0.5, 20), ringMat).translateY(0.85));
  const ring = mk(new THREE.TorusGeometry(1.25, 0.36, 18, 48), ringMat); ring.position.y = 3; g.add(ring); s.ring = ring;
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: '#FFD447', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 })); glow.scale.set(7, 7, 1); glow.position.y = 3; g.add(glow); s.glow = glow;
  const bm = new THREE.MeshLambertMaterial({ color: '#CFE6FF', emissive: '#7FB8FF', emissiveIntensity: 0.4, transparent: true, opacity: 0.28, depthWrite: false });
  const barrier = mk(new THREE.SphereGeometry(3.2, 28, 18), bm, false); barrier.position.y = 2.2; g.add(barrier); s.barrier = barrier;
  addCol(s.x, s.z, 1.9);
});

/* ================= enemies ================= */
const enemies = [];
function spawnEnemy(kind, x, z, site){
  const m = soggyModel(kind); scene.add(m.g);
  const cfg = { small: { hp: 3, speed: 3.3, dmg: 1, xp: 4, r: 0.8 }, big: { hp: 8, speed: 2.7, dmg: 2, xp: 10, r: 1.25 } }[kind];
  const e = { kind, x, z, y: height(x, z), hx: x, hz: z, ...cfg, maxHp: cfg.hp, state: 'idle', t: rand(0, 3), st: 0, cd: rand(0.5, 1.5), kx: 0, kz: 0, face: rand(0, TAU), wx: x, wz: z, wanderT: 0, flash: 0, alive: true, site, m, shadow: blob(cfg.r * 2.2), aggro: 11, bar: null };
  enemies.push(e); if (site) site.enemies.push(e); return e;
}
RING_SITES.forEach(s => s.guards.forEach(([k, dx, dz]) => spawnEnemy(k, s.x + dx, s.z + dz, s)));
[[-26, 21], [-1, -28], [30, 2], [3, 46], [-46, -14], [40, -30]].forEach(([x, z]) => spawnEnemy('small', x, z, null));

/* ================= NPCs ================= */
const NPCS = [
  { id: 'mayor', name: 'Mayor Oatley', x: 0, z: 19, color: '#FF8A5B', hat: 'top' },
  { id: 'baker', name: 'Baker Bran', x: 7.2, z: 19.6, color: '#F7A8C8', hat: 'chef' },
  { id: 'granny', name: 'Granny Granola', x: -4.5, z: -14, color: '#7ED6B2', hat: 'bonnet' },
  { id: 'puff', name: 'Puff the Explorer', x: 27, z: 5.5, color: '#B58CFF', hat: 'cap' }
];
NPCS.forEach(n => { const m = villagerModel(n.color, n.hat); n.m = m; n.y = height(n.x, n.z); m.g.position.set(n.x, n.y, n.z); scene.add(m.g); n.face = Math.atan2(0 - n.x, 25 - n.z); blob(1.7).position.set(n.x, n.y + 0.04, n.z); addCol(n.x, n.z, 0.7);
  const el = document.createElement('div'); el.className = 'label'; el.innerHTML = `${n.name}<em></em>`; $('worldLayer').appendChild(el); n.label = el; });
function npcLines(n){
  const left = 3 - state.rings;
  switch (n.id) {
    case 'mayor':
      if (state.stage === 'talk') return ['Sir Crunch! Thank goodness you’re here.', 'The Great Sog crawled out of the Milk Sea, and everything he touches goes soggy.', 'His soggies stole our three Golden Rings, the ones that keep the kingdom crunchy.', 'One is in Oat Meadow, one on top of Marshmallow Mountain, and one at the Cocoa Caves. Follow the golden beam!'];
      if (state.stage === 'rings') return [`Follow the golden beam, Sir Crunch. ${left} ring${left === 1 ? '' : 's'} to go!`];
      if (state.stage === 'boss') return ['The Great Sog is at Milk Beach! Go, go, go!'];
      return ['You did it! Crunchy cereal for everyone, forever. Well, until breakfast.'];
    case 'baker': return ['Fresh tip from the bakery: attack three times fast for a spinning spoon combo.', 'Every hit fills your Burst meter. When it glows, unleash a Crunch Burst!'];
    case 'granny': return ['A big Sog Knight guards the ring on Marshmallow Mountain.', 'Dash right through its lunge, dear. Timing is everything.'];
    case 'puff': return ['I tried to explore the Cocoa Caves, but the soggies said no. Rudely.', 'If you get hurt, grab a berry. Soggies drop them when they pop.'];
  }
  return ['Hello!'];
}

/* ================= pickups ================= */
const coinSpots = [];
PATHS.forEach(p => { for (let i = 0; i < p.length - 1; i++) { const [ax, az] = p[i], [bx, bz] = p[i + 1]; const L = Math.hypot(bx - ax, bz - az); for (let d = 4; d < L; d += 5) { const t = d / L, side = ((coinSpots.length % 2) ? 1 : -1) * 1.1; const nx = -(bz - az) / L, nz = (bx - ax) / L; const x = ax + (bx - ax) * t + nx * side, z = az + (bz - az) * t + nz * side; if (Math.hypot(x, z - 14) > 12) coinSpots.push({ x, z }); } } });
scatter(14, () => { const a = rand(0, TAU), r = rand(4, 18); const x = SITES.forest.x + Math.cos(a) * r, z = SITES.forest.z + Math.sin(a) * r; return height(x, z) > 1 ? { x, z } : null; }).forEach(p => coinSpots.push(p));
const coins = coinSpots.map(c => ({ ...c, y: height(c.x, c.z) + 0.9, alive: true }));
const coinMesh = new THREE.InstancedMesh(new THREE.TorusGeometry(0.32, 0.13, 8, 18), MS('#F7C040', 0.3, 0.3, { emissive: '#A85F00', emissiveIntensity: 0.45 }), coins.length);
coinMesh.castShadow = true; scene.add(coinMesh);
const berries = [];
const berryGeo = new THREE.SphereGeometry(0.22, 10, 8), berryMats = [M('#5B7CFF'), M('#FF5A7A'), M('#B07CFF')];
function dropBerry(x, z){
  const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const b = mk(berryGeo, berryMats[i]); b.position.set(Math.cos(i * 2.1) * 0.2, 0.18 * (i === 2 ? 2 : 1), Math.sin(i * 2.1) * 0.2); g.add(b); }
  const leaf = mk(new THREE.ConeGeometry(0.12, 0.3, 5), M('#2BB673')); leaf.position.y = 0.55; g.add(leaf);
  g.position.set(x, height(x, z) + 0.6, z); scene.add(g); berries.push({ x, z, g, t: 0 });
}

/* ================= beacon ================= */
const beaconMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#FFD447') } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform float uTime; uniform vec3 uColor; varying vec2 vUv; void main(){ float a = (1.0 - vUv.y) * 0.55 * (0.75 + 0.25 * sin(uTime * 3.0 + vUv.y * 12.0)); a *= smoothstep(0.0, 0.08, vUv.y); gl_FragColor = vec4(uColor, a);\n#include <colorspace_fragment>\n}'
});
const beacon = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 70, 20, 1, true).translate(0, 35, 0), beaconMat); beacon.renderOrder = 6; scene.add(beacon);

/* ================= boss ================= */
let B = null;
const decal = new THREE.Group(); scene.add(decal); decal.visible = false;
const decalFill = new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#FF5A3C', transparent: true, opacity: 0.25, depthWrite: false }));
const decalRing = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#FF5A3C', transparent: true, opacity: 0.9, depthWrite: false }));
decal.add(decalFill, decalRing);
const shockMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const shock = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 48).rotateX(-Math.PI / 2), shockMat); scene.add(shock); let shockT = 9, shockR = 4;
function spawnBoss(){
  const m = soggyModel('boss'); scene.add(m.g);
  B = { x: 4, z: 92, y: -6, hp: 45, maxHp: 45, r: 3.1, state: 'emerge', st: 0, slamT: 3.5, sumT: 9, kx: 0, kz: 0, face: Math.PI, flash: 0, phase: 1, m, alive: true, shadow: blob(7), tx: 0, tz: 0, ax: 0, az: 0 };
  $('bossBar').classList.remove('hidden'); updateBossBar();
}
function updateBossBar(){ if (B) $('bossFill').style.transform = `scaleX(${Math.max(0, B.hp / B.maxHp)})`; }

/* ================= state, HUD, UI ================= */
const state = { mode: 'title', stage: 'talk', rings: 0, coins: 0, kills: 0, time: 0, timerOn: false, shake: 0, hitstop: 0, downT: 0, winT: -1 };
const hud = { hp: '', xp: '', lv: '', coins: '', rings: '', timer: '', obj: '', dist: '' };
function fmtTime(s){ s = Math.floor(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function setText(key, id, v){ if (hud[key] !== v) { hud[key] = v; $(id).textContent = v; } }
function objective(){
  if (state.stage === 'talk') { const n = NPCS[0]; return { text: 'Talk to Mayor Oatley', x: n.x, z: n.z, beacon: true }; }
  if (state.stage === 'rings') {
    let best = null, bd = 1e9;
    for (const s of RING_SITES) if (!s.collected) { const d = Math.hypot(s.x - P.x, s.z - P.z); if (d < bd) { bd = d; best = s; } }
    if (!best) return null;
    return { text: best.cleared ? `Grab the Golden Ring at ${best.name}` : `Win back the ring at ${best.name}`, x: best.x, z: best.z, beacon: true };
  }
  if (state.stage === 'boss' && B && B.alive) return { text: 'Defeat the Great Sog at Milk Beach', x: B.x, z: B.z, beacon: false };
  return { text: 'Kingdom saved! Explore freely', x: null };
}
const camRight = new THREE.Vector3(), camFwd = new THREE.Vector3();
function updateHud(){
  setText('lv', 'lvNum', String(P.level));
  const hpS = `${Math.max(0, Math.ceil(P.hp))} / ${P.maxHp}`;
  if (hud.hp !== hpS) { hud.hp = hpS; $('hpText').textContent = hpS; $('hpFill').style.transform = `scaleX(${Math.max(0, P.hp / P.maxHp)})`; }
  const xpS = (P.xp / P.next).toFixed(3); if (hud.xp !== xpS) { hud.xp = xpS; $('xpFill').style.transform = `scaleX(${P.xp / P.next})`; }
  setText('coins', 'coinNum', String(state.coins));
  setText('timer', 'timer', fmtTime(state.time));
  const rk = String(state.rings); if (hud.rings !== rk) { hud.rings = rk; $('ringIcons').querySelectorAll('i').forEach((el, i) => el.classList.toggle('on', i < state.rings)); }
  const o = objective();
  setText('obj', 'objText', o ? o.text : '');
  if (o && o.x != null) {
    const dx = o.x - P.x, dz = o.z - P.z, d = Math.hypot(dx, dz);
    const sx = dx * camRight.x + dz * camRight.z, sy = dx * camFwd.x + dz * camFwd.z;
    $('compass').style.transform = `rotate(${Math.atan2(sx, sy)}rad)`;
    $('compass').style.visibility = d < 5 ? 'hidden' : 'visible';
    setText('dist', 'objDist', d < 5 ? 'Here!' : `${Math.round(d)} m away`);
    beacon.visible = o.beacon && d > 7; if (beacon.visible) beacon.position.set(o.x, height(o.x, o.z), o.z);
  } else { $('compass').style.visibility = 'hidden'; setText('dist', 'objDist', ''); beacon.visible = false; }
  const sp = $('bSpecial'); const p = Math.floor(P.special); if (sp.dataset.p !== String(p)) { sp.dataset.p = String(p); sp.style.setProperty('--p', p); sp.classList.toggle('ready', p >= 100); }
}
let bannerT = 0;
function banner(big, sub){ const b = $('banner'); $('bBig').textContent = big; $('bSub').textContent = sub || ''; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }
let toastT = 0;
function toast(msg, ms = 3200){ const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms); }

// floating text + labels in the world
const fts = [];
const scr = new THREE.Vector3();
function toScreen(x, y, z){ scr.set(x, y, z).project(camera); return { x: (scr.x * 0.5 + 0.5) * innerWidth, y: (-scr.y * 0.5 + 0.5) * innerHeight, ok: scr.z < 1 && scr.z > -1 }; }
function floatText(x, y, z, text, cls){
  const el = document.createElement('div'); el.className = 'ftext ' + (cls || ''); el.textContent = text; $('worldLayer').appendChild(el);
  fts.push({ el, x: x + rand(-0.3, 0.3), y, z, t: 0, life: cls === 'xp' ? 1.2 : 0.85 });
}
function updateOverlays(dt){
  for (let i = fts.length - 1; i >= 0; i--) {
    const f = fts[i]; f.t += dt; f.y += dt * 1.8;
    if (f.t > f.life) { f.el.remove(); fts.splice(i, 1); continue; }
    const s = toScreen(f.x, f.y, f.z); f.el.style.opacity = String(Math.min(1, (f.life - f.t) * 4)); f.el.style.transform = `translate(${s.x}px,${s.y}px) translate(-50%,-50%) scale(${1 + Math.max(0, 0.15 - f.t) * 2})`; f.el.style.display = s.ok ? '' : 'none';
  }
  for (const n of NPCS) {
    const d = Math.hypot(n.x - P.x, n.z - P.z), show = d < 12 && state.mode === 'play';
    n.label.style.display = show ? '' : 'none';
    if (show) { const s = toScreen(n.x, n.y + 2.9, n.z); n.label.style.transform = `translate(${s.x}px,${s.y}px) translate(-50%,-100%)`; n.label.querySelector('em').textContent = d < 3.4 ? (isTouch ? '· Talk' : '· E to talk') : ''; }
  }
  for (const e of enemies) {
    const show = e.alive && e.hp < e.maxHp && Math.hypot(e.x - P.x, e.z - P.z) < 30;
    if (show && !e.bar) { e.bar = document.createElement('div'); e.bar.className = 'ehp'; e.bar.innerHTML = '<i></i>'; $('worldLayer').appendChild(e.bar); }
    if (e.bar) {
      if (!show) { e.bar.style.display = 'none'; continue; }
      const s = toScreen(e.x, e.y + 1.9 * e.m.s + 0.3, e.z); e.bar.style.display = s.ok ? '' : 'none';
      e.bar.style.transform = `translate(${s.x}px,${s.y}px) translate(-50%,-50%)`; e.bar.firstChild.style.transform = `scaleX(${Math.max(0, e.hp / e.maxHp)})`;
    }
  }
}

/* ================= input ================= */
const keys = new Set(), pressed = new Set();
addEventListener('keydown', e => {
  const k = e.key.toLowerCase(); if (!keys.has(k)) pressed.add(k); keys.add(k);
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
  if (!isTouch && state.mode !== 'title') $('keys').classList.remove('hidden');
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
const T = { jx: 0, jy: 0, id: null, ox: 0, oy: 0, atkHeld: false, atk: false, dash: false, sp: false, talk: false };
const joy = $('joy'), knob = $('knob'), zone = $('joyZone');
zone.addEventListener('pointerdown', e => { if (T.id !== null) return; T.id = e.pointerId; T.ox = e.clientX; T.oy = e.clientY; joy.style.left = e.clientX + 'px'; joy.style.top = e.clientY + 'px'; zone.setPointerCapture(e.pointerId); e.preventDefault(); });
zone.addEventListener('pointermove', e => { if (e.pointerId !== T.id) return; let dx = e.clientX - T.ox, dy = e.clientY - T.oy; const L = Math.hypot(dx, dy), R = 52; if (L > R) { dx *= R / L; dy *= R / L; } T.jx = dx / R; T.jy = -dy / R; knob.style.transform = `translate(${dx}px,${dy}px)`; });
const joyEnd = e => { if (e.pointerId !== T.id) return; T.id = null; T.jx = T.jy = 0; knob.style.transform = ''; joy.style.left = ''; joy.style.top = ''; };
zone.addEventListener('pointerup', joyEnd); zone.addEventListener('pointercancel', joyEnd);
function tbtn(id, down, up){ const b = $(id); b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); down(); }); const u = () => up && up(); b.addEventListener('pointerup', u); b.addEventListener('pointercancel', u); b.addEventListener('contextmenu', e => e.preventDefault()); }
tbtn('bAtk', () => { T.atk = true; T.atkHeld = true; }, () => { T.atkHeld = false; });
tbtn('bDash', () => { T.dash = true; });
tbtn('bSpecial', () => { T.sp = true; });
tbtn('bTalk', () => { T.talk = true; });
canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && state.mode === 'play') T.atk = true; });
addEventListener('contextmenu', e => e.preventDefault());
let gpPrev = [];
const G = { x: 0, y: 0, b: [] };
function pollGamepad(){
  G.x = G.y = 0; G.b = [];
  const pads = navigator.getGamepads ? navigator.getGamepads() : []; const gp = pads && [...pads].find(p => p && p.connected);
  if (!gp) return;
  const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0; if (Math.hypot(ax, ay) > 0.2) { G.x = ax; G.y = ay; }
  const now = gp.buttons.map(b => b.pressed); G.b = now.map((p, i) => p && !gpPrev[i]); G.held = now; gpPrev = now;
  if (gp.buttons[12]?.pressed) G.y = -1; if (gp.buttons[13]?.pressed) G.y = 1; if (gp.buttons[14]?.pressed) G.x = -1; if (gp.buttons[15]?.pressed) G.x = 1;
}
function readInput(){
  const k = n => keys.has(n), p = n => pressed.has(n);
  let mx = (k('d') || k('arrowright') ? 1 : 0) - (k('a') || k('arrowleft') ? 1 : 0) + T.jx + G.x;
  let my = (k('w') || k('arrowup') ? 1 : 0) - (k('s') || k('arrowdown') ? 1 : 0) + T.jy - G.y;
  const L = Math.hypot(mx, my); if (L > 1) { mx /= L; my /= L; }
  const held = T.atkHeld || k('j') || k(' ') || (G.held && G.held[0]);
  const inp = { mx, my, mag: Math.min(1, L), attack: p('j') || p(' ') || T.atk || G.b[0], held, dash: p('k') || p('shift') || T.dash || G.b[1], special: p('l') || p('q') || T.sp || G.b[2], talk: p('e') || T.talk || G.b[3], enter: p('enter'), pause: p('p') || p('escape') || G.b[9] };
  pressed.clear(); T.atk = T.dash = T.sp = T.talk = false;
  return inp;
}

/* ================= dialog ================= */
const D = { lines: [], i: 0, shown: 0, npc: null, onDone: null };
function openDialog(npc, lines, onDone){
  state.mode = 'dialog'; D.lines = lines; D.i = 0; D.shown = 0; D.npc = npc; D.onDone = onDone;
  $('dWho').textContent = npc.name; $('dWhat').textContent = ''; $('dialog').classList.remove('hidden');
  $('dNext').textContent = isTouch ? 'Tap to continue' : 'Press E or Space';
  P.face = Math.atan2(npc.x - P.x, npc.z - P.z); npc.face = Math.atan2(P.x - npc.x, P.z - npc.z);
}
function advanceDialog(){
  const full = D.lines[D.i];
  if (D.shown < full.length) { D.shown = full.length; $('dWhat').textContent = full; return; }
  D.i++; D.shown = 0; sfxPlay('ui');
  if (D.i >= D.lines.length) { $('dialog').classList.add('hidden'); state.mode = 'play'; const cb = D.onDone; D.onDone = null; if (cb) cb(); }
}
$('dialog').addEventListener('pointerdown', e => { e.preventDefault(); if (state.mode === 'dialog') advanceDialog(); });
function updateDialog(dt, inp){
  const full = D.lines[D.i] || '';
  if (D.shown < full.length) { const before = Math.floor(D.shown); D.shown = Math.min(full.length, D.shown + dt * 48); const now = Math.floor(D.shown); if (now !== before) { $('dWhat').textContent = full.slice(0, now); if (now % 3 === 0) sfxPlay('talk'); } }
  if (inp.attack || inp.talk || inp.enter) advanceDialog();
}
function talkTo(n){
  const lines = npcLines(n);
  openDialog(n, lines, () => {
    if (n.id === 'mayor' && state.stage === 'talk') { state.stage = 'rings'; banner('Quest: The Golden Rings', 'Follow the golden beam'); sfxPlay('ring'); }
  });
}

/* ================= combat ================= */
function nearestEnemy(maxD){
  let best = null, bd = maxD;
  for (const e of enemies) if (e.alive) { const d = Math.hypot(e.x - P.x, e.z - P.z) - e.r; if (d < bd) { bd = d; best = e; } }
  if (B && B.alive && B.state !== 'emerge') { const d = Math.hypot(B.x - P.x, B.z - P.z) - B.r; if (d < bd) { bd = d; best = B; } }
  return best;
}
function startAttack(){
  P.combo = clock - P.lastAtk < 0.65 ? (P.combo + 1) % 3 : 0; P.lastAtk = clock;
  const spin = P.combo === 2;
  const t = nearestEnemy(5.5); if (t) P.face = Math.atan2(t.x - P.x, t.z - P.z);
  P.spin = spin; P.swingDur = spin ? 0.36 : 0.24; P.swingT = P.swingDur; P.swingHit = false; P.atkCd = spin ? 0.42 : 0.26;
  P.kx += Math.sin(P.face) * 3.5; P.kz += Math.cos(P.face) * 3.5;
  sfxPlay(spin ? 'spin' : 'swing');
}
function applySwing(){
  const range = P.spin ? 3.3 : 2.7, dmg = P.dmg + (P.spin ? 1 : 0); let hits = 0;
  const targets = enemies.filter(e => e.alive); if (B && B.alive && B.state !== 'emerge' && B.state !== 'dying') targets.push(B);
  for (const e of targets) {
    const dx = e.x - P.x, dz = e.z - P.z, d = Math.hypot(dx, dz);
    if (d > range + e.r) continue;
    if (!P.spin && Math.abs(angDiff(P.face, Math.atan2(dx, dz))) > 1.35 && d > e.r + 0.6) continue;
    hitEnemy(e, dmg, dx / (d || 1), dz / (d || 1), P.spin ? 12 : 9); hits++;
  }
  if (hits) { state.hitstop = 0.05; state.shake = Math.max(state.shake, 0.22); P.special = Math.min(100, P.special + 12 * hits); }
}
function hitEnemy(e, dmg, nx, nz, kb){
  e.hp -= dmg; e.flash = 0.14;
  const boss = e === B;
  e.kx += nx * kb * (boss ? 0.15 : e.kind === 'big' ? 0.6 : 1); e.kz += nz * kb * (boss ? 0.15 : e.kind === 'big' ? 0.6 : 1);
  if (!boss && e.state !== 'lunge') { e.state = 'chase'; }
  const hy = e.y + (boss ? 4 : 1.1 * e.m.s);
  floatText(e.x, hy + 0.6, e.z, String(dmg), dmg >= 3 ? '' : 'small');
  burst(debris, e.x - nx * e.r * 0.6, hy * 0.8, e.z - nz * e.r * 0.6, 8, COL.milk, 5, 0.6, 0.35, 14);
  burst(sparks, e.x - nx * e.r * 0.6, hy * 0.8, e.z - nz * e.r * 0.6, 5, COL.gold, 6, 0.35, 0.4, 0);
  sfxPlay('hit');
  if (boss) { updateBossBar(); if (B.hp <= B.maxHp / 2 && B.phase === 1) { B.phase = 2; banner('The Great Sog is furious!', 'Watch for the red circles'); sfxPlay('roar'); } if (B.hp <= 0) bossDefeated(); return; }
  if (e.hp <= 0) killEnemy(e);
}
function killEnemy(e){
  e.alive = false; scene.remove(e.m.g); scene.remove(e.shadow); if (e.bar) { e.bar.remove(); e.bar = null; }
  const y = e.y + 0.9 * e.m.s;
  burst(debris, e.x, y, e.z, 26 * e.m.s, COL.milk, 7, 0.8, 0.45, 14);
  burst(debris, e.x, y, e.z, 8, COL.crumb, 6, 0.9, 0.35, 16);
  burst(sparks, e.x, y, e.z, 14, COL.gold, 7, 0.5, 0.5, 2);
  sfxPlay('pop'); state.kills++;
  gainXp(e.xp, e.x, y + 1, e.z);
  if (Math.random() < (P.hp < P.maxHp * 0.5 ? 0.65 : 0.3)) dropBerry(e.x, e.z);
  if (e.site && !e.site.cleared && e.site.enemies.every(g => !g.alive)) {
    e.site.cleared = true; toast(`The Golden Ring at ${e.site.name} is free. Grab it!`); sfxPlay('level');
  }
}
function gainXp(n, x, y, z){
  P.xp += n; floatText(x, y, z, `+${n} XP`, 'xp');
  while (P.xp >= P.next) {
    P.xp -= P.next; P.level++; P.next = 6 + 5 * (P.level - 1); P.maxHp += 2; P.hp = P.maxHp; setDmg();
    banner('Level up!', `Level ${P.level}: more health${P.level % 2 === 1 ? ', stronger spoon' : ''}`); sfxPlay('level');
    for (let i = 0; i < 40; i++) sparks.emit(P.x + rand(-0.8, 0.8), P.y + rand(0, 0.5), P.z + rand(-0.8, 0.8), rand(-0.6, 0.6), rand(4, 9), rand(-0.6, 0.6), rand(0.7, 1.2), rand(0.3, 0.6), COL.gold, 0);
  }
}
function hurtPlayer(dmg, fx, fz){
  if (P.inv > 0 || state.mode !== 'play' || !P.alive) return;
  P.hp -= dmg; P.inv = 1.0; P.flash = 0.25;
  const dx = P.x - fx, dz = P.z - fz, d = Math.hypot(dx, dz) || 1; P.kx += dx / d * 11; P.kz += dz / d * 11;
  floatText(P.x, P.y + 2.6, P.z, `-${dmg}`, 'hurt'); sfxPlay('hurt'); state.shake = Math.max(state.shake, 0.4);
  if (navigator.vibrate) try { navigator.vibrate(40); } catch {}
  burst(debris, P.x, P.y + 1.2, P.z, 10, COL.milk, 5, 0.6, 0.35, 14);
  if (P.hp <= 0) { P.alive = false; state.mode = 'down'; state.downT = 1.8; banner('Soggy!', 'Back to the village to dry off'); }
}
function doBurst(){
  P.special = 0; state.shake = 0.7; state.hitstop = 0.08; P.inv = Math.max(P.inv, 0.5); sfxPlay('burst');
  shockR = 7.5; shockT = 0; shock.position.set(P.x, P.y + 0.3, P.z); shockMat.color.set('#FFD447');
  for (let i = 0; i < 70; i++) { const a = rand(0, TAU), s = rand(6, 16); debris.emit(P.x, P.y + 0.6, P.z, Math.cos(a) * s, rand(3, 9), Math.sin(a) * s, rand(0.6, 1.1), rand(0.35, 0.7), i % 3 ? COL.crumb : COL.gold, 18); }
  burst(sparks, P.x, P.y + 1, P.z, 50, COL.gold, 12, 0.6, 0.7, 0, 0.2);
  const targets = enemies.filter(e => e.alive); if (B && B.alive && B.state !== 'emerge' && B.state !== 'dying') targets.push(B);
  for (const e of targets) { const dx = e.x - P.x, dz = e.z - P.z, d = Math.hypot(dx, dz); if (d < 7.5 + e.r) hitEnemy(e, 3 + P.level, dx / (d || 1), dz / (d || 1), 18); }
}

/* ================= updates ================= */
function updatePlayer(dt, inp){
  P.atkCd -= dt; P.dashCd -= dt; P.inv -= dt; P.flash -= dt;
  const nearNpc = NPCS.find(n => Math.hypot(n.x - P.x, n.z - P.z) < 3.4) || null;
  $('bTalk').classList.toggle('hidden', !nearNpc || state.mode !== 'play');
  let tvx = 0, tvz = 0;
  const wx = camRight.x * inp.mx + camFwd.x * inp.my, wz = camRight.z * inp.mx + camFwd.z * inp.my;
  const moving = inp.mag > 0.12;
  if (P.dashT > 0) { P.dashT -= dt; tvx = P.dashX * 21; tvz = P.dashZ * 21; if (Math.random() < 0.7) debris.emit(P.x, P.y + 0.2, P.z, rand(-1, 1), rand(1, 2), rand(-1, 1), 0.45, 0.45, COL.dust, 2); }
  else if (moving) { tvx = wx * 7.4; tvz = wz * 7.4; }
  if (moving && P.swingT <= 0 && P.dashT <= 0) P.face = angLerp(P.face, Math.atan2(wx, wz), 1 - Math.exp(-dt * 16));
  const k = 1 - Math.exp(-dt * (P.dashT > 0 ? 30 : 13)); P.vx += (tvx - P.vx) * k; P.vz += (tvz - P.vz) * k;
  const kd = Math.exp(-dt * 9); P.kx *= kd; P.kz *= kd;
  moveOnLand(P, P.x + (P.vx + P.kx) * dt, P.z + (P.vz + P.kz) * dt);
  pushOut(P, 0.55);
  for (const e of enemies) if (e.alive) { const dx = P.x - e.x, dz = P.z - e.z, d = Math.hypot(dx, dz), min = 0.55 + e.r * 0.85; if (d < min && d > 0.001) { P.x += dx / d * (min - d) * 0.5; P.z += dz / d * (min - d) * 0.5; } }
  if (B && B.alive && B.state !== 'emerge') { const dx = P.x - B.x, dz = P.z - B.z, d = Math.hypot(dx, dz), min = 0.6 + B.r; if (d < min && d > 0.001) { P.x += dx / d * (min - d); P.z += dz / d * (min - d); } }
  P.y = height(P.x, P.z);
  P.moving = Math.hypot(P.vx, P.vz) / 7.4;
  // actions
  const enemyNear = enemies.some(e => e.alive && Math.hypot(e.x - P.x, e.z - P.z) < 8);
  if (inp.talk && nearNpc) talkTo(nearNpc);
  else if (inp.attack && nearNpc && !enemyNear) talkTo(nearNpc);
  else if ((inp.attack || inp.held) && P.atkCd <= 0) startAttack();
  if (P.swingT > 0) { P.swingT -= dt; if (!P.swingHit && P.swingT <= P.swingDur - 0.06) { P.swingHit = true; applySwing(); } }
  if (inp.dash && P.dashCd <= 0) {
    const L = Math.hypot(wx, wz); P.dashX = L > 0.1 ? wx / L : Math.sin(P.face); P.dashZ = L > 0.1 ? wz / L : Math.cos(P.face);
    P.face = Math.atan2(P.dashX, P.dashZ); P.dashT = 0.17; P.dashCd = 0.7; P.inv = Math.max(P.inv, 0.3); sfxPlay('dash');
  }
  if (inp.special && P.special >= 100) doBurst();
  // pickups
  coins.forEach((c, i) => { if (c.alive && Math.hypot(c.x - P.x, c.z - P.z) < 1.4) { c.alive = false; state.coins++; sfxPlay('coin'); burst(sparks, c.x, c.y, c.z, 8, COL.gold, 4, 0.4, 0.35, 0); } });
  for (let i = berries.length - 1; i >= 0; i--) { const b = berries[i]; if (Math.hypot(b.x - P.x, b.z - P.z) < 1.5) { scene.remove(b.g); berries.splice(i, 1); const heal = Math.min(3, P.maxHp - P.hp); P.hp = Math.min(P.maxHp, P.hp + 3); sfxPlay('berry'); floatText(P.x, P.y + 2.6, P.z, `+${Math.max(0, Math.round(heal))}`, 'heal'); burst(sparks, P.x, P.y + 1, P.z, 14, COL.blue, 4, 0.6, 0.4, 0); } }
  for (const s of RING_SITES) if (s.cleared && !s.collected && Math.hypot(s.x - P.x, s.z - P.z) < 2.9) collectRing(s);
}
function animateHero(dt){
  const h = hero, sp = P.moving;
  P.walk += dt * (6 + sp * 8) * (sp > 0.05 ? 1 : 0);
  const sw = Math.sin(P.walk) * 0.75 * Math.min(1, sp);
  h.legs[0].rotation.x = sw; h.legs[1].rotation.x = -sw;
  h.arms[0].rotation.x = -sw * 0.8;
  h.rig.position.y = Math.abs(Math.sin(P.walk)) * 0.12 * Math.min(1, sp) + (sp < 0.05 ? Math.sin(clock * 2.2) * 0.025 : 0);
  h.rig.rotation.x = P.dashT > 0 ? 0.35 : sp * 0.08;
  h.cape.rotation.x = 0.15 + sp * 0.55 + Math.sin(clock * 6) * 0.05;
  // spoon arm
  if (P.swingT > 0) {
    const t = 1 - P.swingT / P.swingDur;
    if (P.spin) { h.arms[1].rotation.set(-1.4, 0, -0.3); h.rig.rotation.y = t * TAU; }
    else { h.arms[1].rotation.set(-1.6 + Math.sin(t * Math.PI) * 0.4, 0, 1.2 - t * 2.4); h.rig.rotation.y = 0.6 - t * 1.2; }
  } else { h.arms[1].rotation.set(sw * 0.8 - 0.5, 0, 0.15); h.rig.rotation.y = 0; }
  h.root.position.set(P.x, P.y, P.z); h.root.rotation.y = P.face;
  const vis = !(P.inv > 0 && P.alive && Math.floor(clock * 20) % 2 === 0 && P.inv < 0.95);
  h.root.visible = vis || state.mode !== 'play';
  const fl = P.flash > 0 ? 0.6 : 0; for (const m of [h.mats.tunic, h.mats.skin]) m.emissive.setRGB(fl, fl * 0.2, fl * 0.1);
  pShadow.position.set(P.x, P.y + 0.05, P.z);
  // trails
  if (P.swingT > 0) {
    const t = 1 - P.swingT / P.swingDur;
    const tr = P.spin ? spinTrail : trail; tr.position.set(P.x, P.y + 1.15, P.z); tr.rotation.y = P.face; tr.material.opacity = Math.sin(t * Math.PI) * 0.65;
  } else { trail.material.opacity *= 0.7; spinTrail.material.opacity *= 0.7; }
}
function updateEnemies(dt){
  for (const e of enemies) {
    if (!e.alive) continue;
    const dx = P.x - e.x, dz = P.z - e.z, d = Math.hypot(dx, dz);
    e.t += dt; e.cd -= dt; e.flash -= dt;
    let mvx = 0, mvz = 0, spd = 0;
    const playerOk = P.alive && state.mode === 'play';
    switch (e.state) {
      case 'idle':
        if (e.t > e.wanderT) { e.wanderT = e.t + rand(2, 4); const a = rand(0, TAU), r = rand(0, 4); e.wx = e.hx + Math.cos(a) * r; e.wz = e.hz + Math.sin(a) * r; }
        { const wx = e.wx - e.x, wz = e.wz - e.z, wd = Math.hypot(wx, wz); if (wd > 0.5) { mvx = wx / wd; mvz = wz / wd; spd = 1.1; } }
        if (playerOk && d < e.aggro && state.stage !== 'talk') e.state = 'chase';
        break;
      case 'chase':
        if (!playerOk || d > 20 || Math.hypot(e.x - e.hx, e.z - e.hz) > 26) { e.state = 'return'; break; }
        mvx = dx / d; mvz = dz / d; spd = e.speed;
        if (d < e.r + 1.7 && e.cd <= 0) { e.state = 'windup'; e.st = 0; e.lx = dx / d; e.lz = dz / d; }
        break;
      case 'windup': e.st += dt; if (e.st > 0.5) { e.state = 'lunge'; e.st = 0; } break;
      case 'lunge':
        e.st += dt; mvx = e.lx; mvz = e.lz; spd = 11;
        if (d < e.r + 0.75) { hurtPlayer(e.dmg, e.x, e.z); e.state = 'recover'; e.st = 0; }
        if (e.st > 0.28) { e.state = 'recover'; e.st = 0; }
        break;
      case 'recover': e.st += dt; if (e.st > 0.6) { e.state = 'chase'; e.cd = rand(1.0, 1.9); } break;
      case 'return': {
        const hx = e.hx - e.x, hz = e.hz - e.z, hd = Math.hypot(hx, hz);
        if (hd < 1.2) { e.state = 'idle'; e.hp = e.maxHp; } else { mvx = hx / hd; mvz = hz / hd; spd = e.speed; }
        if (playerOk && d < e.aggro * 0.7) e.state = 'chase';
      }
    }
    const kd = Math.exp(-dt * 7); e.kx *= kd; e.kz *= kd;
    moveOnLand(e, e.x + (mvx * spd + e.kx) * dt, e.z + (mvz * spd + e.kz) * dt);
    for (const o of enemies) if (o !== e && o.alive) { const ox = e.x - o.x, oz = e.z - o.z, od = Math.hypot(ox, oz), min = e.r + o.r; if (od < min && od > 0.001) { e.x += ox / od * (min - od) * 0.5; e.z += oz / od * (min - od) * 0.5; } }
    pushOut(e, e.r * 0.8);
    e.y = height(e.x, e.z);
    if (spd > 0.5 && e.state !== 'lunge') e.face = angLerp(e.face, Math.atan2(mvx, mvz), 1 - Math.exp(-dt * 8));
    if (e.state === 'chase' || e.state === 'windup') e.face = angLerp(e.face, Math.atan2(dx, dz), 1 - Math.exp(-dt * 10));
    // animation
    const m = e.m; let sy = 1, sxz = 1, hop = 0;
    if (e.state === 'windup') { const k2 = Math.min(1, e.st / 0.5); sy = 1 - 0.35 * k2; sxz = 1 + 0.25 * k2; }
    else if (e.state === 'lunge') { sy = 1.2; sxz = 0.88; hop = Math.sin(e.st / 0.28 * Math.PI) * 1.2; }
    else if (spd > 0.5) { const ph = e.t * (spd > 2 ? 9 : 5); hop = Math.abs(Math.sin(ph)) * 0.45; const sq = Math.sin(ph * 2) * 0.08; sy = 1 + sq; sxz = 1 - sq * 0.6; }
    else { const sq = Math.sin(e.t * 3) * 0.05; sy = 1 + sq; sxz = 1 - sq * 0.5; }
    m.body.scale.set(sxz, sy, sxz); m.body.position.y = hop;
    m.g.position.set(e.x, e.y, e.z); m.g.rotation.y = e.face;
    const f = e.flash > 0 ? 0.9 : e.state === 'windup' ? 0.25 + 0.25 * Math.sin(e.st * 40) : 0;
    m.mat.emissive.setRGB(f, f * (e.state === 'windup' ? 0.55 : 1), f * (e.state === 'windup' ? 0.2 : 1));
    e.shadow.position.set(e.x, e.y + 0.05, e.z); const ss = e.r * 2.3 * (1 - hop * 0.25); e.shadow.scale.set(ss, 1, ss);
    if (Math.random() < dt * 2) debris.emit(e.x + rand(-0.4, 0.4) * e.m.s, e.y + 0.2, e.z + rand(-0.4, 0.4) * e.m.s, 0, rand(0.2, 0.6), 0, 0.8, 0.25 * e.m.s, COL.milk, 1);
  }
}
function updateBoss(dt){
  if (!B) return;
  const m = B.m; B.st += dt; B.flash -= dt;
  const dx = P.x - B.x, dz = P.z - B.z, d = Math.hypot(dx, dz);
  const S = SITES.beach;
  let hop = 0, sy = 1, sxz = 1;
  switch (B.state) {
    case 'emerge': {
      const k = Math.min(1, B.st / 3.6); B.z = lerp(92, 66, k); B.y = lerp(-7, height(B.x, B.z) * k, smoothstep(0, 1, k)); hop = Math.abs(Math.sin(B.st * 3)) * 0.8;
      if (Math.random() < 0.6) burst(debris, B.x + rand(-3, 3), 0.3, B.z + rand(-3, 3), 2, COL.milk, 4, 0.8, 0.6, 10);
      if (k >= 1) { B.state = 'wait'; B.st = 0; }
      break;
    }
    case 'wait': if (d < 24 && P.alive) { B.state = 'fight'; B.st = 0; sfxPlay('roar'); } break;
    case 'fight': {
      if (!P.alive) break;
      const spd = B.phase === 2 ? 3.0 : 2.3;
      const nx = B.x + dx / d * spd * dt, nz = B.z + dz / d * spd * dt;
      if (Math.hypot(nx - S.x, nz - S.z) < 16 && height(nx, nz) > 0.6) { B.x = nx; B.z = nz; }
      B.face = angLerp(B.face, Math.atan2(dx, dz), 1 - Math.exp(-dt * 4));
      const ph = B.st * 4; hop = Math.abs(Math.sin(ph)) * 0.5; const sq = Math.sin(ph * 2) * 0.06; sy = 1 + sq; sxz = 1 - sq * 0.5;
      B.slamT -= dt; B.sumT -= dt;
      if (d < B.r + 0.8) hurtPlayer(2, B.x, B.z);
      if (B.slamT <= 0) { B.state = 'crouch'; B.st = 0; B.ax = B.x; B.az = B.z; B.tx = P.x; B.tz = P.z; decal.visible = true; decal.position.set(B.tx, height(B.tx, B.tz) + 0.08, B.tz); const r = B.phase === 2 ? 5.2 : 4.4; decal.scale.set(r, 1, r); B.slamR = r; }
      if (B.sumT <= 0) { B.sumT = B.phase === 2 ? 9 : 12; const alive = enemies.filter(e => e.alive && !e.site).length; if (alive < 5) { for (let i = 0; i < 2; i++) { const a = rand(0, TAU); const e = spawnEnemy('small', B.x + Math.cos(a) * 5, B.z + Math.sin(a) * 5, null); e.state = 'chase'; e.hx = S.x; e.hz = S.z; burst(debris, e.x, 1, e.z, 14, COL.milk, 5, 0.6, 0.4, 12); } sfxPlay('pop'); } }
      break;
    }
    case 'crouch': { const k = Math.min(1, B.st / 0.55); sy = 1 - 0.3 * k; sxz = 1 + 0.2 * k; decalFill.material.opacity = 0.18 + 0.15 * Math.sin(B.st * 20); if (B.st > 0.55) { B.state = 'air'; B.st = 0; } break; }
    case 'air': {
      const dur = B.phase === 2 ? 0.55 : 0.7, k = Math.min(1, B.st / dur);
      B.x = lerp(B.ax, B.tx, k); B.z = lerp(B.az, B.tz, k); hop = Math.sin(k * Math.PI) * 7; sy = 1.15; sxz = 0.9;
      decalFill.material.opacity = 0.2 + 0.2 * Math.sin(B.st * 30);
      if (k >= 1) {
        B.state = 'recover'; B.st = 0; decal.visible = false; sfxPlay('slam'); state.shake = 0.9;
        shockR = B.slamR * 1.25; shockT = 0; shock.position.set(B.x, height(B.x, B.z) + 0.3, B.z); shockMat.color.set('#FFFFFF');
        burst(debris, B.x, height(B.x, B.z) + 0.5, B.z, 60, COL.milk, 12, 0.9, 0.7, 16, 0.2);
        if (Math.hypot(P.x - B.x, P.z - B.z) < B.slamR + 0.4) hurtPlayer(3, B.x, B.z);
      }
      break;
    }
    case 'recover': { sy = 0.8 + 0.2 * Math.min(1, B.st / 0.9); sxz = 1.15 - 0.15 * Math.min(1, B.st / 0.9); if (B.st > (B.phase === 2 ? 0.75 : 1.0)) { B.state = 'fight'; B.st = 0; B.slamT = B.phase === 2 ? 2.4 : 3.4; } break; }
    case 'dying': {
      const k = Math.min(1, B.st / 1.8); sy = 1 + Math.sin(B.st * 30) * 0.15 * (1 - k); sxz = 1 - Math.sin(B.st * 30) * 0.1;
      m.g.scale.setScalar(m.s * (1 - k * 0.9));
      if (Math.random() < 0.8) burst(debris, B.x + rand(-2, 2), B.y + rand(1, 5), B.z + rand(-2, 2), 6, COL.milk, 8, 0.8, 0.6, 12);
      if (k >= 1) { scene.remove(m.g); scene.remove(B.shadow); B.alive = false; burst(sparks, B.x, B.y + 3, B.z, 140, COL.gold, 16, 1.2, 0.8, 3, 0.4); burst(debris, B.x, B.y + 3, B.z, 160, COL.milk, 14, 1.2, 0.8, 12, 0.4); sfxPlay('boom'); state.shake = 1; state.winT = 2.2; }
      break;
    }
  }
  if (B.state !== 'emerge' && B.state !== 'dying' && B.state !== 'air') B.y = height(B.x, B.z);
  m.body.scale.set(sxz, sy, sxz); m.body.position.y = hop / m.s;
  m.g.position.set(B.x, B.y, B.z); m.g.rotation.y = B.face;
  const f = B.flash > 0 ? 0.8 : B.state === 'crouch' ? 0.2 + 0.2 * Math.sin(B.st * 30) : 0;
  m.mat.emissive.setRGB(f, f * 0.7, f * 0.6);
  B.shadow.position.set(B.x, height(B.x, B.z) + 0.05, B.z); const ss = 7.5 * (1 - Math.min(0.6, hop / 12)); B.shadow.scale.set(ss, 1, ss);
}
function bossDefeated(){
  B.state = 'dying'; B.st = 0; decal.visible = false; $('bossBar').classList.add('hidden');
  enemies.forEach(e => { if (e.alive && !e.site) killEnemy(e); });
  gainXp(40, B.x, B.y + 6, B.z);
  banner('The Great Sog is defeated!', 'The kingdom is crunchy again'); sfxPlay('roar');
}
function collectRing(s){
  s.collected = true; state.rings++;
  s.fly = 0; sfxPlay('ring'); state.shake = 0.3;
  burst(sparks, s.x, s.y + 3, s.z, 80, COL.gold, 10, 1.0, 0.7, 1, 0.3);
  gainXp(6, s.x, s.y + 4, s.z);
  banner(`Golden Ring ${state.rings} of 3`, `${s.name} is crunchy again`);
  if (state.rings === 3) setTimeout(startBossStage, 2600);
}
function updateSites(dt){
  for (const s of RING_SITES) {
    s.ring.rotation.y += dt * (s.cleared ? 2.2 : 0.8); s.ring.position.y = 3 + Math.sin(clock * 2) * 0.25;
    s.glow.material.opacity = 0.6 + 0.25 * Math.sin(clock * 3);
    if (s.cleared && s.barrier.visible) { s.barrier.material.opacity -= dt * 0.4; s.barrier.scale.multiplyScalar(1 + dt * 0.6); if (s.barrier.material.opacity <= 0) s.barrier.visible = false; }
    else if (!s.cleared) s.barrier.material.opacity = 0.24 + 0.06 * Math.sin(clock * 2.5);
    if (s.collected && s.fly != null && s.fly < 1) {
      s.fly += dt * 0.9; const k = Math.min(1, s.fly);
      s.ring.position.y = 3 + k * 9; s.ring.scale.setScalar(1 - k * 0.7); s.glow.scale.setScalar(7 * (1 - k));
      if (Math.random() < 0.5) sparks.emit(s.x, s.y + s.ring.position.y, s.z, rand(-1, 1), rand(-1, 1), rand(-1, 1), 0.6, 0.5, COL.gold, 0);
      if (k >= 1) { s.ring.visible = false; s.glow.visible = false; }
    }
    if (!s.collected && Math.random() < dt * 6) sparks.emit(s.x + rand(-1.3, 1.3), s.y + 3 + rand(-1.3, 1.3), s.z + rand(-0.3, 0.3), 0, rand(0.3, 1), 0, 0.9, 0.3, COL.gold, 0);
  }
}
function startBossStage(){
  state.stage = 'boss'; sky.duskTarget = 1; camYawT = Math.PI;
  playTrack('boss'); sfxPlay('roar');
  banner('The Great Sog rises!', 'Head to Milk Beach');
  spawnBoss();
  cam.mode = 'cut'; cam.cutT = 4.2; cam.cutPos.set(B.x - 14, 17, 44); cam.cutLook.set(B.x, 2, 74);
}
const pm4 = new THREE.Matrix4(), pq = new THREE.Quaternion(), ps = new THREE.Vector3(), pp = new THREE.Vector3(), pe = new THREE.Euler();
function updatePickups(dt){
  const m4 = pm4, q = pq, s = ps, p = pp, e = pe;
  coins.forEach((c, i) => { if (c.alive) { e.set(Math.PI / 2 * 0.15, clock * 2.5 + i, 0); q.setFromEuler(e); p.set(c.x, c.y + Math.sin(clock * 3 + i) * 0.15, c.z); s.setScalar(1); } else { s.setScalar(0); p.set(c.x, -50, c.z); } m4.compose(p, q, s); coinMesh.setMatrixAt(i, m4); });
  coinMesh.instanceMatrix.needsUpdate = true;
  for (const b of berries) { b.t += dt; b.g.position.y = height(b.x, b.z) + 0.6 + Math.sin(b.t * 3) * 0.15; b.g.rotation.y += dt * 1.5; }
}
function updateNpcs(dt){
  for (const n of NPCS) {
    const d = Math.hypot(P.x - n.x, P.z - n.z);
    if (d < 7) n.face = angLerp(n.face, Math.atan2(P.x - n.x, P.z - n.z), 1 - Math.exp(-dt * 4));
    n.m.g.rotation.y = n.face; n.m.rig.position.y = Math.abs(Math.sin(clock * 2 + n.x)) * 0.06; n.m.head.rotation.z = Math.sin(clock * 1.3 + n.z) * 0.08;
  }
}

/* ================= camera ================= */
let camYaw = 0, camYawT = 0;
const cam = { mode: 'intro', look: new THREE.Vector3(0, 4, 0), cutPos: new THREE.Vector3(), cutLook: new THREE.Vector3(), cutT: 0 };
const desired = new THREE.Vector3(), lookT = new THREE.Vector3();
function updateCamera(dt){
  camYaw = angLerp(camYaw, camYawT, 1 - Math.exp(-dt * 1.6));
  camFwd.set(-Math.sin(camYaw), 0, -Math.cos(camYaw)); camRight.set(Math.cos(camYaw), 0, -Math.sin(camYaw));
  const portrait = innerHeight > innerWidth;
  const zoom = (state.stage === 'boss' ? 1.28 : 1) * (portrait ? 1.22 : 1);
  let rate = 6;
  if (cam.mode === 'intro') { const a = clock * 0.07 + 0.6; desired.set(Math.sin(a) * 118, 50, Math.cos(a) * 118); lookT.set(0, 2, 0); rate = 2; }
  else if (cam.mode === 'cut') { desired.copy(cam.cutPos); lookT.copy(cam.cutLook); rate = 2.2; cam.cutT -= dt; if (cam.cutT <= 0) cam.mode = 'follow'; }
  else {
    lookT.set(P.x, P.y + 1.3, P.z);
    desired.set(P.x + Math.sin(camYaw) * 12.5 * zoom, P.y + 10.5 * zoom, P.z + Math.cos(camYaw) * 12.5 * zoom);
    rate = cam.mode === 'swoop' ? 2.6 : 7; if (cam.mode === 'swoop' && camera.position.distanceTo(desired) < 1.5) cam.mode = 'follow';
  }
  const k = 1 - Math.exp(-dt * rate);
  camera.position.lerp(desired, k); cam.look.lerp(lookT, k);
  const gh = height(camera.position.x, camera.position.z) + 2; if (camera.position.y < gh) camera.position.y = gh;
  if (state.shake > 0 && !reduced) { const s = state.shake * 0.5; camera.position.x += rand(-s, s); camera.position.y += rand(-s, s); state.shake = Math.max(0, state.shake - dt * 2.2); } else state.shake = 0;
  camera.lookAt(cam.look);
  skyMesh.position.copy(camera.position);
  const fn = cam.mode === 'intro' ? 150 : 90, ff = cam.mode === 'intro' ? 460 : fogFar;
  scene.fog.near += (fn - scene.fog.near) * k; scene.fog.far += (ff - scene.fog.far) * k; seaUniforms.uFogNear.value = scene.fog.near; seaUniforms.uFogFar.value = scene.fog.far;
  // keep the shadow camera around the player
  sunLight.target.position.set(P.x, P.y, P.z); sunLight.position.set(P.x + SUN_DIR.x * 80, P.y + SUN_DIR.y * 80, P.z + SUN_DIR.z * 80);
}
function updateSky(dt){
  if (sky.dusk !== sky.duskTarget) {
    sky.dusk += Math.sign(sky.duskTarget - sky.dusk) * dt / 5; sky.dusk = clamp(sky.dusk, 0, 1);
    const k = sky.dusk;
    sky.top.lerpColors(DAY.top, DUSK.top, k); sky.hor.lerpColors(DAY.hor, DUSK.hor, k); sky.sun.lerpColors(DAY.sun, DUSK.sun, k);
    sunLight.color.lerpColors(DAY.light, DUSK.light, k); hemi.color.lerpColors(DAY.hemi, DUSK.hemi, k);
    scene.fog.color.copy(sky.hor); sunLight.intensity = lerp(2.3, 1.7, k);
  }
}

/* ================= screens and flow ================= */
function setSeg(id, v){ $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); }
function syncSettings(){ setSeg('segSound', soundOn() ? 'on' : 'off'); setSeg('segSound2', soundOn() ? 'on' : 'off'); }
for (const id of ['segSound', 'segSound2']) $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setSound(b.dataset.v === 'on'); store.set('sound', b.dataset.v === 'on'); syncSettings(); });
for (const id of ['segQ', 'segQ2']) $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; applyQuality(b.dataset.v); });
$('howto').innerHTML = isTouch
  ? '<div><b>Move</b>Left thumb, anywhere</div><div><b>Attack</b>Tap or hold the red button</div><div><b>Dash</b>Blue button, dodges hits</div><div><b>Burst</b>Fills as you hit; tap when it glows</div>'
  : '<div><b>Move</b>WASD or arrow keys</div><div><b>Attack</b>J, Space or click</div><div><b>Dash</b>K or Shift</div><div><b>Burst · Talk</b>L when it glows · E</div>';
const best = store.get('best', null); if (best) $('bestLine').textContent = `Your best time: ${fmtTime(best)}`;
function startGame(){
  if (state.mode !== 'title') return;
  initAudio(); playTrack('adventure'); sfxPlay('ui');
  $('title').classList.add('hidden'); $('hud').classList.remove('hidden');
  if (isTouch) $('touch').classList.remove('hidden'); else $('keys').classList.remove('hidden');
  state.mode = 'play'; state.timerOn = true; cam.mode = 'swoop';
  setTimeout(() => { if (state.stage === 'talk') toast(isTouch ? 'Walk up to Mayor Oatley and tap Talk' : 'Walk up to Mayor Oatley and press E'); }, 1200);
}
$('playBtn').addEventListener('click', startGame);
function pause(on){
  if (on && state.mode !== 'play' && state.mode !== 'dialog') return;
  if (on) { state.prevMode = state.mode; state.mode = 'paused'; $('pause').classList.remove('hidden'); suspendAudio(true); syncSettings(); applyQuality(quality); }
  else if (state.mode === 'paused') { state.mode = state.prevMode || 'play'; $('pause').classList.add('hidden'); suspendAudio(false); }
}
$('pauseBtn').addEventListener('click', () => pause(true));
$('resumeBtn').addEventListener('click', () => pause(false));
$('restartBtn').addEventListener('click', () => location.reload());
$('againBtn').addEventListener('click', () => location.reload());
$('roamBtn').addEventListener('click', () => { $('win').classList.add('hidden'); state.mode = 'play'; playTrack('calm'); fireworksT = -1; if (isTouch) $('touch').classList.remove('hidden'); });
document.addEventListener('visibilitychange', () => { if (document.hidden && (state.mode === 'play' || state.mode === 'dialog')) pause(true); });
function showWin(){
  state.mode = 'victory'; state.timerOn = false; sky.duskTarget = 0; camYawT = 0; playTrack('calm'); sfxPlay('win');
  $('wTime').textContent = fmtTime(state.time); $('wLevel').textContent = P.level; $('wKills').textContent = state.kills; $('wCoins').textContent = `${state.coins} / ${coins.length}`;
  const prev = store.get('best', null); const isBest = !prev || state.time < prev; if (isBest) store.set('best', Math.floor(state.time));
  $('wBest').textContent = isBest ? 'A new best time on this device!' : `Your best: ${fmtTime(prev)}`;
  $('win').classList.remove('hidden'); $('touch').classList.add('hidden');
  fireworksT = 0;
}
let fireworksT = -1;
function updateFireworks(dt){
  if (fireworksT < 0) return; fireworksT -= dt;
  if (fireworksT <= 0) {
    fireworksT = rand(0.25, 0.6);
    const x = P.x + rand(-18, 18), z = P.z - rand(8, 26), y = P.y + rand(12, 22);
    const c = [COL.gold, COL.red, COL.blue, COL.pink, COL.milk][Math.floor(rand(0, 5))];
    for (let i = 0; i < 60; i++) { const a = rand(0, TAU), b = rand(-1, 1), s = rand(5, 9), r = Math.sqrt(1 - b * b); sparks.emit(x, y, z, Math.cos(a) * r * s, b * s, Math.sin(a) * r * s, rand(0.9, 1.5), rand(0.5, 0.8), c, 3); }
    sfxPlay('boom');
  }
}

/* ================= main loop ================= */
let last = performance.now(), fpsAcc = 0, fpsN = 0, fpsLowT = 0;
function frame(now){
  requestAnimationFrame(frame);
  let dt = Math.min(0.05, (now - last) / 1000); last = now;
  pollGamepad();
  const inp = readInput();
  if (state.mode === 'title' && (inp.enter || inp.attack)) startGame();
  if (inp.pause) { if (state.mode === 'paused') pause(false); else pause(true); }
  if (state.mode === 'paused') { renderer.render(scene, camera); return; }
  // frame-rate watchdog (only steps down)
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 2) { const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; if (DEBUG) { $('fps').classList.remove('hidden'); $('fps').textContent = fps.toFixed(0) + ' fps · ' + quality; }
    if (state.mode === 'play' && fps < 32 && quality !== 'low') { fpsLowT++; if (fpsLowT >= 2) { applyQuality(quality === 'high' ? 'medium' : 'low'); toast('Graphics set to Fast for smoother play'); fpsLowT = 0; } } else fpsLowT = 0; }
  const simDt = state.hitstop > 0 ? 0 : dt; if (state.hitstop > 0) state.hitstop -= dt;
  clock += dt; swayTime.value = clock; seaUniforms.uTime.value = clock; beaconMat.uniforms.uTime.value = clock;
  updateClouds(dt); updateSky(dt);
  if (boat) { boat.position.y = 0.1 + Math.sin(clock * 1.2) * 0.2; boat.rotation.z = Math.sin(clock * 0.9) * 0.06; }
  flags.forEach((f, i) => { f.rotation.y = Math.sin(clock * 3 + i) * 0.3; });
  if (Math.random() < 0.9) debris.emit(fountainTip.x + rand(-0.2, 0.2), fountainTip.y, fountainTip.z + rand(-0.2, 0.2), rand(-0.4, 0.4), rand(-0.5, 0.5), rand(-0.4, 0.4), 1.0, 0.35, COL.milk, 9);
  if (state.mode === 'play' && cam.mode === 'cut') { updateBoss(dt); updateSites(dt); updatePickups(dt); updateEnemies(dt); P.moving = 0; }
  else if (state.mode === 'play') {
    updatePlayer(simDt, inp); updateEnemies(simDt); updateBoss(simDt); updateSites(simDt); updatePickups(simDt);
    if (state.timerOn) state.time += dt;
  } else if (state.mode === 'dialog') { updateDialog(dt, inp); updateSites(dt); updatePickups(dt); updateBoss(dt); }
  else if (state.mode === 'down') {
    state.downT -= dt; updateEnemies(dt); updateBoss(dt);
    if (state.downT <= 0) { P.alive = true; P.hp = P.maxHp; P.x = 0; P.z = 25; P.vx = P.vz = P.kx = P.kz = 0; P.inv = 2; state.mode = 'play'; cam.mode = 'swoop'; if (B && B.alive) { B.state = 'wait'; decal.visible = false; } }
    if (state.timerOn) state.time += dt;
  } else { updateSites(dt); updatePickups(dt); if (state.mode === 'victory' || state.mode === 'title') { updateEnemies(dt); } }
  if (state.winT > 0) { state.winT -= dt; if (state.winT <= 0) { state.stage = 'won'; showWin(); } }
  animateHero(simDt); updateNpcs(dt); updateFireworks(dt);
  if (shockT < 0.5) { shockT += dt; const k = shockT / 0.5; shock.scale.setScalar(0.5 + k * shockR); shockMat.opacity = (1 - k) * 0.9; } else shockMat.opacity = 0;
  sparks.update(dt); debris.update(dt);
  updateCamera(dt);
  updateHud(); updateOverlays(dt);
  renderer.render(scene, camera);
}
function resize(){
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.fov = innerHeight > innerWidth ? 64 : 50; camera.updateProjectionMatrix();
  const sc = innerHeight * renderer.getPixelRatio() * 0.5; sparks.mat.uniforms.uScale.value = sc; debris.mat.uniforms.uScale.value = sc;
}
addEventListener('resize', resize);
applyQuality(quality, true); resize(); syncSettings();
buildVillage(); buildMeadow(); buildMountain(); buildCaves(); buildForest(); buildBeach(); buildDecor(); buildClouds();
requestAnimationFrame(t => { last = t; requestAnimationFrame(frame); });

if (DEBUG) {
  window.K = {
    P, state, enemies, RING_SITES,
    tp(x, z){ P.x = x; P.z = z; },
    start(){ startGame(); },
    rings(n){ state.stage = 'rings'; RING_SITES.slice(0, n).forEach(s => { s.enemies.forEach(e => e.alive && killEnemy(e)); s.cleared = true; collectRing(s); }); },
    boss(){ state.stage = 'rings'; RING_SITES.forEach(s => { s.cleared = true; s.collected = true; }); state.rings = 3; startBossStage(); },
    hurtBoss(n){ if (B) { B.hp -= n; updateBossBar(); if (B.hp <= 0) bossDefeated(); } },
    showWin(){ showWin(); },
    snap(){ updateCamera(0.05); camera.position.copy(desired); cam.look.copy(lookT); camera.lookAt(cam.look); },
    cam: cam, burst: doBurst, setQ: applyQuality, B: () => B
  };
}

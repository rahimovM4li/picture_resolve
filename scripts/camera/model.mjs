// Editable geometry for the studio's rangefinder and shoe-mounted flash.
import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const metal = (color, roughness = 0.32, metalness = 0.85) =>
  new T.MeshStandardMaterial({ color, roughness, metalness });
const titanium = metal(0x8b8b84, 0.28);
const edge = metal(0xd8d2c7, 0.2);
const graphite = metal(0x242629, 0.28);
const blackChrome = metal(0x45484c, 0.18, 0.94);
const rubber = metal(0x191b1a, 0.77, 0.08);
const glass = metal(0x152d38, 0.09, 0.64);
const red = metal(0x8e2525, 0.32, 0.45);
const model = new T.Group();
const lensX = 0.54;
const lensY = -0.16;

function part(geometry, material, x, y, z) {
  const mesh = new T.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  model.add(mesh);
  return mesh;
}
function box(x, y, z, width, height, depth, radius, material) {
  return part(
    new RoundedBoxGeometry(width, height, depth, 3, radius),
    material,
    x,
    y,
    z,
  );
}
function dial(x, y, z, radius, depth, material, vertical = false) {
  const mesh = part(
    new T.CylinderGeometry(radius, radius, depth, 72),
    material,
    x,
    y,
    z,
  );
  if (!vertical) mesh.rotation.x = Math.PI / 2;
  return mesh;
}
function lensRing(z, radius, gauge, material) {
  return part(
    new T.TorusGeometry(radius, gauge, 8, 96),
    material,
    lensX,
    lensY,
    z,
  );
}
function canvasMap(width, height, paint) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext("2d"), width, height);
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  return map;
}
function marking(x, y, z, width, height, paint) {
  const map = canvasMap(512, 128, paint);
  return part(
    new T.PlaneGeometry(width, height),
    new T.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
    x,
    y,
    z,
  );
}

const grain = canvasMap(256, 256, (ctx, w, h) => {
  const pixels = ctx.createImageData(w, h);
  let seed = 23;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const cells = 28;
  const pores = Array.from({ length: cells * cells }, () => [
    random(),
    random(),
  ]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = (x / w) * cells;
      const v = (y / h) * cells;
      let closest = Infinity,
        second = Infinity;
      for (let j = Math.floor(v) - 1; j <= Math.floor(v) + 1; j++) {
        for (let i = Math.floor(u) - 1; i <= Math.floor(u) + 1; i++) {
          const [dx, dy] =
            pores[((j + cells) % cells) * cells + ((i + cells) % cells)];
          const d = (i + dx - u) ** 2 + (j + dy - v) ** 2;
          if (d < closest) {
            second = closest;
            closest = d;
          } else if (d < second) second = d;
        }
      }
      const ridge = Math.min(1, (second - closest) * 4);
      const value = 177 + ridge * 40 + random() * 11;
      pixels.data.set([value, value, value, 255], (y * w + x) * 4);
    }
  }
  ctx.putImageData(pixels, 0, 0);
});
grain.wrapS = grain.wrapT = T.RepeatWrapping;
grain.repeat.set(3, 1.5);
const leather = metal(0x482b29, 0.61, 0.06);
leather.map = leather.bumpMap = grain;
leather.bumpScale = 0.008;

// Black nickel cap, oxblood leather wrap and a machined sill on the base.
box(0, 0, 0, 3.24, 1.78, 0.88, 0.17, graphite);
box(0, -0.12, 0.015, 3.25, 1.34, 0.9, 0.14, leather);
box(0, -0.81, 0, 3.22, 0.15, 0.88, 0.066, blackChrome);
box(0, -0.757, 0, 3.23, 0.023, 0.89, 0.011, titanium);
box(0, 0.388, 0, 3.25, 0.052, 0.915, 0.023, titanium);
box(0, 0.655, 0, 3.26, 0.55, 0.92, 0.084, graphite);
const gripProfile = new T.Shape();
gripProfile.moveTo(-1.57, -0.38);
gripProfile.bezierCurveTo(-1.64, -0.59, -1.49, -0.65, -1.32, -0.63);
gripProfile.bezierCurveTo(-1.17, -0.61, -1.08, -0.47, -0.94, -0.455);
gripProfile.lineTo(-0.94, -0.37);
gripProfile.closePath();
const grip = new T.ExtrudeGeometry(gripProfile, {
  depth: 0.94,
  bevelSegments: 5,
  bevelSize: 0.034,
  bevelThickness: 0.08,
  curveSegments: 24,
});
grip.rotateX(-Math.PI / 2);
part(grip, leather, 0, -0.63, 0);
// A metal channel holds the finder. The inner glass sits behind a polished rim.
box(1.1, 0.662, 0.459, 0.58, 0.35, 0.08, 0.065, blackChrome);
box(1.1, 0.662, 0.501, 0.47, 0.246, 0.029, 0.041, titanium);
box(1.1, 0.662, 0.518, 0.418, 0.198, 0.015, 0.031, glass);
marking(1.1, 0.662, 0.528, 0.368, 0.16, (ctx, w, h) => {
  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0, "#7d969ba8");
  sheen.addColorStop(0.31, "#304b5106");
  sheen.addColorStop(0.68, "#18293400");
  sheen.addColorStop(1, "#71829c69");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
});
box(0.62, 0.65, 0.465, 0.21, 0.17, 0.035, 0.02, rubber);
box(0.62, 0.65, 0.488, 0.155, 0.12, 0.012, 0.012, glass);
async function mountSignature() {
  const signature = new Image();
  signature.src = "/signatur-weiss.webp";
  await signature.decode();
  // A small ink spread keeps the original fine strokes legible on the phone-sized casting.
  const ink = canvasMap(signature.width + 8, signature.height + 8, (ctx) => {
    for (const [x, y] of [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
      [0, 0],
    ])
      ctx.drawImage(signature, 4 + x, 4 + y);
  });
  ink.anisotropy = 8;
  const width = 1.39;
  const print = new T.MeshBasicMaterial({
    map: ink,
    color: 0xf3eee4,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  part(
    new T.PlaneGeometry(width, (width * ink.image.height) / ink.image.width),
    print,
    -0.7,
    0.658,
    0.464,
  );
}
// Two recessed strap anchors and a metal rewind lever give the silhouette depth.
for (const side of [-1, 1]) {
  box(side * 1.595, 0.27, 0, 0.15, 0.13, 0.26, 0.047, blackChrome);
  const lug = part(
    new T.TorusGeometry(0.092, 0.022, 10, 40),
    titanium,
    side * 1.665,
    0.22,
    0,
  );
  lug.rotation.y = side * 0.64;
}
for (const x of [-1.4, 1.39]) {
  dial(x, -0.69, 0.438, 0.037, 0.025, titanium);
  box(x, -0.69, 0.456, 0.044, 0.007, 0.005, 0, graphite).rotation.z = 0.6;
}
// Knurled shutter dial and release, projecting above the top plate.
dial(0.92, 0.96, 0.01, 0.28, 0.17, graphite, true);
for (let i = 0; i < 36; i++) {
  const a = (i * Math.PI) / 18;
  box(
    0.92 + 0.28 * Math.cos(a),
    0.96,
    0.01 + 0.28 * Math.sin(a),
    0.012,
    0.11,
    0.015,
    0.003,
    titanium,
  ).rotation.y = -a;
}
dial(0.92, 1.049, 0.01, 0.24, 0.018, graphite, true);
for (let i = 0; i < 12; i++) {
  const a = (i * Math.PI) / 6;
  const tick = box(
    0.92 + 0.186 * Math.sin(a),
    1.061,
    0.01 + 0.186 * Math.cos(a),
    0.012,
    0.007,
    0.045,
    0.002,
    i === 0 ? red : edge,
  );
  tick.rotation.y = a;
}
dial(-1.24, 0.92, 0.11, 0.17, 0.07, graphite, true);
dial(-1.24, 0.974, 0.11, 0.13, 0.05, edge, true);
dial(-1.24, 1.011, 0.11, 0.1, 0.032, red, true);

// Interlocking lens barrels, a milled focus ring and enamel distance indices.
for (const [z, r, d, material] of [
  [0.48, 0.737, 0.12, blackChrome],
  [0.57, 0.69, 0.15, graphite],
  [0.7, 0.645, 0.19, graphite],
  [0.91, 0.666, 0.27, rubber],
  [1.11, 0.639, 0.16, graphite],
  [1.22, 0.651, 0.12, graphite],
])
  dial(lensX, lensY, z, r, d, material);
for (let i = 0; i < 84; i++) {
  const a = (i / 84) * Math.PI * 2;
  const ridge = box(
    lensX + 0.665 * Math.cos(a),
    lensY + 0.665 * Math.sin(a),
    0.91,
    0.014,
    0.023,
    0.21,
    0.004,
    graphite,
  );
  ridge.rotation.z = a;
}
for (const z of [0.62, 1.06, 1.17]) lensRing(z, 0.642, 0.009, titanium);
lensRing(0.677, 0.645, 0.011, red);
lensRing(1.286, 0.621, 0.012, blackChrome);
for (const r of [0.57, 0.53, 0.49]) lensRing(1.288, r, 0.012, rubber);
dial(lensX, lensY, 1.289, 0.467, 0.016, glass);
const optic = canvasMap(512, 512, (ctx) => {
  const gradient = ctx.createRadialGradient(197, 184, 24, 258, 250, 250);
  for (const [p, c] of [
    [0, "#0a1017"],
    [0.27, "#15212d"],
    [0.54, "#284149"],
    [0.69, "#384850"],
    [0.77, "#212431"],
    [0.83, "#514453"],
    [0.91, "#171e2b"],
    [0.97, "#3b5b5a"],
    [1, "#0b151c"],
  ])
    gradient.addColorStop(p, c);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 7; i++) {
    const a = (i * Math.PI * 2) / 7;
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(a);
    ctx.fillStyle = i % 2 ? "#1425318c" : "#263b4660";
    ctx.strokeStyle = "#677e8739";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(64, -24);
    ctx.quadraticCurveTo(135, -28, 171, -104);
    ctx.quadraticCurveTo(176, -9, 135, 49);
    ctx.lineTo(60, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = "#090e13";
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const a = (i * 2 * Math.PI) / 7 - 0.38;
    ctx.lineTo(256 + 66 * Math.cos(a), 256 + 66 * Math.sin(a));
  }
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.translate(155, 129);
  ctx.rotate(-0.56);
  const sheen = ctx.createLinearGradient(0, -20, 0, 18);
  sheen.addColorStop(0, "#c4e9f3cc");
  sheen.addColorStop(0.42, "#a8d4e768");
  sheen.addColorStop(1, "#84aaa300");
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.ellipse(0, 0, 79, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#d9afd55c";
  ctx.beginPath();
  ctx.ellipse(336, 353, 38, 13, -0.6, 0, Math.PI * 2);
  ctx.fill();
});
part(
  new T.CircleGeometry(0.45, 96),
  new T.MeshBasicMaterial({ map: optic }),
  lensX,
  lensY,
  1.303,
);
const dome = new T.SphereGeometry(
  0.449,
  72,
  36,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2,
);
dome.rotateX(Math.PI / 2);
part(
  dome,
  new T.MeshPhysicalMaterial({
    color: 0x28323d,
    metalness: 0.36,
    roughness: 0.13,
    clearcoat: 1,
    clearcoatRoughness: 0.09,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
  }),
  lensX,
  lensY,
  1.305,
).scale.z = 0.14;

const bezelPrint = canvasMap(768, 768, (ctx, w, h) => {
  ctx.translate(w / 2, h / 2);
  ctx.fillStyle = "#d2d0c6";
  ctx.font = "500 29px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const label = "35 mm   •   ASPH.   1:2";
  const spacing = 0.061;
  for (let i = 0; i < label.length; i++) {
    ctx.save();
    ctx.rotate((i - (label.length - 1) / 2) * spacing);
    ctx.fillText(label[i], 0, -334);
    ctx.restore();
  }
  for (let i = -3; i <= 3; i++) {
    ctx.save();
    ctx.rotate(i * 0.14);
    ctx.fillRect(-1.8, 327, 3.6, i === 0 ? 15 : 7);
    ctx.restore();
  }
});
part(
  new T.PlaneGeometry(1.3, 1.3),
  new T.MeshBasicMaterial({
    map: bezelPrint,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  }),
  lensX,
  lensY,
  1.309,
);

// The flash has its own metal foot, tilt joint, reflector and ribbed diffuser.
box(-0.64, 0.925, 0, 0.5, 0.1, 0.39, 0.026, edge);
box(-0.64, 1.045, 0, 0.32, 0.22, 0.32, 0.045, graphite);
box(-0.64, 1.33, 0, 0.97, 0.5, 0.57, 0.086, graphite);
box(-0.64, 1.34, 0.269, 0.83, 0.37, 0.061, 0.048, blackChrome);
const diffuser = metal(0xc7caca, 0.27, 0.39);
box(-0.64, 1.34, 0.303, 0.74, 0.28, 0.037, 0.027, diffuser);
const fresnel = metal(0xb8bfbc, 0.24, 0.31);
for (let i = -8; i <= 8; i++)
  box(-0.64 + i * 0.041, 1.34, 0.326, 0.012, 0.235, 0.009, 0.004, fresnel);

export async function cameraTurn() {
  await mountSignature();
  const renderer = new T.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(1125, 800);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  for (const mesh of model.children) {
    mesh.castShadow = mesh.receiveShadow = !mesh.material.transparent;
  }
  const scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.78;
  const key = new T.DirectionalLight(0xffead5, 2.8);
  key.position.set(-3, 5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, {
    left: -2.65,
    right: 2.65,
    top: 2.65,
    bottom: -2.65,
    near: 0.1,
    far: 14,
  });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = 0.009;
  key.shadow.bias = -0.00025;
  const rim = new T.DirectionalLight(0xd5e7ff, 2.8);
  rim.position.set(4, 3, -2);
  scene.add(model, key, rim);
  const cam = new T.OrthographicCamera(-2.11, 2.11, 1.5, -1.5, 0.1, 50);
  cam.position.set(0, 2.28, 9);
  cam.lookAt(0, 0.33, 0.14);
  const frames = [];
  for (let i = 0; i < 12; i++) {
    const ease = 1 - (1 - i / 11) ** 2;
    model.rotation.y = -0.85 + ease * 0.53;
    model.rotation.z = -0.065 + ease * 0.098;
    renderer.render(scene, cam);
    frames.push(renderer.domElement.toDataURL("image/png").split(",")[1]);
  }
  const lamp = model
    .localToWorld(new T.Vector3(-0.64, 1.34, 0.335))
    .project(cam);
  return { frames, emitter: [(lamp.x + 1) / 2, (1 - lamp.y) / 2] };
}

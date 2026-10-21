import * as THREE from "./three.module.js";
const canvas = document.querySelector("#lane-canvas");
const button = document.querySelector("#roll-ball");
const status = document.querySelector("#roll-status");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let paused =
  document.body.classList.contains("pause-motion") || reduced.matches;
try {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 110);
  camera.position.set(9, 11, 18);
  camera.lookAt(0, 0, -3);
  scene.add(new THREE.HemisphereLight(0xbfa5ff, 0x0e071b, 2));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(3, 10, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -10;
  key.shadow.camera.right = 10;
  key.shadow.camera.top = 10;
  key.shadow.camera.bottom = -15;
  scene.add(key);
  const pink = new THREE.PointLight(0xff3ba8, 65, 25, 1.5);
  pink.position.set(-4, 3, 1);
  scene.add(pink);
  const blue = new THREE.PointLight(0x7046ff, 85, 30, 1.5);
  blue.position.set(4, 5, -7);
  scene.add(blue);
  const group = new THREE.Group();
  scene.add(group);
  function box(w, h, d, color, x, y, z, emissive) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.38,
        metalness: 0.25,
        emissive: emissive || 0,
        emissiveIntensity: 1.8,
      }),
    );
    m.position.set(x, y, z);
    m.receiveShadow = true;
    group.add(m);
    return m;
  }
  // Deterministic lane boards keep the scene entirely self-contained.
  for (let i = 0; i < 22; i++) {
    const c = new THREE.Color().setHSL(0.1, 0.29, 0.21 + (i % 4) * 0.025);
    box(0.235, 0.16, 29, c, (i - 10.5) * 0.24, -1.1, -3);
  }
  for (const side of [-1, 1]) {
    box(0.3, 0.2, 29, 0x160f25, side * 2.85, -1.15, -3);
    box(
      0.055,
      0.07,
      29,
      side === 1 ? 0xa770ff : 0xff4ab3,
      side * 3.05,
      -0.95,
      -3,
      side === 1 ? 0x693aff : 0xd71c83,
    );
    box(0.1, 0.5, 29, 0x241333, side * 3.25, -1.1, -3);
  }
  // Neon gates frame the pins and give the lane a visible vanishing point.
  for (let i = 0; i < 5; i++) {
    const z = -9 - i * 3;
    for (const side of [-1, 1])
      box(0.07, 6, 0.08, 0x7d41ff, side * 3.4, 1.9, z, 0x6433cc);
    box(6.9, 0.07, 0.08, 0xb078ff, 0, 4.9, z, 0x8146fa);
  }
  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(0, 0.18);
  arrowShape.lineTo(-0.09, -0.1);
  arrowShape.lineTo(0.09, -0.1);
  arrowShape.closePath();
  for (let i = -3; i <= 3; i++) {
    const arrow = new THREE.Mesh(
      new THREE.ShapeGeometry(arrowShape),
      new THREE.MeshBasicMaterial({ color: 0xc6acdf, side: THREE.DoubleSide }),
    );
    arrow.rotation.x = -Math.PI / 2;
    arrow.position.set(i * 0.6, -1.008, -0.4 - Math.abs(i) * 0.3);
    group.add(arrow);
  }
  const points = [
    [0.23, 0],
    [0.32, 0.06],
    [0.4, 0.22],
    [0.43, 0.48],
    [0.38, 0.75],
    [0.27, 1.02],
    [0.15, 1.29],
    [0.135, 1.49],
    [0.17, 1.67],
    [0.23, 1.82],
    [0.24, 1.97],
    [0.19, 2.1],
    [0.08, 2.18],
    [0, 2.19],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const pinGeo = new THREE.LatheGeometry(points, 32);
  const pinMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff6e9,
    metalness: 0.12,
    roughness: 0.19,
    clearcoat: 1,
  });
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xff327a,
    roughness: 0.3,
    emissive: 0x520f24,
    emissiveIntensity: 0.35,
  });
  const pins = [];
  for (let row = 0; row < 4; row++)
    for (let col = 0; col <= row; col++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(pinGeo, pinMat);
      body.castShadow = true;
      g.add(body);
      for (const y of [1.39, 1.53]) {
        const stripe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.145, 0.15, 0.075, 32),
          redMat,
        );
        stripe.position.y = y;
        g.add(stripe);
      }
      g.position.set((col - row / 2) * 1.02, -1.01, -5.3 - row * 0.92);
      group.add(g);
      pins.push({ g, x: g.position.x, z: g.position.z });
    }
  const ballGroup = new THREE.Group();
  group.add(ballGroup);
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.98, 48, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x7839e4,
      metalness: 0.4,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  );
  ball.castShadow = true;
  ballGroup.add(ball);
  // Recessed dark finger sockets, aligned toward the camera.
  for (const [x, y, z, r] of [
    [-0.16, 0.71, 0.66, 0.105],
    [0.15, 0.71, 0.66, 0.105],
    [0.05, 0.45, 0.86, 0.14],
  ]) {
    const hole = new THREE.Mesh(
      new THREE.CircleGeometry(r, 32),
      new THREE.MeshStandardMaterial({ color: 0x080415, roughness: 1 }),
    );
    hole.position.set(x, y, z).normalize().multiplyScalar(0.984);
    hole.lookAt(x * 3, y * 3, z * 3);
    ballGroup.add(hole);
  }
  ballGroup.position.set(0.4, -0.02, 5.4);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.014, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xdbff60 }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0.4, -0.99, 5.4);
  group.add(ring);
  const target = { x: 0, y: 0 };
  let shotStart = 0;
  let clock = 0;
  let previous = 0;
  let visible = true;
  let raf = 0;
  canvas.parentElement.classList.add("scene-ready");
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    render();
  }
  function render() {
    renderer.render(scene, camera);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  const viewObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    },
    { rootMargin: "80px" },
  );
  viewObserver.observe(canvas);
  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.08;
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.03;
  });
  canvas.parentElement.addEventListener("pointerleave", () => {
    target.x = 0;
    target.y = 0;
  });
  function reset() {
    pins.forEach(({ g, x, z }) => {
      g.position.set(x, -1.01, z);
      g.rotation.set(0, 0, 0);
    });
    ballGroup.position.set(0.4, -0.02, 5.4);
    ballGroup.rotation.set(0, 0, 0);
    shotStart = 0;
    button.disabled = false;
    status.textContent = "Go on. Roll one.";
    ring.visible = true;
    render();
  }
  button.addEventListener("click", () => {
    if (shotStart) return;
    button.disabled = true;
    status.textContent = "Rolling…";
    ring.visible = false;
    if (paused || reduced.matches) {
      pins.forEach(({ g }, i) => {
        g.rotation.z = (i % 2 ? 1 : -1) * 1.2;
        g.position.y = -0.65;
      });
      status.textContent = "STRIKE! All ten. Nicely done.";
      render();
      setTimeout(reset, 2600);
      return;
    }
    shotStart = performance.now();
    start();
  });
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - previous) / 1000, 0.05) || 0;
    previous = now;
    if (!paused) {
      clock += dt;
      group.rotation.y += (target.x - group.rotation.y) * 0.035;
      ballGroup.rotation.y = shotStart ? 0 : Math.sin(clock * 0.4) * 0.08;
    }
    if (shotStart) {
      const t = (now - shotStart) / 1000;
      const progress = Math.min(t / 1.5, 1);
      ballGroup.position.z = 5.4 - progress * 15;
      ballGroup.rotation.x = -progress * 15;
      ballGroup.position.x = 0.4 * (1 - progress);
      pins.forEach(({ g, x, z }, i) => {
        const f = Math.max(0, Math.min((t - 1.05 - i * 0.025) * 2.8, 1));
        g.rotation.z = (i % 2 ? 1 : -1) * f * 1.5;
        g.rotation.x = -f * 0.9;
        g.position.x = x + (i % 2 ? 1 : -1) * f * 0.32;
        g.position.z = z - f * 0.6;
        g.position.y = -1.01 + f * 0.2;
      });
      if (t > 1.6) status.textContent = "STRIKE! All ten. Nicely done.";
      if (t > 4) reset();
    }
    render();
    if (!paused || shotStart) raf = requestAnimationFrame(frame);
  }
  function start() {
    if (!raf && visible && !document.hidden) {
      previous = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  document.addEventListener("prism-motion", (e) => {
    paused = e.detail.paused;
    if (paused && shotStart) reset();
    start();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) start();
  });
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    canvas.parentElement.classList.remove("scene-ready");
    button.disabled = true;
    status.textContent =
      "3D paused. The rest of the site is ready to explore.";
    if (raf) cancelAnimationFrame(raf);
  });
  resize();
  start();
} catch (error) {
  button.disabled = true;
  status.textContent =
    "3D is unavailable here. Explore the rest of the night below.";
  console.info("Prism scene fallback enabled.");
}

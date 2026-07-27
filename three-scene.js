/* ============================================
   Abdul Mannan Butt — Portfolio
   Ambient 3D background: a glowing DevOps
   infinity loop with a flowing CI/CD "pulse"
   travelling around it. Subtle, non-distracting.
   ============================================ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let scene, camera, renderer;
  let loopGroup, pulseA, pulseB, scatterPoints;
  let mouseX = 0, mouseY = 0;
  let width = window.innerWidth, height = window.innerHeight;
  const clock = new THREE.Clock();

  // Lemniscate of Bernoulli — the classic DevOps infinity symbol
  const A = 190; // horizontal extent
  const B = 100; // vertical extent
  function loopPoint(t, out) {
    const scale = 1 / (1 + Math.sin(t) * Math.sin(t));
    out.set(A * scale * Math.cos(t), B * scale * Math.sin(t) * Math.cos(t), 0);
    return out;
  }

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 300);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    loopGroup = new THREE.Group();
    loopGroup.position.set(0, 10, -60);
    scene.add(loopGroup);

    // --- Traced infinity-loop line, cyan -> violet gradient ---
    const SEGMENTS = 220;
    const linePositions = new Float32Array((SEGMENTS + 1) * 3);
    const lineColors = new Float32Array((SEGMENTS + 1) * 3);
    const colorA = new THREE.Color(0x2dd4bf); // cyan
    const colorB = new THREE.Color(0x8c86f0); // violet
    const tmp = new THREE.Vector3();

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = (i / SEGMENTS) * Math.PI * 2;
      loopPoint(t, tmp);
      linePositions[i * 3] = tmp.x;
      linePositions[i * 3 + 1] = tmp.y;
      linePositions[i * 3 + 2] = tmp.z;
      const mixT = (Math.sin(t) + 1) / 2;
      const c = colorA.clone().lerp(colorB, mixT);
      lineColors[i * 3] = c.r; lineColors[i * 3 + 1] = c.g; lineColors[i * 3 + 2] = c.b;
    }
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 });
    loopGroup.add(new THREE.Line(lineGeom, lineMat));

    // Soft duplicate slightly behind for a glow-ish feel
    const glowMat = new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.12 });
    const glowLine = new THREE.Line(lineGeom.clone(), glowMat);
    glowLine.scale.set(1.04, 1.04, 1);
    loopGroup.add(glowLine);

    // --- Small nodes marking "stages" around the loop (build/test/deploy...) ---
    const NODE_COUNT = 8;
    const nodeGeom = new THREE.SphereGeometry(2.6, 12, 12);
    for (let i = 0; i < NODE_COUNT; i++) {
      const t = (i / NODE_COUNT) * Math.PI * 2;
      const p = loopPoint(t, new THREE.Vector3());
      const mixT = (Math.sin(t) + 1) / 2;
      const c = colorA.clone().lerp(colorB, mixT);
      const nodeMat = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.55 });
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.copy(p);
      loopGroup.add(node);
    }

    // --- Two bright pulses flowing around the loop (CI/CD "runs in flight") ---
    const pulseGeom = new THREE.SphereGeometry(3.4, 16, 16);
    const pulseMatA = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.9 });
    const pulseMatB = new THREE.MeshBasicMaterial({ color: 0x8c86f0, transparent: true, opacity: 0.9 });
    pulseA = new THREE.Mesh(pulseGeom, pulseMatA);
    pulseB = new THREE.Mesh(pulseGeom, pulseMatB);
    loopGroup.add(pulseA, pulseB);

    // --- Faint ambient scatter for depth ---
    const SCATTER_COUNT = 90;
    const scatterPos = new Float32Array(SCATTER_COUNT * 3);
    for (let i = 0; i < SCATTER_COUNT; i++) {
      scatterPos[i * 3] = (Math.random() - 0.5) * 700;
      scatterPos[i * 3 + 1] = (Math.random() - 0.5) * 420;
      scatterPos[i * 3 + 2] = (Math.random() - 0.5) * 350 - 150;
    }
    const scatterGeom = new THREE.BufferGeometry();
    scatterGeom.setAttribute('position', new THREE.BufferAttribute(scatterPos, 3));
    const scatterMat = new THREE.PointsMaterial({ color: 0x4fd1ff, size: 1.4, transparent: true, opacity: 0.28, sizeAttenuation: true });
    scatterPoints = new THREE.Points(scatterGeom, scatterMat);
    scene.add(scatterPoints);

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    animate();
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / width - 0.5) * 2;
    mouseY = (e.clientY / height - 0.5) * 2;
  }

  const tmpPos = new THREE.Vector3();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Gentle sway rather than a full spin, so the ∞ shape stays readable
    loopGroup.rotation.y = Math.sin(elapsed * 0.12) * 0.35;
    loopGroup.rotation.x = Math.sin(elapsed * 0.08) * 0.08;

    // Pulses travel around the lemniscate, offset from each other
    const t1 = (elapsed * 0.55) % (Math.PI * 2);
    const t2 = (t1 + Math.PI) % (Math.PI * 2);
    loopPoint(t1, tmpPos);
    pulseA.position.copy(tmpPos);
    loopPoint(t2, tmpPos);
    pulseB.position.copy(tmpPos);

    scatterPoints.rotation.y += 0.0002;

    camera.position.x += (mouseX * 14 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 14 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

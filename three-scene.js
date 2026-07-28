/* ============================================
   Abdul Mannan Butt — Portfolio
   Ambient 3D background: a glowing DevOps
   infinity loop with flowing CI/CD "pulses",
   plus drifting container/node shapes.
   Subtle, non-distracting, responsive.
   ============================================ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let scene, camera, renderer;
  let loopGroup, pulseA, pulseB, scatterPoints, containers = [], gearRing, gearRing2;
  let mouseX = 0, mouseY = 0;
  let width = window.innerWidth, height = window.innerHeight;
  const clock = new THREE.Clock();

  // Lemniscate of Bernoulli — the classic DevOps infinity symbol
  const A = 150; // horizontal extent
  const B = 78;  // vertical extent
  function loopPoint(t, out) {
    const scale = 1 / (1 + Math.sin(t) * Math.sin(t));
    out.set(A * scale * Math.cos(t), B * scale * Math.sin(t) * Math.cos(t), 0);
    return out;
  }

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

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
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 });
    loopGroup.add(new THREE.Line(lineGeom, lineMat));

    const glowMat = new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.22 });
    const glowLine = new THREE.Line(lineGeom.clone(), glowMat);
    glowLine.scale.set(1.05, 1.05, 1);
    loopGroup.add(glowLine);
    const glowLine2 = new THREE.Line(lineGeom.clone(), glowMat.clone());
    glowLine2.scale.set(1.1, 1.1, 1);
    glowLine2.material.opacity = 0.12;
    loopGroup.add(glowLine2);

    // --- "Stage" nodes around the loop (build/test/deploy...) ---
    const NODE_COUNT = 8;
    const nodeGeom = new THREE.SphereGeometry(2.4, 12, 12);
    for (let i = 0; i < NODE_COUNT; i++) {
      const t = (i / NODE_COUNT) * Math.PI * 2;
      const p = loopPoint(t, new THREE.Vector3());
      const mixT = (Math.sin(t) + 1) / 2;
      const c = colorA.clone().lerp(colorB, mixT);
      const nodeMat = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85 });
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.copy(p);
      loopGroup.add(node);
    }

    // --- Automation "gear ring" — a slowly turning torus, evoking CI/CD automation ---
    const ringGeom = new THREE.TorusGeometry(46, 1.4, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf0a93e, transparent: true, opacity: 0.28, wireframe: true });
    gearRing = new THREE.Mesh(ringGeom, ringMat);
    gearRing.position.set(-190, -60, -30);
    gearRing.rotation.x = Math.PI / 2.4;
    scene.add(gearRing);

    const ringGeom2 = new THREE.TorusGeometry(30, 1, 8, 40);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.24, wireframe: true });
    gearRing2 = new THREE.Mesh(ringGeom2, ringMat2);
    gearRing2.position.set(210, 90, -60);
    gearRing2.rotation.x = Math.PI / 3;
    scene.add(gearRing2);

    // --- Two bright pulses flowing around the loop (pipeline runs in flight) ---
    const pulseGeom = new THREE.SphereGeometry(3.2, 16, 16);
    pulseA = new THREE.Mesh(pulseGeom, new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.9 }));
    pulseB = new THREE.Mesh(pulseGeom, new THREE.MeshBasicMaterial({ color: 0x8c86f0, transparent: true, opacity: 0.9 }));
    loopGroup.add(pulseA, pulseB);

    // --- Drifting DevOps tool-name tags (git, docker, terraform, aws...) ---
    const toolTags = [
      { label: 'git', color: '#f0a93e' },
      { label: 'docker', color: '#2dd4bf' },
      { label: 'k8s', color: '#8c86f0' },
      { label: 'terraform', color: '#8c86f0' },
      { label: 'aws', color: '#f0a93e' },
      { label: 'jenkins', color: '#2dd4bf' },
      { label: 'ansible', color: '#f0a93e' },
      { label: 'linux', color: '#8c86f0' },
      { label: 'nginx', color: '#2dd4bf' },
    ];

    function makeTagSprite(label, colorHex) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scaleFactor = 4; // crisp text
      ctx.font = `600 ${20 * scaleFactor}px "JetBrains Mono", monospace`;
      const textWidth = ctx.measureText(label).width;
      const padX = 22 * scaleFactor, padY = 14 * scaleFactor;
      canvas.width = textWidth + padX * 2;
      canvas.height = 20 * scaleFactor + padY * 2;

      ctx.font = `600 ${20 * scaleFactor}px "JetBrains Mono", monospace`;
      const r = 14 * scaleFactor;
      const w = canvas.width, h = canvas.height;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.arcTo(w, 0, w, h, r);
      ctx.arcTo(w, h, 0, h, r);
      ctx.arcTo(0, h, 0, 0, r);
      ctx.arcTo(0, 0, w, 0, r);
      ctx.closePath();
      ctx.fillStyle = 'rgba(13,17,23,0.55)';
      ctx.fill();
      ctx.lineWidth = 3 * scaleFactor;
      ctx.strokeStyle = colorHex;
      ctx.stroke();

      ctx.fillStyle = colorHex;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, w / 2, h / 2 + 2 * scaleFactor);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.85 });
      const sprite = new THREE.Sprite(mat);
      const aspect = canvas.width / canvas.height;
      const baseHeight = 15;
      sprite.scale.set(baseHeight * aspect, baseHeight, 1);
      return sprite;
    }

    toolTags.forEach((tool) => {
      const sprite = makeTagSprite(tool.label, tool.color);
      sprite.position.set(
        (Math.random() - 0.5) * 640,
        (Math.random() - 0.5) * 380,
        (Math.random() - 0.5) * 260 - 100
      );
      sprite.userData.driftSpeed = 0.04 + Math.random() * 0.06;
      sprite.userData.driftOffset = Math.random() * Math.PI * 2;
      sprite.userData.baseY = sprite.position.y;
      scene.add(sprite);
      containers.push(sprite);
    });

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
    const scatterMat = new THREE.PointsMaterial({ color: 0x4fd1ff, size: 1.4, transparent: true, opacity: 0.25, sizeAttenuation: true });
    scatterPoints = new THREE.Points(scatterGeom, scatterMat);
    scene.add(scatterPoints);

    applyResponsiveScale();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    animate();
  }

  // Keep the loop comfortably inside the viewport on any screen size,
  // by computing exactly how much world-space is visible at its depth.
  function applyResponsiveScale() {
    const depth = camera.position.z - loopGroup.position.z; // distance from camera to loop
    const vFovRad = (camera.fov * Math.PI) / 180;
    const visibleHalfHeight = depth * Math.tan(vFovRad / 2);
    const visibleHalfWidth = visibleHalfHeight * camera.aspect;

    const margin = 0.72; // leave breathing room so it never touches the edges
    const scaleForWidth = (visibleHalfWidth * margin) / A;
    const scaleForHeight = (visibleHalfHeight * margin) / B;
    const s = Math.max(0.32, Math.min(1, scaleForWidth, scaleForHeight));
    loopGroup.scale.setScalar(s);
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    applyResponsiveScale();
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
    loopGroup.rotation.y = Math.sin(elapsed * 0.12) * 0.3;
    loopGroup.rotation.x = Math.sin(elapsed * 0.08) * 0.06;

    // Pulses travel around the lemniscate, offset from each other
    const t1 = (elapsed * 0.55) % (Math.PI * 2);
    const t2 = (t1 + Math.PI) % (Math.PI * 2);
    loopPoint(t1, tmpPos);
    pulseA.position.copy(tmpPos);
    loopPoint(t2, tmpPos);
    pulseB.position.copy(tmpPos);

    // Drifting containers: slow tumble + gentle float
    containers.forEach((tag) => {
      tag.position.y = tag.userData.baseY + Math.sin(elapsed * tag.userData.driftSpeed + tag.userData.driftOffset) * 14;
      tag.material.rotation = Math.sin(elapsed * tag.userData.driftSpeed * 0.6 + tag.userData.driftOffset) * 0.08;
    });

    scatterPoints.rotation.y += 0.0002;
    gearRing.rotation.z += 0.0025;
    gearRing2.rotation.z -= 0.0018;

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

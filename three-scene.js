/* ============================================
   Abdul Mannan Butt — Portfolio
   Ambient 3D particle-field background (three.js)
   Subtle, low-cost, non-distracting.
   ============================================ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let scene, camera, renderer, points;
  let mouseX = 0, mouseY = 0;
  let width = window.innerWidth, height = window.innerHeight;

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 220;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Infinity-loop (lemniscate) particle field — the classic DevOps symbol,
    // rendered as an ambient 3D point cloud rather than a literal icon.
    const LOOP_COUNT = 340;
    const SCATTER_COUNT = 110;
    const PARTICLE_COUNT = LOOP_COUNT + SCATTER_COUNT;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const A = 170; // horizontal extent
    const B = 90;  // vertical extent

    for (let i = 0; i < LOOP_COUNT; i++) {
      const t = (i / LOOP_COUNT) * Math.PI * 2;
      // Lemniscate of Bernoulli parametrisation
      const scale = 1 / (1 + Math.sin(t) * Math.sin(t));
      const x = A * scale * Math.cos(t);
      const y = B * scale * Math.sin(t) * Math.cos(t);
      const jitter = 6;
      positions[i * 3] = x + (Math.random() - 0.5) * jitter;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    // Sparse ambient scatter around the loop so it doesn't feel too isolated
    for (let i = 0; i < SCATTER_COUNT; i++) {
      const idx = LOOP_COUNT + i;
      positions[idx * 3] = (Math.random() - 0.5) * 620;
      positions[idx * 3 + 1] = (Math.random() - 0.5) * 380;
      positions[idx * 3 + 2] = (Math.random() - 0.5) * 400 - 80;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x4fd1ff,
      size: 1.8,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    points = new THREE.Points(geometry, material);
    points.position.set(0, 20, -40);
    scene.add(points);

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

  function animate() {
    requestAnimationFrame(animate);

    points.rotation.y += 0.00035;
    points.rotation.x += 0.00012;

    camera.position.x += (mouseX * 12 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 12 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

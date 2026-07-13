
(function () {
  if (typeof THREE === "undefined") return; 
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 14;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ---- lighting ----
  const ambient = new THREE.AmbientLight(0x8892ff, 0.6);
  scene.add(ambient);

  const point1 = new THREE.PointLight(0x7c5cff, 1.4, 40);
  point1.position.set(6, 4, 8);
  scene.add(point1);

  const point2 = new THREE.PointLight(0x4cc9f0, 1.1, 40);
  point2.position.set(-6, -3, 6);
  scene.add(point2);

  // ---- floating wireframe shapes ----
  const shapeColors = [0x7c5cff, 0x4cc9f0, 0xff6b9d, 0x33d6b0, 0xffd166];
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.9, 0.28, 12, 32),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1.1, 0)
  ];

  const SHAPE_COUNT = 10;
  for (let i = 0; i < SHAPE_COUNT; i++) {
    const geo = geometries[i % geometries.length];
    const color = shapeColors[i % shapeColors.length];

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: color,
      emissiveIntensity: 0.25
    });

    const mesh = new THREE.Mesh(geo, mat);
    const spread = 11;
    mesh.position.set(
      (Math.random() - 0.5) * spread * 1.8,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * 6 - 4
    );
    const scale = 0.6 + Math.random() * 1.1;
    mesh.scale.setScalar(scale);

    mesh.userData = {
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006
      },
      floatSpeed: 0.15 + Math.random() * 0.25,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y
    };

    scene.add(mesh);
    shapes.push(mesh);
  }

  // ---- soft glowing particle field ----
  const particleCount = 160;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x9fb4ff,
    size: 0.045,
    transparent: true,
    opacity: 0.5
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- resize handling ----
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  // ---- animation loop ----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    shapes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotSpeed.x;
      mesh.rotation.y += mesh.userData.rotSpeed.y;
      mesh.position.y =
        mesh.userData.baseY +
        Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.6;
    });

    particles.rotation.y = t * 0.01;

    renderer.render(scene, camera);
  }

  animate();
})();

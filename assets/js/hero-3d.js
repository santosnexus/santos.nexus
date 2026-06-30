/* ============================================
   Santos.Nexus — 3D Hero (Three.js)
   A central orb with 5 satellite brand nodes
   ============================================ */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const BRAND_COLORS = [
  { hex: 0x0A1F44, name: 'Santos Travel' },     // navy
  { hex: 0xFF6B35, name: 'TDK Sports' },         // coral
  { hex: 0x00B4D8, name: 'Santos Care' },         // teal
  { hex: 0xF4B400, name: 'Santos Nexus' },        // gold
  { hex: 0x2A9D8F, name: 'DARC Foundation' },     // mint
];

class Hero3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.time = 0;
    this.scroll = 0;
    this.targetScroll = 0;
    this.init();
    this.animate();
    this.bindEvents();
  }

  init() {
    // === Scene ===
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050B1A, 0.06);

    // === Camera ===
    const rect = this.canvas.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
    this.camera.position.set(0, 0, 8);

    // === Renderer ===
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(rect.width, rect.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    // === Lights ===
    const ambient = new THREE.AmbientLight(0x4a5680, 0.5);
    this.scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xF4B400, 2.0, 20);
    fillLight.position.set(-5, 2, 3);
    this.scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x00B4D8, 1.5, 20);
    rimLight.position.set(5, -2, 2);
    this.scene.add(rimLight);

    // === Central orb (icosahedron with vertex particles) ===
    this.orbGroup = new THREE.Group();
    this.scene.add(this.orbGroup);

    // Inner core — slightly translucent icosahedron
    const coreGeom = new THREE.IcosahedronGeometry(1.4, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0A1F44,
      emissive: 0x0A1F44,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    this.core = new THREE.Mesh(coreGeom, coreMat);
    this.orbGroup.add(this.core);

    // Wireframe overlay
    const wireGeom = new THREE.IcosahedronGeometry(1.45, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xF4B400,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    this.wireframe = new THREE.Mesh(wireGeom, wireMat);
    this.orbGroup.add(this.wireframe);

    // Particle cloud around the orb
    const particleCount = 1800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Distribute on a sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.55 + Math.random() * 0.6;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color — weighted toward brand colors
      const colorChoice = Math.random();
      let c;
      if (colorChoice < 0.35) c = BRAND_COLORS[0].hex;        // navy
      else if (colorChoice < 0.55) c = BRAND_COLORS[3].hex;   // gold
      else if (colorChoice < 0.70) c = BRAND_COLORS[2].hex;   // teal
      else if (colorChoice < 0.82) c = BRAND_COLORS[1].hex;   // coral
      else if (colorChoice < 0.94) c = BRAND_COLORS[4].hex;   // mint
      else c = 0xFFFFFF;                                      // accent

      tmpColor.setHex(c);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;

      sizes[i] = Math.random() * 0.04 + 0.01;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Use PointsMaterial with a custom texture (simple disc)
    const particleTexture = this.createParticleTexture();

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.particles = new THREE.Points(particleGeom, particleMat);
    this.orbGroup.add(this.particles);

    // === 5 satellite brand nodes ===
    this.satellites = [];
    this.satelliteLines = [];
    const satelliteRadius = 3.0;
    BRAND_COLORS.forEach((brand, i) => {
      const angle = (i / BRAND_COLORS.length) * Math.PI * 2;
      const x = satelliteRadius * Math.cos(angle);
      const y = satelliteRadius * Math.sin(angle) * 0.6;  // flatten
      const z = Math.sin(angle * 0.5) * 0.5;

      // Node sphere
      const nodeGeom = new THREE.SphereGeometry(0.22, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: brand.hex,
        emissive: brand.hex,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.3,
      });
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.set(x, y, z);
      node.userData = { baseAngle: angle, baseRadius: satelliteRadius, baseY: y, baseZ: z, brand };
      this.orbGroup.add(node);

      // Glow ring
      const ringGeom = new THREE.RingGeometry(0.28, 0.34, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: brand.hex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(this.camera.position);
      this.orbGroup.add(ring);
      node.userData.ring = ring;

      // Connection line from center to satellite
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: brand.hex,
        transparent: true,
        opacity: 0.2,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      this.orbGroup.add(line);
      this.satelliteLines.push(line);

      this.satellites.push(node);
    });

    // === Background starfield (subtle) ===
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 30 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x9BA3B5,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    this.stars = new THREE.Points(starGeom, starMat);
    this.scene.add(this.stars);
  }

  createParticleTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    window.addEventListener('scroll', () => {
      this.targetScroll = window.scrollY / window.innerHeight;
    });
  }

  onResize() {
    const rect = this.canvas.getBoundingClientRect();
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height, false);
  }

  animate() {
    this.time += 0.01;

    // Smooth mouse follow
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth scroll
    this.scroll += (this.targetScroll - this.scroll) * 0.05;

    // Orb rotation — influenced by mouse
    this.orbGroup.rotation.y = this.time * 0.3 + this.mouse.x * 0.5;
    this.orbGroup.rotation.x = this.mouse.y * 0.3 - this.scroll * 0.5;

    // Inner core gentle pulse
    const pulse = 1 + Math.sin(this.time * 2) * 0.03;
    this.core.scale.setScalar(pulse);
    this.wireframe.rotation.y = -this.time * 0.5;
    this.wireframe.rotation.x = this.time * 0.3;

    // Particles rotation
    this.particles.rotation.y = this.time * 0.1;
    this.particles.rotation.x = Math.sin(this.time * 0.5) * 0.2;

    // Satellite nodes — orbit + bob
    this.satellites.forEach((node, i) => {
      const d = node.userData;
      const orbitSpeed = 0.15;
      const newAngle = d.baseAngle + this.time * orbitSpeed;
      const r = d.baseRadius;
      node.position.x = r * Math.cos(newAngle);
      node.position.y = d.baseY + Math.sin(this.time * 1.5 + i) * 0.15;
      node.position.z = d.baseZ + Math.cos(this.time * 1.0 + i) * 0.1;

      // Ring faces camera
      if (d.ring) {
        d.ring.position.copy(node.position);
        d.ring.lookAt(this.camera.position);
      }

      // Update line
      const line = this.satelliteLines[i];
      const positions = line.geometry.attributes.position;
      positions.setXYZ(0, 0, 0, 0);
      positions.setXYZ(1, node.position.x, node.position.y, node.position.z);
      positions.needsUpdate = true;
    });

    // Starfield rotation
    this.stars.rotation.y = this.time * 0.02;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}

// Boot
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  // Only init if WebGL is supported and not in reduced-motion
  const supportsWebGL = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  })();

  if (supportsWebGL && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new Hero3D(canvas);
  } else {
    // Fallback: show a static gradient hero
    canvas.style.display = 'none';
  }
}

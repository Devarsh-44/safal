'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The 24-spoke chakra from the Safal Vidyalaya logo, built in Three.js as polished saffron metal.
 * It turns with the scroll (one full turn while its section passes), tilts toward the pointer and
 * renders only while on screen. Without WebGL, or with reduced motion, a flat drawing stands in.
 */
export default function Chakra3D({ className = '' }) {
  const wrap = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setFallback(true); return; }
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch { setFallback(true); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 7.2);

      const saffron = new THREE.MeshPhysicalMaterial({ color: 0xff9933, metalness: 0.75, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.15 });
      const ivory = new THREE.MeshPhysicalMaterial({ color: 0xf5f5f7, metalness: 0.3, roughness: 0.3, clearcoat: 1 });

      const wheel = new THREE.Group();
      wheel.add(new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.075, 48, 200), saffron));
      wheel.add(new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.022, 24, 200), saffron));
      wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 32, 96), saffron));
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.16, 64), ivory);
      hub.rotation.x = Math.PI / 2;
      wheel.add(hub);

      // 24 spokes, thicker at the hub, tapering to the rim.
      const spokeGeo = new THREE.CylinderGeometry(0.014, 0.045, 1.08, 16);
      spokeGeo.translate(0, 0.34 + 0.54, 0);
      const spokes = new THREE.InstancedMesh(spokeGeo, saffron, 24);
      const beadGeo = new THREE.SphereGeometry(0.05, 24, 16);
      const beads = new THREE.InstancedMesh(beadGeo, ivory, 24);
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const z = new THREE.Vector3(0, 0, 1);
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        q.setFromAxisAngle(z, a);
        m.compose(new THREE.Vector3(0, 0, 0), q, new THREE.Vector3(1, 1, 1));
        spokes.setMatrixAt(i, m);
        const b = a + Math.PI / 24;
        m.makeTranslation(-Math.sin(b) * 1.51, Math.cos(b) * 1.51, 0);
        beads.setMatrixAt(i, m);
      }
      wheel.add(spokes, beads);
      scene.add(wheel);

      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(3, 4, 5);
      const rim = new THREE.DirectionalLight(0xff9933, 3);
      rim.position.set(-4, -2, -3);
      scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

      const size = () => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      const pointer = { x: 0, y: 0 };
      const onMove = (e) => { pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = (e.clientY / window.innerHeight) * 2 - 1; };
      window.addEventListener('pointermove', onMove, { passive: true });

      let visible = false;
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(); }, { rootMargin: '100px' });
      io.observe(el);

      let raf = 0;
      let spin = 0;
      const loop = () => {
        cancelAnimationFrame(raf);
        if (!visible || disposed) return;
        const r = el.getBoundingClientRect();
        const progress = 1 - (r.top + r.height) / (window.innerHeight + r.height);
        spin += 0.0025;
        wheel.rotation.z = -(progress * Math.PI * 2) - spin;
        wheel.rotation.x += ((-pointer.y * 0.35 + 0.15) - wheel.rotation.x) * 0.06;
        wheel.rotation.y += ((pointer.x * 0.45) - wheel.rotation.y) * 0.06;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
        scene.traverse((o) => { o.geometry?.dispose?.(); });
        saffron.dispose(); ivory.dispose(); pmrem.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => setFallback(true));

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div ref={wrap} className={'chakra3d ' + className} role="img" aria-label="The 24-spoke chakra from the Safal Vidyalaya logo">
      {fallback && (
        <svg viewBox="0 0 200 200" fill="none" stroke="#FF9933" strokeWidth="3">
          <circle cx="100" cy="100" r="88" strokeWidth="7" />
          <circle cx="100" cy="100" r="16" />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={i} x1={100 + Math.sin(a) * 18} y1={100 - Math.cos(a) * 18} x2={100 + Math.sin(a) * 84} y2={100 - Math.cos(a) * 84} />;
          })}
        </svg>
      )}
    </div>
  );
}

import * as THREE from 'three';

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mesh: THREE.Mesh;
  private wireMesh: THREE.Mesh;
  private mouseX = 0;
  private mouseY = 0;
  private rafId = 0;
  private resizeObserver: ResizeObserver;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.setClearColor(0x000000, 0);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.z = 5;

    // Geometry — icosahedron
    const geo = new THREE.IcosahedronGeometry(1.8, 1);

    // Solid mesh — amber metallic
    const mat = new THREE.MeshStandardMaterial({
      color: 0xD97706,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.35,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xFBBF24,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    this.wireMesh = new THREE.Mesh(geo, wireMat);
    this.scene.add(this.wireMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    this.scene.add(ambientLight);

    // Amber point light
    const amberLight = new THREE.PointLight(0xD97706, 3, 10);
    amberLight.position.set(3, 2, 2);
    this.scene.add(amberLight);

    // Copper point light
    const copperLight = new THREE.PointLight(0xC2410C, 2, 10);
    copperLight.position.set(-3, -1, 1);
    this.scene.add(copperLight);

    // Mouse parallax
    window.addEventListener('mousemove', this.onMouseMove);

    // Resize observer
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(canvas);

    this.animate();
  }

  private onMouseMove = (e: MouseEvent) => {
    this.mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  private onResize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);

    // Continuous slow rotation
    this.mesh.rotation.x += 0.003;
    this.mesh.rotation.y += 0.005;

    // Mouse parallax
    this.mesh.rotation.x += (this.mouseY * 0.3 - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (this.mouseX * 0.3 - this.mesh.rotation.y) * 0.05;

    this.wireMesh.rotation.copy(this.mesh.rotation);

    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.resizeObserver.disconnect();
    this.renderer.dispose();
  }
}

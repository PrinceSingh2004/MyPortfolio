class BlackHoleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || !window.THREE) return;

        this.init();
        this.createBlackHole();
        this.createStarfield();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        this.mouseX = 0;
        this.mouseY = 0;
    }

    createBlackHole() {
        // 1. THE VOID (CENTRAL CORE)
        const coreGeom = new THREE.SphereGeometry(12, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.core = new THREE.Mesh(coreGeom, coreMat);
        this.scene.add(this.core);

        // 2. EVENT HORIZON GLOW (EVENT HORIZON)
        const glowGeom = new THREE.SphereGeometry(12.5, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6, // Purple energy
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        this.glow = new THREE.Mesh(glowGeom, glowMat);
        this.scene.add(this.glow);

        // 3. ACCRETION DISK (THE SWIRL)
        this.diskLayers = [];
        const diskColors = [0x8b5cf6, 0x3b82f6, 0x06b6d4];
        
        for (let i = 0; i < 3; i++) {
            const diskGeom = new THREE.TorusGeometry(25 + i * 2, 0.5 + i * 0.2, 2, 100);
            const diskMat = new THREE.MeshBasicMaterial({
                color: diskColors[i],
                transparent: true,
                opacity: 0.2 - i * 0.05,
                blending: THREE.AdditiveBlending
            });
            const disk = new THREE.Mesh(diskGeom, diskMat);
            disk.rotation.x = Math.PI / 2.2;
            disk.rotation.y = (Math.random() - 0.5) * 0.2;
            this.scene.add(disk);
            this.diskLayers.push({ mesh: disk, speed: 0.02 + i * 0.01 });
        }
    }

    createStarfield() {
        // Spiraling Particles (Falling in)
        this.particleCount = 1500;
        const geom = new THREE.BufferGeometry();
        this.posArray = new Float32Array(this.particleCount * 3);
        this.velArray = new Float32Array(this.particleCount); // Velocity bias

        for (let i = 0; i < this.particleCount; i++) {
            const ix = i * 3;
            // Random distribution to start
            const r = 50 + Math.random() * 150;
            const theta = Math.random() * Math.PI * 2;
            this.posArray[ix] = Math.cos(theta) * r;
            this.posArray[ix + 1] = (Math.random() - 0.5) * 40;
            this.posArray[ix + 2] = Math.sin(theta) * r;
            this.velArray[i] = 0.5 + Math.random();
        }

        geom.setAttribute('position', new THREE.BufferAttribute(this.posArray, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.6,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geom, mat);
        this.scene.add(this.particles);
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX - window.innerWidth / 2);
            this.mouseY = (e.clientY - window.innerHeight / 2);
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 1. Accretion Disk Rotation
        this.diskLayers.forEach(layer => {
            layer.mesh.rotation.z += layer.speed;
        });

        // 2. Particle Swirl (Sucking in effect)
        const pos = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            // Calculate current distance from center
            let x = pos[ix];
            let z = pos[iz];
            let r = Math.sqrt(x*x + z*z);

            // Spiral movement
            const angle = 0.02 * this.velArray[i];
            pos[ix] = x * Math.cos(angle) - z * Math.sin(angle);
            pos[iz] = x * Math.sin(angle) + z * Math.cos(angle);

            // Pull inward
            const pull = 0.2 * this.velArray[i];
            pos[ix] -= (pos[ix] / r) * pull;
            pos[iz] -= (pos[iz] / r) * pull;

            // Reset if sucked in
            if (r < 12) {
                const newR = 150 + Math.random() * 50;
                const newTheta = Math.random() * Math.PI * 2;
                pos[ix] = Math.cos(newTheta) * newR;
                pos[iz] = Math.sin(newTheta) * newR;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;

        // 3. Camera Parallax
        this.camera.position.x += (this.mouseX * 0.02 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.02 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BlackHoleEngine('galaxy-canvas');
});

import * as THREE from 'three';
import { kiraContexts } from './learning-data.js';

// Modular parts keep the procedural mascot easy to adjust.
const container = document.getElementById('imkk-robot-container');
if (container && 'WebGLRenderingContext' in window) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.55, 8.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.13;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);
    container.querySelector('.robot-loading-fallback')?.remove();

    const robot = new THREE.Group();
    scene.add(robot);

    const materials = {
      shell: new THREE.MeshStandardMaterial({ color: 0xeaf1fa, metalness: 0.48, roughness: 0.27 }),
      shellLight: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.36, roughness: 0.22 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x243349, metalness: 0.65, roughness: 0.3 }),
      joint: new THREE.MeshStandardMaterial({ color: 0x52647b, metalness: 0.58, roughness: 0.32 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x397ef3, metalness: 0.55, roughness: 0.25 }),
      led: new THREE.MeshStandardMaterial({ color: 0x71eeff, emissive: 0x28c9f4, emissiveIntensity: 2.4, metalness: 0.12, roughness: 0.18 }),
      eye: new THREE.MeshStandardMaterial({ color: 0xc7fbff, emissive: 0x49deff, emissiveIntensity: 2.8, metalness: 0.1, roughness: 0.12 })
    };

    const addMesh = (parent, geometry, material, position, scale, name) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      if (scale) mesh.scale.set(...scale);
      if (name) mesh.name = name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const box = (parent, material, position, size, radius = 0.08, name = '') => {
      const [width, height, depth] = size;
      const rounding = Math.max(0.001, Math.min(radius, width * 0.12, height * 0.12, depth * 0.3));
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2 + rounding, -height / 2);
      shape.lineTo(width / 2 - rounding, -height / 2);
      shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + rounding);
      shape.lineTo(width / 2, height / 2 - rounding);
      shape.quadraticCurveTo(width / 2, height / 2, width / 2 - rounding, height / 2);
      shape.lineTo(-width / 2 + rounding, height / 2);
      shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - rounding);
      shape.lineTo(-width / 2, -height / 2 + rounding);
      shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + rounding, -height / 2);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: Math.max(0.001, depth - rounding * 2),
        bevelEnabled: true,
        bevelThickness: rounding,
        bevelSize: rounding,
        bevelSegments: 2,
        curveSegments: 4,
        steps: 1
      });
      const mesh = addMesh(parent, geometry, material, [position[0], position[1], position[2] - depth / 2 + rounding], null, name);
      return mesh;
    };
    const boxDetail = (parent, material, position, size, name = '') =>
      addMesh(parent, new THREE.BoxGeometry(...size), material, position, null, name);
    const sphere = (parent, material, position, size, name = '') => addMesh(parent, new THREE.SphereGeometry(1, 24, 18), material, position, size, name);
    const cylinder = (parent, material, position, radiusTop, radiusBottom, height, name = '') => addMesh(parent, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 16), material, position, null, name);

    function createHead() {
      const head = new THREE.Group();
      head.position.set(0, 1.43, 0.03);
      robot.add(head);
      box(head, materials.shellLight, [0, 0, 0], [1.62, 1.25, 1.06], 0.13, 'head-shell');
      box(head, materials.dark, [0, -0.02, 0.548], [1.36, 0.87, 0.055], 0.1, 'face-visor');
      for (const x of [-0.37, 0.37]) {
        sphere(head, materials.eye, [x, 0.09, 0.594], [0.19, 0.25, 0.075], 'cyan-eye');
        sphere(head, materials.led, [x, 0.09, 0.645], [0.085, 0.125, 0.035]);
      }
      boxDetail(head, materials.blue, [0, -0.28, 0.592], [0.25, 0.035, 0.025], 'mouth-light');
      // Ear pieces and small side status lights add readable depth in profile.
      for (const side of [-1, 1]) {
        box(head, materials.blue, [side * 0.84, 0.02, 0], [0.12, 0.42, 0.7], 0.05, 'ear-fin');
        sphere(head, materials.led, [side * 0.91, 0.02, 0.18], [0.055, 0.09, 0.09]);
      }
      // Antenna is grouped so it can gently sway independently.
      const antenna = new THREE.Group();
      antenna.position.set(0, 0.63, 0);
      head.add(antenna);
      cylinder(antenna, materials.joint, [0, 0.16, 0], 0.035, 0.05, 0.34, 'antenna-stem');
      sphere(antenna, materials.led, [0, 0.36, 0], [0.11, 0.11, 0.11], 'antenna-light');
      return { head, antenna };
    }

    function createBody() {
      const body = new THREE.Group();
      robot.add(body);
      box(body, materials.shell, [0, 0.12, 0], [1.5, 1.42, 0.92], 0.12, 'torso');
      box(body, materials.dark, [0, 0.18, 0.48], [0.92, 0.65, 0.055], 0.09, 'chest-panel');
      box(body, materials.blue, [0, 0.2, 0.52], [0.48, 0.13, 0.04], 0.04, 'chest-emblem');
      boxDetail(body, materials.led, [0, -0.03, 0.52], [0.2, 0.035, 0.025], 'chest-status');
      for (const x of [-0.52, -0.35, 0.35, 0.52]) box(body, materials.joint, [x, -0.38, 0.48], [0.07, 0.045, 0.03], 0.015);
      // Neck and waist couplings.
      cylinder(body, materials.joint, [0, 0.91, 0], 0.23, 0.23, 0.24);
      box(body, materials.dark, [0, -0.67, 0], [0.92, 0.18, 0.65], 0.08, 'waist');
      return body;
    }

    function createArm(side) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.9, 0.63, 0);
      robot.add(arm);
      sphere(arm, materials.joint, [0, 0, 0], [0.31, 0.31, 0.31], 'shoulder-joint');
      sphere(arm, materials.shellLight, [side * 0.1, 0, 0], [0.34, 0.36, 0.38], 'shoulder-pad');
      cylinder(arm, materials.dark, [side * 0.11, -0.37, 0], 0.18, 0.2, 0.37, 'upper-arm');
      box(arm, materials.blue, [side * 0.11, -0.39, 0.19], [0.12, 0.18, 0.045], 0.03, 'arm-accent');
      sphere(arm, materials.joint, [side * 0.11, -0.6, 0], [0.22, 0.22, 0.22], 'elbow');
      cylinder(arm, materials.shell, [side * 0.11, -0.85, 0], 0.15, 0.18, 0.34, 'forearm');
      const hand = new THREE.Group();
      hand.position.set(side * 0.11, -1.07, 0.02);
      arm.add(hand);
      sphere(hand, materials.dark, [0, 0, 0], [0.22, 0.16, 0.2], 'hand-palm');
      for (let i = -1; i <= 1; i++) sphere(hand, materials.shellLight, [i * 0.12, -0.12, 0.03], [0.065, 0.13, 0.075], 'finger');
      return { group: arm, hand };
    }

    function createLeg(side) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.43, -0.62, 0);
      robot.add(leg);
      sphere(leg, materials.joint, [0, 0, 0], [0.23, 0.24, 0.23], 'hip-joint');
      cylinder(leg, materials.shell, [0, -0.35, 0], 0.17, 0.19, 0.46, 'thigh');
      box(leg, materials.blue, [0, -0.36, 0.17], [0.1, 0.2, 0.035], 0.025, 'thigh-light');
      sphere(leg, materials.dark, [0, -0.62, 0], [0.2, 0.18, 0.2], 'knee');
      cylinder(leg, materials.shellLight, [0, -0.9, 0], 0.14, 0.16, 0.4, 'shin');
      box(leg, materials.dark, [0, -1.17, 0.11], [0.47, 0.24, 0.68], 0.09, 'foot');
      box(leg, materials.blue, [0, -1.17, 0.46], [0.25, 0.055, 0.045], 0.02, 'toe-light');
      return leg;
    }

    const { head, antenna } = createHead();
    const body = createBody();
    const leftArm = createArm(-1);
    const rightArm = createArm(1);
    createLeg(-1);
    createLeg(1);
    robot.position.y = -0.05;
    robot.rotation.y = -0.12;

    // Soft studio lighting keeps the alpha canvas and metallic surfaces clean.
    scene.add(new THREE.HemisphereLight(0xf4f9ff, 0x8294ad, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(-3.5, 5, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x72bbff, 2.2);
    fillLight.position.set(4, 1.5, 3);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x42cfff, 16, 8, 2);
    rimLight.position.set(0, 2.2, -2.6);
    scene.add(rimLight);

    // Contact shadow uses a transparent gradient texture rather than a heavy shadow map.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const context = shadowCanvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
    gradient.addColorStop(0, 'rgba(37, 75, 126, 0.25)');
    gradient.addColorStop(1, 'rgba(37, 75, 126, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.05), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -1.93, 0.16);
    scene.add(shadow);

    let targetX = 0;
    let targetY = -0.12;
    let targetLeftArm = 0;
    let targetRightArm = 0;
    let targetIntro = 0;
    let guidedUntil = 0;
    let frameId = 0;
    let isVisible = true;
    const bubble = document.getElementById('guide-bubble');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clock = new THREE.Clock();
    let poseTimer = 0;
    let activeContext = 'beranda';
    const bubbleMessage = document.getElementById('guide-message');
    const bubbleActions = bubble?.querySelector('[data-kira-actions]');
    const exploreLink = bubble?.querySelector('[data-kira-explore]');
    const explainButton = bubble?.querySelector('[data-kira-explain]');
    const exampleButton = bubble?.querySelector('[data-kira-example]');
    const closeBubbleButton = bubble?.querySelector('[data-kira-close]');
    function scheduleIdle(delay) {
      window.clearTimeout(poseTimer);
      poseTimer = window.setTimeout(robotIdle, delay);
    }
    function handleMouseMove(event) {
      if (performance.now() < guidedUntil) return;
      const bounds = container.getBoundingClientRect();
      targetY = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 0.48 - 0.12, -0.24, 0.24);
      targetX = THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * -0.22, -0.12, 0.12);
    }
    let bubbleTimer = 0;
    function showMessage(message, duration = 6500, { showActions = false, showExplore = false } = {}) {
      if (!bubble || !message) return;
      window.clearTimeout(bubbleTimer);
      if (bubbleMessage) bubbleMessage.textContent = message;
      else bubble.textContent = message;
      if (bubbleActions) bubbleActions.hidden = !showActions;
      if (exploreLink) exploreLink.hidden = !showExplore;
      container.setAttribute('aria-expanded', String(showActions || showExplore || duration === 0));
      bubble.hidden = false;
      requestAnimationFrame(() => bubble.classList.add('is-visible'));
      if (duration > 0) bubbleTimer = window.setTimeout(hideMessage, duration);
    }
    function hideMessage() {
      if (!bubble) return;
      window.clearTimeout(bubbleTimer);
      if (bubbleActions) bubbleActions.hidden = true;
      if (exploreLink) exploreLink.hidden = true;
      container.setAttribute('aria-expanded', 'false');
      bubble.classList.remove('is-visible');
      window.setTimeout(() => { if (!bubble.classList.contains('is-visible')) bubble.hidden = true; }, 240);
    }
    function setActiveContext(sectionId) {
      activeContext = Object.prototype.hasOwnProperty.call(kiraContexts, sectionId) ? sectionId : 'beranda';
      if (exploreLink) exploreLink.hidden = true;
      if (container.getAttribute('aria-expanded') === 'true' && bubbleMessage) {
        bubbleMessage.textContent = kiraContexts[activeContext].prompt;
      }
    }
    function toggleContextPrompt(moveFocus = false) {
      if (!bubble) return;
      if (container.getAttribute('aria-expanded') === 'true') {
        hideMessage();
        return;
      }
      const context = kiraContexts[activeContext] ?? kiraContexts.beranda;
      showMessage(context.prompt, 0, { showActions: true });
      if (moveFocus) explainButton?.focus({ preventScroll: true });
    }
    function answerContext(kind) {
      const context = kiraContexts[activeContext] ?? kiraContexts.beranda;
      const response = context[kind];
      if (!response) return;
      container.focus({ preventScroll: true });
      robotExplain(container, response);
    }
    container.addEventListener('click', () => toggleContextPrompt());
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleContextPrompt(true);
      }
    });
    bubble?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && container.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        hideMessage();
        container.focus({ preventScroll: true });
      }
    });
    explainButton?.addEventListener('click', () => answerContext('explanation'));
    exampleButton?.addEventListener('click', () => answerContext('example'));
    closeBubbleButton?.addEventListener('click', () => {
      hideMessage();
      container.focus({ preventScroll: true });
    });
    exploreLink?.addEventListener('click', (event) => {
      const target = document.getElementById('materi');
      if (!target) return;
      event.preventDefault();
      hideMessage();
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    });
    function robotIdle() {
      guidedUntil = performance.now() + 250;
      targetLeftArm = 0;
      targetRightArm = 0;
      targetX = 0;
      targetY = -0.12;
    }
    function robotWelcome(message) {
      guidedUntil = performance.now() + 4200;
      targetRightArm = 2.18;
      targetLeftArm = 0;
      targetY = -0.12;
      showMessage(message, 0, { showExplore: true });
      scheduleIdle(3600);
    }
    function robotThink(message = 'Coba pikirkan konteks penggunaan: siapa penggunanya, apa tujuannya, dan di mana tugas berlangsung?') {
      guidedUntil = performance.now() + 5500;
      targetLeftArm = 2.1;
      targetRightArm = 0.25;
      showMessage(message);
      scheduleIdle(4200);
    }
    function robotExplain(target, message, pose = 'explain') {
      guidedUntil = performance.now() + 6000;
      targetX = 0;
      targetLeftArm = 0;
      targetRightArm = 0;
      if (target?.getBoundingClientRect) {
        const targetRect = target.getBoundingClientRect();
        const robotRect = container.getBoundingClientRect();
        const horizontal = targetRect.left + targetRect.width / 2 - (robotRect.left + robotRect.width / 2);
        const vertical = targetRect.top + targetRect.height / 2 - (robotRect.top + robotRect.height / 2);
        targetY = THREE.MathUtils.clamp(horizontal / Math.max(1, robotRect.width) * 0.85, -0.42, 0.42);
        if (pose === 'think') {
          targetLeftArm = 2.1;
          targetRightArm = 0.2;
        } else if (vertical < -80) {
          targetRightArm = 2.6;
        } else if (horizontal < -18) {
          targetLeftArm = -1.15;
        } else if (horizontal > 18) {
          targetRightArm = 1.15;
        } else {
          targetLeftArm = -0.72;
          targetRightArm = 0.72;
        }
      } else {
        targetLeftArm = -0.72;
        targetRightArm = 0.72;
      }
      showMessage(message);
      scheduleIdle(5200);
    }
    function handleResize() {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
    }
    function animate() {
      if (!isVisible) return;
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const motion = reducedMotion.matches ? 0.12 : 1;
      targetIntro += ((container.classList.contains('is-entering') ? 0 : 1) - targetIntro) * (reducedMotion.matches ? 0.12 : 0.045);
      robot.scale.setScalar(0.82 + targetIntro * 0.18);
      robot.position.y = -0.32 + targetIntro * 0.27 + Math.sin(time * 1.05) * 0.105 * motion;
      robot.rotation.x += (targetX + Math.sin(time * 0.55) * 0.018 * motion - robot.rotation.x) * 0.035;
      robot.rotation.y += (targetY + Math.sin(time * 0.42) * 0.035 * motion - robot.rotation.y) * 0.035;
      body.rotation.z = Math.sin(time * 0.72) * 0.018 * motion;
      body.scale.y = 1 + Math.sin(time * 0.9) * 0.012 * motion;
      head.rotation.z = Math.sin(time * 0.8) * 0.024 * motion;
      antenna.rotation.z = Math.sin(time * 1.1) * 0.07 * motion;
      leftArm.group.rotation.z += (targetLeftArm - leftArm.group.rotation.z) * 0.075;
      rightArm.group.rotation.z += (targetRightArm - rightArm.group.rotation.z) * 0.075;
      const pulse = 2.15 + (Math.sin(time * 1.7) + 1) * 0.42 * motion;
      materials.eye.emissiveIntensity = pulse;
      materials.led.emissiveIntensity = 1.8 + (Math.sin(time * 1.25) + 1) * 0.5;
      shadow.scale.setScalar(1 + Math.sin(time * 1.05) * 0.035);
      renderer.render(scene, camera);
    }
    const entranceTimer = window.setTimeout(() => container.classList.add('is-entering'), 80);
    window.setTimeout(() => {
      container.classList.remove('is-entering');
      // Keep the canvas visible after the entrance transition finishes.
      container.classList.add('is-ready');
    }, 1500);
    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !frameId) animate();
      if (!isVisible && frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    });
    visibilityObserver.observe(container);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    new ResizeObserver(handleResize).observe(container);
    handleResize();
    animate();
    window.usabilityRobot = {
      idle: robotIdle,
      welcome: robotWelcome,
      think: robotThink,
      explain: robotExplain,
      setContext: setActiveContext,
      openContext: toggleContextPrompt,
      showMessage,
      hideMessage
    };
  } catch (error) {
    console.error('Robot 3D IMKK gagal dimuat:', error);
    container.classList.add('robot-unavailable');
    container.setAttribute('aria-label', 'Visual robot 3D tidak tersedia pada browser ini.');
  }
}

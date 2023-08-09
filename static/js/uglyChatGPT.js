
// napisano razem z chatGPT. Obrzydliwie, ale niech będzie




import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(100, 50, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(20, 64, 64);
const sunTexture = textureLoader.load("static/assets/sun.jpg"); // Load the Sun's texture
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture, emissive: 0xffff00, emissiveIntensity: 10 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create a PointLight at the position of the Sun with higher intensity
const sunLight = new THREE.PointLight(0xffffaa, 100, 200, 2); // Color, Intensity, Distance, Decay
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Add HemisphereLight for subtle ambient lighting
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1); // Sky color, Ground color, Intensity
scene.add(hemisphereLight);

// Create the planets
const planetsData = [
  { name: "Mercury", size: 2, distance: 30, texture: "mercury.jpg" },
  { name: "Venus", size: 4, distance: 45, texture: "venus.jpg" },
  { name: "Earth", size: 4.5, distance: 60, texture: "earth.jpg" },
  { name: "Mars", size: 3, distance: 80, texture: "mars.jpg" },
  { name: "Jupiter", size: 15, distance: 120, texture: "jupiter.jpg" },
  { name: "Saturn", size: 12, distance: 160, texture: "saturn.jpg", ringTexture: "saturn_ring.png" },
  { name: "Uranus", size: 8, distance: 200, texture: "uranus.jpg", ringTexture: "uranus_ring.png" },
  { name: "Neptune", size: 7, distance: 240, texture: "neptune.jpg" },
];

const planets = [];

planetsData.forEach(planetData => {
  const planetGeometry = new THREE.SphereGeometry(planetData.size, 32, 32);
  const planetMaterial = new THREE.MeshPhongMaterial({ map: textureLoader.load(`static/assets/${planetData.texture}`) });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.position.set(planetData.distance, 0, 0);

  scene.add(planet);

  if (planetData.ringTexture) {
    const ringGeometry = new THREE.RingGeometry(planetData.size * 1.2, planetData.size * 2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(`static/assets/${planetData.ringTexture}`), side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    planet.add(ring);
    ring.rotation.x = THREE.MathUtils.degToRad(90);
  }

  planets.push(planet);
});

// Add light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

// Add stars background
const starsTexture = textureLoader.load("static/assets/stars.jpg");
const starsGeometry = new THREE.SphereGeometry(1000, 64, 64);
const starsMaterial = new THREE.MeshBasicMaterial({ map: starsTexture, side: THREE.BackSide });
const stars = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(stars);

// Define even slower rotation speeds for each planet (in radians per millisecond)
const rotationSpeeds = [
  0.002, // Mercury
  0.0015, // Venus
  0.0008, // Earth
  0.0006, // Mars
  0.0002, // Jupiter
  0.00015, // Saturn
  0.00012, // Uranus
  0.0001, // Neptune
];
// Animation
function animate() {
  const time = Date.now();

  planets.forEach((planet, index) => {
    const { distance } = planetsData[index];
    const rotationSpeed = rotationSpeeds[index];

    planet.rotation.y += rotationSpeed; // Planet self-rotation
    planet.position.x = distance * Math.cos(time * rotationSpeed);
    planet.position.z = distance * Math.sin(time * rotationSpeed);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();


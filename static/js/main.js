import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const planetsData = [
  { name: "Sun", texture: "static/assets/objects/sun.jpg", size: 15, position: 0, rotationSpeed: 0.004, orbitSpeed: 0, moons: 0 },
  { name: "Mercury", texture: "static/assets/objects/mercury.jpg", size: 3.2, position: 28, rotationSpeed: 0.004, orbitSpeed: 0.04, moons: 0 },
  { name: "Venus", texture: "static/assets/objects/venus.jpg", size: 5.8, position: 44, rotationSpeed: 0.002, orbitSpeed: 0.015, moons: 0 },
  { name: "Earth", texture: "static/assets/objects/earth.jpg", size: 6, position: 62, rotationSpeed: 0.02, orbitSpeed: 0.01, moons: 1 },
  { name: "Mars", texture: "static/assets/objects/mars.jpg", size: 4, position: 78, rotationSpeed: 0.018, orbitSpeed: 0.008, moons: 2 },
  { name: "Jupiter", texture: "static/assets/objects/jupiter.jpg", size: 12, position: 100, rotationSpeed: 0.04, orbitSpeed: 0.002, moons: 79 },
  {
    name: "Saturn",
    texture: "static/assets/objects/saturn.jpg",
    ringTexture: "static/assets/objects/saturn_ring.png",
    size: 10,
    position: 138,
    rotationSpeed: 0.038,
    orbitSpeed: 0.0009,
    innerRadius: 10,
    outerRadius: 20,
    moons: 83
  },
  {
    name: "Uranus",
    texture: "static/assets/objects/uranus.jpg",
    ringTexture: "static/assets/objects/uranus_ring.png",
    size: 7,
    position: 176,
    rotationSpeed: 0.032,
    orbitSpeed: 0.0004,
    innerRadius: 7,
    outerRadius: 12,
    moons: 27
  },
  { name: "Neptune", texture: "static/assets/objects/neptune.jpg", size: 7, position: 200, rotationSpeed: 0.032, orbitSpeed: 0.0001, moons: 14 }
];


const moonsData = [
  { name: "Moon", extendsPlanet: "Earth", texture: "static/assets/moons/earth/moon.jpg", size: 1.5, position: 68, rotationSpeed: 0.038, orbitSpeed: 0.01 },  
]


const otherSpaceData = [
  { name: "Stars", texture: "static/assets/objects/stars.jpg", size: "", position: ""  }, //0
]


//initializations
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();
const textureLoader = new THREE.TextureLoader();

//light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const spaceTexture = otherSpaceData[0].texture;
scene.background = cubeTextureLoader.load(Array(6).fill(spaceTexture));
const planets = [];
const moons = [];


//=======CREATING SOLAR SYSTEM ==========================================================================
function createPlanet(planetData) {
  const { size, texture, position, ringTexture, innerRadius, outerRadius, name } = planetData;
  const geo = new THREE.SphereGeometry(parseFloat(size), 30, 30);
  let mat;

  if (name === "Sun") {
    mat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(texture),
      emissive: 0xffffff,
      emissiveIntensity: 2,
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(texture),
    });
  }

  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();

  if (ringTexture) {
    const ringGeo = new THREE.RingGeometry(
      parseFloat(innerRadius),
      parseFloat(outerRadius),
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ringTexture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = parseFloat(position);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  obj.add(mesh);
  scene.add(obj);
  mesh.position.x = parseFloat(position);

  planetData.mesh = mesh;
  planetData.obj = obj;
  obj.name = name;
  return { mesh, obj };
}


// -------------------------------------------------------
function createMoon(moonData, planets) {
  const { name, texture, size, position, extendsPlanet } = moonData;
  // Find the planet the Moon extends from
  const planet = planets.find((data) => data.obj.name === extendsPlanet);

  if (!planet) {
    console.error(`Cannot find the planet "${extendsPlanet}" to extend from.`);
    return;
  }
  // Create the Moon mesh
  const moonGeo = new THREE.SphereGeometry(parseFloat(size), 30, 30);
  const moonMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(moonGeo, moonMat);

  // Create a container for the Moon
  const obj = new THREE.Object3D();
  obj.add(mesh);
  

  // Set the position of the Moon relative to the planet
  obj.position.set(parseFloat(position), 10, 0);
  planet.obj.add(obj); // Add the Moon to the planet
  // Store the Moon data in the planet object for future reference if needed
  planet.moons = planet.moons || [];
  planet.moons.push({ name, obj: obj });

  moonData.mesh = mesh;
  moonData.obj = obj;
  obj.name = name;

  return { mesh: mesh, obj: obj };
}

createSolarSystem();


function createSolarSystem(){

  // Loop through the planetsData array and create all the planets
  for (const planetData of planetsData) {
    const planet = createPlanet(planetData);
    planet.name = planetData.name;
    planets.push(planet);
  }
 
  for (const moonData of moonsData) {
    const moon = createMoon(moonData, planets);
    moon.name = moonData.name;
    moons.push(moon);
  }

}



// ANIMATE========LISTENERS=========================================================
//initializations and other code...

// Add a global flag for controlling animation
let animationPaused = false;

// ANIMATE========LISTENERS=========PAUSE================================

function animate() {
  if (!animationPaused) {
    for (const planetData of planetsData) {
      if (planetData.mesh) {
        planetData.mesh.rotateY(planetData.rotationSpeed);
        planetData.obj.rotateY(planetData.orbitSpeed);
      }
    }

    for (const moonData of moonsData) {
      if (moonData.mesh) {
        moonData.mesh.rotateY(moonData.rotationSpeed);
        const planet = planets.find((data) => data.obj.name === moonData.extendsPlanet);
        if (planet) {
          moonData.obj.rotateY(moonData.orbitSpeed);
        }
      }
    }
  }

  renderer.render(scene, camera);
}

// Set up animation loop
renderer.setAnimationLoop(animate);

// Event listener for the stopButton
const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", () => {
  animationPaused = !animationPaused; // Toggle animationPaused flag
});



window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.domElement.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
  // Calculate the mouse position relative to the canvas
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set up the raycaster from the camera to the mouse position
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Get the list of objects that intersect with the raycaster
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Check if any planet or moon is one of the intersected objects
  let clickedObject;
  for (let i = 0; i < intersects.length; i++) {
    const intersectedObject = intersects[i].object;
    const planet = planets.find((data) => data.mesh === intersectedObject);
    if (planet) {
      clickedObject = planet;
      break;
    } else {
      const moon = moons.find((data) => data.mesh === intersectedObject);
      if (moon) {
        clickedObject = moon;
        break;
      }
    }
  }

  if (clickedObject) {
    console.log("Clicked on an object:", clickedObject.name);
    // Redirect to the new site with the clicked object name as a URL parameter
    location.replace(`/redirect?object=${clickedObject.name}`);
  } else {
    console.log("There is no such object.");
  }
}


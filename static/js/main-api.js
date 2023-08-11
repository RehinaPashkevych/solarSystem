import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const objectsTexture = [
  { name: "Stars", texture: "static/assets/objects/stars.jpg",},
  { name: "Moon", texture: "static/assets/moons/earth/moon.jpg",},
  { name: "Sun", texture: "static/assets/objects/sun.jpg" },
  { name: "Mercury", texture: "static/assets/objects/mercury.jpg" },
  { name: "Venus", texture: "static/assets/objects/venus.jpg" },
  { name: "Earth", texture: "static/assets/objects/earth.jpg" },
  { name: "Mars", texture: "static/assets/objects/mars.jpg" },
  { name: "Jupiter", texture: "static/assets/objects/jupiter.jpg" },
  {
    name: "Saturn",
    texture: "static/assets/objects/saturn.jpg",
    ringTexture: "static/assets/objects/saturn_ring.png"
  },
  {
    name: "Uranus",
    texture: "static/assets/objects/uranus.jpg",
    ringTexture: "static/assets/objects/uranus_ring.png"
  },
  { name: "Neptune", texture: "static/assets/objects/neptune.jpg" }
];

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
const spaceTexture = objectsTexture[0].texture;
scene.background = cubeTextureLoader.load(Array(6).fill(spaceTexture));
const planets = [];
const moons = [];


let planetsData = [];
let moonsData = [];

window.addEventListener('DOMContentLoaded', () => {
  const planetsDataElements = document.querySelectorAll('.planet');


  planetsDataElements.forEach(planetDataElement => {
    const planetName = planetDataElement.dataset.name;
    const planetData = {
      name: planetName,
      size: parseFloat(planetDataElement.dataset.size),
      position: parseFloat(planetDataElement.dataset.position),
      rotationSpeed: parseFloat(planetDataElement.dataset.rotationSpeed),
      orbitSpeed: parseFloat(planetDataElement.dataset.orbitSpeed),
      moons: parseInt(planetDataElement.dataset.moons),
      innerRadius: planetDataElement.dataset.innerRadius
        ? parseFloat(planetDataElement.dataset.innerRadius)
        : null,
      outerRadius: planetDataElement.dataset.outerRadius
        ? parseFloat(planetDataElement.dataset.outerRadius)
        : null
    };
    planetsData.push(planetData);
  });

const moonsDataElements = document.querySelectorAll('.moon');

moonsDataElements.forEach(moonDataElement => {
  const moonName = moonDataElement.dataset.name;
  const moonData = {
    name: moonName,
    extendsPlanet: moonDataElement.dataset.extendsPlanet,
    size: parseFloat(moonDataElement.dataset.size),
    position: parseFloat(moonDataElement.dataset.position),
    rotationSpeed: parseFloat(moonDataElement.dataset.rotationSpeed),
    orbitSpeed: parseFloat(moonDataElement.dataset.orbitSpeed),
    id_planet: parseInt(moonDataElement.dataset.idPlanet)
  };
  moonsData.push(moonData);
});


//=======CREATING SOLAR SYSTEM ==========================================================================
function createPlanet(planetData) {
  const { size, position, innerRadius, outerRadius, name } = planetData;
  const geo = new THREE.SphereGeometry(parseFloat(size), 30, 30);
  let mat;

  const planetTextureData = objectsTexture.find((textureData) => textureData.name === name);
  if (!planetTextureData) {
    console.error(`No texture data found for planet: ${name}`);
    return null;
  }

  const { texture, ringTexture } = planetTextureData;

  if (name === "Sun") {
    mat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(texture),

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

  // Create an empty BufferGeometry
  const orbitPathGeometry = new THREE.BufferGeometry();
  // Calculate number of segments for the orbit path
  const segments =720;
  // Create arrays to hold the positions of the orbit path points
  const positions = new Float32Array(segments * 3);
  // Fill the positions array with points along a circle
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = planetData.position * Math.cos(angle);
    const z = planetData.position * Math.sin(angle);
  
    positions[i * 3] = x;
    positions[i * 3 + 1] = 0; // Y position
    positions[i * 3 + 2] = z;
  }
  // Set the positions as an attribute of the geometry
  orbitPathGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // Create a LineSegments object for the orbit path
  const orbitPathMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4});
  const orbitPath = new THREE.LineSegments(orbitPathGeometry, orbitPathMaterial);
  
  // Add the orbit path to the scene
  scene.add(orbitPath);

  planetData.orbitPath = orbitPath;

  planetData.mesh = mesh;
  planetData.obj = obj;
  obj.name = name;
  return { mesh, obj };
}


// -------------------------------------------------------
async function createMoon(moonData, planets) {
  const { name,  position, extendsPlanet } = moonData;
  const size = 1.5;
  // Find the planet the Moon extends from
  const planet = planets.find((data) => data.obj.name === extendsPlanet);

  // Find the texture data for the Moon
  const textureData = objectsTexture.find((textureData) => textureData.name === name);
  if (!textureData) {
    console.error(`No texture data found for planet: ${name}`);
    return null;
  }

  if (!planet) {
    console.error(`Cannot find the planet "${extendsPlanet}" to extend from.`);
    return null;
  }

  // Load the Moon texture
  const moonTexture = await new Promise((resolve, reject) => {
    textureLoader.load(textureData.texture, resolve, undefined, reject);
  });

  // Create the Moon mesh
  const moonGeo = new THREE.SphereGeometry(parseFloat(size), 30, 30);
  const moonMat = new THREE.MeshStandardMaterial({
    map: moonTexture,
  });
  const mesh = new THREE.Mesh(moonGeo, moonMat);

  // Create a container for the Moon
  const obj = new THREE.Object3D();
  obj.add(mesh);

  // Set the position of the Moon relative to the planet
  obj.position.set(planet.mesh.position.x, 0, 0);
  planet.obj.add(obj); // Add the Moon to the planet

  // Store the Moon data in the planet object for future reference if needed
  planet.moons = planet.moons || [];
  planet.moons.push({ name, obj: obj });

  mesh.position.x =  position ;

  moonData.mesh = mesh;
  moonData.obj = obj;
  obj.name = name;

  return { mesh: mesh, obj: obj };
}

createSolarSystem();

async function createSolarSystem() {
  for (const planetName in planetsData) {
    const planetData = planetsData[planetName];
    const planet = createPlanet(planetData);
    planet.name = planetData.name;
    planets.push(planet);
  }

  for (const moonData of moonsData) {
    const moon = await createMoon(moonData, planets);
    moon.name = moonData.name;
    moons.push(moon);
  }
}


// ANIMATE========LISTENERS=========PAUSE================================

// Add a global flag for controlling animation
let animationPaused = false;

function animate() {
  if (!animationPaused) {
    for (const planetData of planetsData) {
      if (planetData.mesh) {
        planetData.mesh.rotateY(planetData.rotationSpeed);
        planetData.obj.rotateY(planetData.orbitSpeed);
      }
    }

   // for (const moonData of moonsData) {
    const moonData = moonsData[0];
      if (moonData.mesh) {
        moonData.mesh.rotateY(moonData.rotationSpeed);
        const planet = planetsData.find((data) => data.obj.name === moonData.extendsPlanet);
        if (planet) {
          moonData.obj.rotateY(moonData.orbitSpeed);
        }
      }
  //  }
  
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
      console.log(moons);
      if (moon) {
        clickedObject = moon;
        break;
      }
    }
  }



  if (clickedObject) {
    console.log("Clicked on an object:", clickedObject.name);
    // Redirect to the new site with the clicked object name as a URL parameter
    location.replace(`/redirectAPI?object=${clickedObject.name}`);
  } else {
    console.log("There is no such object.");
  }
}


});



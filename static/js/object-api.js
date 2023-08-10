import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

//=========================URL==============================================================
// Function to get the value of a specific URL parameter
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get the value of the 'object' parameter from the URL
const clickedObjectName = getURLParameter('object');
document.title = clickedObjectName;

// Constants
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('planetCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(39, 0, 100);
const textureLoader = new THREE.TextureLoader();

// Light setup
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(-100, 200, 50);
scene.add(directionalLight);

// Initialize planets and moons
let planetsData = [];
let moonsData = [];

// Find the clicked object data based on the clickedObjectName
let clickedObjectData;
let clickedObject; // Initialize clickedObject

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

//===========================================================================================================================================

function initializePlanetsAndMoons() {
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
      description: planetDataElement.dataset.description,
      history: planetDataElement.dataset.history

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
  clickedObjectData = findPlanetData(clickedObjectName) || findMoonData(clickedObjectName);


   if (clickedObjectData) {
     // Create and display the clicked object
     clickedObject=createPlanet(clickedObjectData);
     handleObjectClick(clickedObjectName);
   } else {
     console.error(`No data found for "${clickedObjectName}".`);
   }
}


function createPlanet(planetData) {
  const { name } = planetData;
  const size = 20; 
  const textureData = objectsTexture.find((item) => item.name === name);
  if (!textureData) {
    console.error(`Texture data not found for planet: ${name}`);
    return;
  }

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(textureData.texture),
  });

  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();

  if (textureData.ringTexture) {
    const outerRadius = size * 1.5; 
    const innerRadius = outerRadius * 0.8; 

    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(textureData.ringTexture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);

    ringMat.map.onload = () => console.log("Ring texture loaded successfully.");

    ringMesh.position.x = 0;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  obj.add(mesh);
  scene.add(obj);
  mesh.position.x = 0;

  planetData.mesh = mesh;
  planetData.obj = obj;
  obj.name = name;

  console.log("The planet is created: " + name);
  console.log(planetData.moons);

  // Find moons that extend from this planet
  const moonsForPlanet = moonsData.filter(moonData => moonData.extendsPlanet === planetData.name);

  // Create and rotate moons around this planet
  moonsForPlanet.forEach(moonData => {
 //   const moon = createMoon(moonData); // Pass planetsData here
 //   moon.name = moonData.name;
 //   moon.obj.rotateY(moonData.orbitSpeed); // Rotate moon around planet
 //   moonData.obj = moon.obj; // Store moon object reference
  });


  return { mesh, obj };
}


 //----------------------------------------------------------------------------------------------------------------0000000000

function createMoon(moonData) {
  const { name, extendsPlanet } = moonData;

  const size = 5;
  const position = 20;
  
  // Find the planet the Moon extends from
  const planet = planetsData.find((data) => data.name === extendsPlanet);

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

  const moonTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load(textureData.texture),
  });

  // Create the Moon mesh
  const moonGeo = new THREE.SphereGeometry(size, 30, 30);
  const moonMat = new THREE.MeshStandardMaterial({
    map: moonTexture,
  });
  const mesh = new THREE.Mesh(moonGeo, moonMat);

  // Create a container for the Moon
  const obj = new THREE.Object3D();
  obj.add(mesh);
  scene.add(obj);

  // Set the position of the Moon relative to the planet
  obj.position.set(position, 20, 0);
  planet.obj.add(obj); // Add the Moon to the planet

  // Store the Moon data in the planet object for future reference if needed
  planet.moons = planet.moons || [];
  //planet.moons.push({ name, obj: obj });

  moonData.mesh = mesh;
  moonData.obj = obj;
  obj.name = name;
  console.log("creating a moon: " + name);

  return { mesh: mesh, obj: obj };
}



// Animation function
function animate() {
  requestAnimationFrame(animate);
  const constantRotationSpeed = 0.0024; 

  if (clickedObject ) {
    clickedObject.mesh.rotation.y += constantRotationSpeed;
  }
  
  // Render the scene
  renderer.render(scene, camera);
}


// Function to find planet data
function findPlanetData(name) {
  return planetsData.find(planet => planet.name === name);
}

// Function to find moon data
function findMoonData(name) {
  return moonsData.find(moon => moon.name === name);
}

// Handle planet/moon clicks
function handleObjectClick(clickedObjectName) {
  const planetInfoContainer = document.getElementById('planetInfoContainer');
  const clickedObjectData = findPlanetData(clickedObjectName) || findMoonData(clickedObjectName); // Use planetData or moonData


  // If the clicked object data doesn't exist in planetsData, check in moonsData
  if (!clickedObjectData) {
    const moonData = findMoonData(clickedObjectName);
    if (moonData) {
      const planetInfoElement = createMoonInfoElement(moonData);
      planetInfoContainer.appendChild(planetInfoElement);
    } else {
      console.error(`No data found for "${clickedObjectName}".`);
    }
  } else {
    // If the clicked object data exists, create and append the planet information
    const planetInfoElement = createPlanetInfoElement(clickedObjectData);
    planetInfoContainer.appendChild(planetInfoElement);

    // If the clicked object is a planet and has moons, display information about its moons
    if (clickedObjectData.moons && clickedObjectData.moons.length > 0) {
      const moonsContainer = document.createElement('div');
      moonsContainer.classList.add('moons-container');

      const moonsTitle = document.createElement('div');
      moonsTitle.classList.add('moons-title');
      moonsTitle.textContent = "Moons:";

      moonsContainer.appendChild(moonsTitle);

      clickedObjectData.moons.forEach((moonName) => {
        const moonData = findMoonData(moonName);
        if (moonData) {
          const moonInfoElement = createPlanetInfoElement(moonData);
          moonsContainer.appendChild(moonInfoElement);
        } else {
          console.error(`No data found for "${moonName}" moon.`);
        }
      });

      planetInfoContainer.appendChild(moonsContainer);
    }
  }
}

function createPlanetInfoElement(planetData) {
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('planet-info');

  const nameElement = document.createElement('div');
  nameElement.classList.add('planet-name');
  nameElement.textContent = planetData.name;

  const descriptionElement = document.createElement('div');
  descriptionElement.classList.add('planet-description');
  descriptionElement.textContent = planetData.description;

  const propertiesElement = document.createElement('div');
  propertiesElement.classList.add('planet-properties');
  propertiesElement.innerHTML = `
      <strong>Diameter:</strong> ${planetData.size} km<br>
      <strong>Distance from Sun:</strong> ${planetData.position} million km<br>
      <strong>Rotation Speed:</strong> ${planetData.rotationSpeed} days<br>
      <strong>Orbit Speed:</strong> ${planetData.orbitSpeed} km/s<br>
      <strong>Moons:</strong> ${planetData.moons}<br>
      <strong>History:</strong> ${planetData.history}
  `;

  infoContainer.appendChild(nameElement);
  infoContainer.appendChild(descriptionElement);
  infoContainer.appendChild(propertiesElement);

  return infoContainer;
}

// Wait for DOM content to load before initializing
document.addEventListener('DOMContentLoaded', () => {
  initializePlanetsAndMoons();
  animate();

  const backButton = document.getElementById("backButton");
  // Handle clicks on planets/moons
  backButton.addEventListener('click', event => {
    // Navigate back to the previous page using the browser's history
    location.replace(`/api`);
  });
});


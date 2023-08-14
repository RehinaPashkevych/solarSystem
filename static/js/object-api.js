import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

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
//document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(59, 5, 100);
const textureLoader = new THREE.TextureLoader();
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

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

let hasMoons = false;
let moonsOfClickObject = [];


const objectsTexture = [
  { name: "Stars", texture: "static/assets/objects/stars.jpg",},
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
  { name: "Moon", texture: "static/assets/moons/earth/moon.jpg",},
  { name: "Neptune", texture: "static/assets/objects/neptune.jpg" },
  { name: "Amaltea", texture: "static/assets/moons/jupiter/amaltea.jpg" }, // Jupiter`s sattelite
  { name: "Europa", texture: "static/assets/moons/jupiter/europa.jpg" },     // Jupiter`s sattelite
  { name: "Ganymede", texture: "static/assets/moons/jupiter/ganymede.jpg" },// Jupiter`s sattelite
  { name: "Callisto", texture: "static/assets/moons/jupiter/callisto.png" },// Jupiter`s sattelite
  { name: "Io", texture: "static/assets/moons/jupiter/io.jpg" },           // Jupiter`s sattelite

  { name: "Deimos", texture: "static/assets/moons/mars/deimos.png" },       //Mars sattelite
  { name: "Phobos", texture: "static/assets/moons/mars/phobos.jpg" },      //Mars sattelite

  { name: "Nereida", texture: "static/assets/moons/neptune/nereida.jpg" }, //Neptune sattelite
  { name: "Triton", texture: "static/assets/moons/neptune/triton.jpg" },    //Neptune sattelite

  { name: "Dione", texture: "static/assets/moons/saturn/dione.jpeg" }, //saturn sattelite
  { name: "Iapetus", texture: "static/assets/moons/saturn/iapetus.jpg" }, //saturn sattelite
  { name: "Mimas", texture: "static/assets/moons/saturn/mimas.png" }, //saturn sattelite
  { name: "Rhea", texture: "static/assets/moons/saturn/rhea.jpg" }, //saturn sattelite
  { name: "Titan", texture: "static/assets/moons/saturn/titan.jpg" }, //saturn sattelite

  { name: "Ariel", texture: "static/assets/moons/uranus/ariel.jpg" }, //Uranus sattelite
  { name: "Miranda", texture: "static/assets/moons/uranus/miranda.jpg" }, //Uranus sattelite
  { name: "Oberon", texture: "static/assets/moons/uranus/oberon.jpg" }, //Uranus sattelite
  { name: "Titania", texture: "static/assets/moons/uranus/titania.jpg" }, //Uranus sattelite
  { name: "Umbriel", texture: "static/assets/moons/uranus/umbriel.jpg" } //Uranus sattelite
];

//===========================================================================================================================================

function initializePlanetsAndMoons() {
  const planetsDataElements = document.querySelectorAll('.planet');

  planetsDataElements.forEach(planetDataElement => {
    const planetName = planetDataElement.dataset.name;
    const planetData = {
      name: planetName,
      sizeOriginal: parseFloat(planetDataElement.dataset.size),
      positionOriginal: parseFloat(planetDataElement.dataset.position),
      rotationSpeed: parseFloat(planetDataElement.dataset.rotationSpeed),
      orbitSpeed: parseFloat(planetDataElement.dataset.orbitSpeed),
      moons: parseInt(planetDataElement.dataset.moons),
      description: planetDataElement.dataset.description,
      history: planetDataElement.dataset.history

    };
    
  if (planetData.name === "Jupiter" || planetData.name === "Saturn" || planetData.name === "Uranus" || planetData.name === "Neptune") {
    planetData.notes = "You see only the 5 largest moons for the planet.";
  }
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
      positionOriginal: parseFloat(moonDataElement.dataset.positionOriginal),
      sizeOriginal: parseFloat(moonDataElement.dataset.sizeOriginal),
      rotationSpeed:parseFloat(moonDataElement.dataset.rotationSpeed),
      orbitSpeed: parseFloat(moonDataElement.dataset.orbitSpeed),
      rotationSpeedOriginal: parseFloat(moonDataElement.dataset.rotationOriginal),
      orbitSpeedOriginal: parseFloat(moonDataElement.dataset.orbitOriginal),
      id_planet: parseInt(moonDataElement.dataset.idPlanet),
      history: moonDataElement.dataset.history,
      description: moonDataElement.dataset.description
    };
    moonsData.push(moonData);
  });
  clickedObjectData = findPlanetData(clickedObjectName) || findMoonData(clickedObjectName);


  if (clickedObjectData) {
    clickedObject = createPlanet(clickedObjectData);

    if (hasMoons) {
      const moonsOfPlanet = moonsData.filter(moon => moon.extendsPlanet === clickedObjectName);
      moonsOfPlanet.forEach(moon => {
        if (moon) {
          createMoon(moon, clickedObject); // Pass the parent planet to createMoon
        }
      });     
    }
    handleObjectClick(clickedObjectName);
  } 
  else {
    console.error(`No data found for "${clickedObjectName}".`);
  }
}


function createPlanet(planetData) {
  const { name, moons } = planetData;
  const size =30;
  const position=-40;
  const outerRadius = size * 1.8;
  const innerRadius = size * 1.4;

  if(moons){
    hasMoons =true;
  }

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
      64
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


 //----------------------------------------------------------------------------------------------------------------0000000000

function createMoon(moonData, parentPlanet) {
  const {size, position, name} = moonData;
 
  const moonTextureData = objectsTexture.find(textureData => textureData.name === name);
  if (!moonTextureData) {
    console.error(`No texture data found for moon.`);
    return null;
  }

  const moonTexture = textureLoader.load(moonTextureData.texture);
  const moonGeometry = new THREE.SphereGeometry(size, 30, 30);
  const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.set(parentPlanet.mesh.position.x, 0, 0);
  moonOrbit.add(moonMesh);
  parentPlanet.obj.add(moonOrbit); // Add moon's orbit as a child of the parent planet's orbit
  moonMesh.position.x = parentPlanet.mesh.position.x - position; // Add parent planet's x position
  moonData.mesh = moonMesh;
  moonData.orbit = moonOrbit;

  moonsOfClickObject.push(moonData);
  return { moonMesh, moonOrbit };
}


// Animation function
function animate() {
  requestAnimationFrame(animate);
  const constantRotationSpeed = 0.0024; 

  if (clickedObject) {
    clickedObject.mesh.rotation.y += constantRotationSpeed;
    console.log( );
    if (clickedObjectData.moons ) {
      for (const moon of moonsOfClickObject) {
        moon.mesh.rotateY(moon.rotationSpeed);
        moon.orbit.rotation.y += moon.orbitSpeed;
      }
    } 
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
  const clickedObjectData = findPlanetData(clickedObjectName) || findMoonData(clickedObjectName);
  const planetInfoElement = createInfoElement(clickedObjectData);
  planetInfoContainer.appendChild(planetInfoElement);
}

function createInfoElement(data) {
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-element');

  const nameElement = createElementWithClass('div', 'name', data.name);
  const descriptionElement = createElementWithClass('div', 'description', data.description);
  const propertiesElement = createPropertiesElement(data);
  const note =createElementWithClass('div', 'note', data.notes);

  infoContainer.appendChild(nameElement);
  infoContainer.appendChild(descriptionElement);
  infoContainer.appendChild(propertiesElement);
  infoContainer.appendChild(note);

  return infoContainer;
}

function createPropertiesElement(data) {
  const propertiesElement = createElementWithClass('div', 'properties');

  addProperty(propertiesElement, 'Diameter', data.sizeOriginal, 'km');
  addProperty(propertiesElement, 'Distance from Sun', data.positionOriginal, 'million km');
  addProperty(propertiesElement, 'Rotation Speed', data.rotationSpeedOriginal, 'days');
  addProperty(propertiesElement, 'Orbit Speed', data.orbitSpeedOriginal, 'km/s');
  //if (data.moons  > 0) {
    const moonsLink = document.createElement('a');
    moonsLink.textContent = `Moons: ${data.moons}`;
      // Apply lighter blue color to the link
    moonsLink.style.color = "#7039e6";
    moonsLink.addEventListener('click', event => {
      location.replace(`/moons?planet=${clickedObjectName}`);
    });
    propertiesElement.appendChild(moonsLink);
 // }
  addProperty(propertiesElement, 'History', data.history);

  return propertiesElement;
}



function createElementWithClass(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function addProperty(parentElement, label, value, unit) {
  if (value !== undefined) {
    const propertyElement = createElementWithClass('div', 'property');
    propertyElement.innerHTML = `<strong>${label}:</strong> ${value} ${unit || ''}<br>`;
    parentElement.appendChild(propertyElement);
  }
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


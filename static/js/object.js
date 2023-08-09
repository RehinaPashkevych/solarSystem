import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { originalMoonsData } from './bd.js';
import { originalPlanetsData } from './bd.js';

//=========================URL==============================================================

// Function to get the value of a specific URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the value of the 'object' parameter from the URL
const clickedObjectName = getURLParameter('object');
document.title = clickedObjectName;


//===================initializations================================================s
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('planetCanvas') });
renderer.setSize(window.innerWidth , window.innerHeight);
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

function createPlanet(planetData) {
  const { name, texture, ringTexture, outerRadius, innerRadius } = planetData;
  const size = 20; // Scale down the size for better visualization

  // Create the planet's geometry
  const geo = new THREE.SphereGeometry(size, 30, 30);

  // Create the planet's material
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });

  // Create the planet's mesh
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  
  if (ringTexture) {
    const ringGeo = new THREE.RingGeometry(
      parseFloat(innerRadius / 1000),
      parseFloat(outerRadius / 1000),
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ringTexture),
      //side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);

    ringMat.map.onload = () => console.log("Ring texture loaded successfully.");

    ringMesh.position.x = 0;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  obj.add(mesh);
  scene.add(obj);
  mesh.position.x = 0; // Set x position to 0

  planetData.mesh = mesh;
  planetData.obj = obj;
  obj.name = name;

  console.log("the planet is created: " + name);
  return { mesh, obj };
}

/*
function createMoon(moonData) {
    const { name, texture, size, position } = moonData;

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
    obj.position.set(parseFloat(position), 20, 0);
    // Store the Moon data in the planet object for future reference if needed
    moonData.mesh = mesh;
    moonData.obj = obj;
    obj.name = name;

    console.log("created " + name);

    return { mesh: mesh, obj: obj };
}*/

const clickedObjectData = findPlanetData(clickedObjectName);

let clickedObject;

if (clickedObjectData) {
  clickedObject = createPlanet(clickedObjectData);
} else {
  const moonData = findMoonData(clickedObjectName);
  if (moonData) {
    clickedObject = createPlanet(moonData);
  } else {
    console.error(`No data found for "${clickedObjectName}".`);
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (clickedObject && clickedObject.mesh && clickedObjectData) {
    const adjustedRotationSpeed = (24 / clickedObjectData.rotationSpeed) * 0.001;
    clickedObject.mesh.rotateY(adjustedRotationSpeed);
  }
  renderer.render(scene, camera);
}

animate();



document.addEventListener("DOMContentLoaded", function() {
    // Find the back button by its ID
    const backButton = document.getElementById("backButton");

    // Add a click event listener to the button
    backButton.addEventListener("click", function() {
        // Navigate back to the previous page using the browser's history
        location.replace(`/`);
    });
});

//====================DESCRIPTION OF THE PLANETS===============================================================
 
// Function to create the planet information HTML elements
function findPlanetData(name) {
      return originalPlanetsData.find((planet) => planet.name === name);
}

function findMoonData(name) {
  return originalMoonsData.find((moon) => moon.name === name);
}


document.addEventListener("DOMContentLoaded", function() {

  const planetInfoContainer = document.getElementById('planetInfoContainer');
  const clickedObjectData = findPlanetData(clickedObjectName);

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
});



// Function to create the planet information HTML elements
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
      <strong>Diameter:</strong> ${planetData.diameter} km<br>
      <strong>Distance from Sun:</strong> ${planetData.distanceFromSun} million km<br>
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

// Function to create the moon information HTML elements
function createMoonInfoElement(moonData) {
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('planet-info');

  const nameElement = document.createElement('div');
  nameElement.classList.add('planet-name');
  nameElement.textContent = moonData.name;

  const descriptionElement = document.createElement('div');
  descriptionElement.classList.add('planet-description');
  descriptionElement.textContent = moonData.description;

  const propertiesElement = document.createElement('div');
  propertiesElement.classList.add('planet-properties');
  propertiesElement.innerHTML = `
      <strong>Extends Planet:</strong> ${moonData.extendsPlanet}<br>
      <strong>Size:</strong> ${moonData.size} km<br>
      <strong>Position from Planet:</strong> ${moonData.position} million km<br>
      <strong>Rotation Speed:</strong> ${moonData.rotationSpeed} days<br>
      <strong>Orbit Speed:</strong> ${moonData.orbitSpeed} km/s<br>
      <strong>History:</strong> ${moonData.history}
  `;

  infoContainer.appendChild(nameElement);
  infoContainer.appendChild(descriptionElement);
  infoContainer.appendChild(propertiesElement);

  return infoContainer;
}


// Show the planet info container on page load
window.addEventListener('DOMContentLoaded', function() {
  const planetInfoContainer = document.getElementById('planetInfoContainer');
  planetInfoContainer.classList.add('show');
});

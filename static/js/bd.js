const originalMoonsData = [
    {
      name: "Moon",
      extendsPlanet: "Earth",
      texture: "static/assets/moons/earth/moon.jpg",
      size: 1.5, // km
      position: 68, // million km
      rotationSpeed: 0.038, // days
      orbitSpeed: 0.01, // km/s
      description: "The Moon is Earth's only natural satellite.",
      history: "It has been a source of fascination and inspiration for humanity throughout history.",
    },
    {
      name: "Phobos",
      extendsPlanet: "Mars",
      texture: "static/assets/phobos.jpg",
      size: 0.3, // km
      position: 9.4, // million km
      rotationSpeed: 0.318, // days
      orbitSpeed: 2.138, // km/s
      description: "Phobos is one of Mars' two moons and is the larger and closer one.",
      history: "It was discovered by Asaph Hall in 1877 and named after the Greek god Phobos.",
    },
    {
      name: "Deimos",
      extendsPlanet: "Mars",
      texture: "static/assets/deimos.jpg",
      size: 0.2, // km
      position: 23.5, // million km
      rotationSpeed: 1.263, // days
      orbitSpeed: 1.351, // km/s
      description: "Deimos is the smaller and outermost of Mars' two moons.",
      history: "It was discovered by Asaph Hall in 1877 and named after the Greek god Deimos.",
    },
    {
      name: "Ganymede",
      extendsPlanet: "Jupiter",
      texture: "static/assets/ganymede.jpg",
      size: 5.3, // km
      position: 1070, // million km
      rotationSpeed: 7.15, // days
      orbitSpeed: 10.88, // km/s
      description: "Ganymede is the largest moon in the Solar System and orbits Jupiter.",
      history: "It was discovered by Galileo Galilei in 1610 and is named after the mythological figure Ganymede.",
    },
    {
      name: "Callisto",
      extendsPlanet: "Jupiter",
      texture: "static/assets/callisto.jpg",
      size: 4.8, // km
      position: 1883, // million km
      rotationSpeed: 16.7, // days
      orbitSpeed: 8.20, // km/s
      description: "Callisto is one of the four Galilean moons of Jupiter.",
      history: "It was discovered by Galileo Galilei in 1610 and is named after a nymph from Greek mythology.",
    },
    {
      name: "Io",
      extendsPlanet: "Jupiter",
      texture: "static/assets/io.jpg",
      size: 3.6, // km
      position: 421, // million km
      rotationSpeed: 1.77, // days
      orbitSpeed: 17.34, // km/s
      description: "Io is the innermost of the four Galilean moons of Jupiter.",
      history: "It was discovered by Galileo Galilei in 1610 and is named after a priestess of Hera in Greek mythology.",
    },
    {
      name: "Europa",
      extendsPlanet: "Jupiter",
      texture: "static/assets/europa.jpg",
      size: 3.1, // km
      position: 671, // million km
      rotationSpeed: 3.55, // days
      orbitSpeed: 13.74, // km/s
      description: "Europa is one of the four Galilean moons of Jupiter.",
      history: "It was discovered by Galileo Galilei in 1610 and is named after a Phoenician princess in Greek mythology.",
    },
    {
      name: "Titan",
      extendsPlanet: "Saturn",
      texture: "static/assets/titan.jpg",
      size: 5.1, // km
      position: 1221, // million km
      rotationSpeed: 15.95, // days
      orbitSpeed: 5.57, // km/s
      description: "Titan is the largest moon of Saturn and the second-largest moon in the Solar System.",
      history: "It was discovered by Christiaan Huygens in 1655 and is named after the Titans of Greek mythology.",
    },
    
    
    {
        name: "Mimas",
        extendsPlanet: "Saturn",
        texture: "static/assets/mimas.jpg",
        size: 0.4, // km
        position: 185.5, // million km
        rotationSpeed: 0.942, // days
        orbitSpeed: 14.32, // km/s
        description: "Mimas is one of Saturn's major moons and is known for its large impact crater.",
        history: "It was discovered by William Herschel in 1789 and is named after a giant in Greek mythology.",
      },
      {
        name: "Enceladus",
        extendsPlanet: "Saturn",
        texture: "static/assets/enceladus.jpg",
        size: 0.5, // km
        position: 237.9, // million km
        rotationSpeed: 1.37, // days
        orbitSpeed: 12.57, // km/s
        description: "Enceladus is another major moon of Saturn and is known for its subsurface ocean.",
        history: "It was discovered by William Herschel in 1789 and is named after a giant in Greek mythology.",
      },
      {
        name: "Tethys",
        extendsPlanet: "Saturn",
        texture: "static/assets/tethys.jpg",
        size: 1.1, // km
        position: 294.7, // million km
        rotationSpeed: 1.89, // days
        orbitSpeed: 11.35, // km/s
        description: "Tethys is a medium-sized moon of Saturn and has a large impact crater called Odysseus.",
        history: "It was discovered by Giovanni Cassini in 1684 and is named after a titaness in Greek mythology.",
      },
      {
        name: "Dione",
        extendsPlanet: "Saturn",
        texture: "static/assets/dione.jpg",
        size: 1.1, // km
        position: 377.4, // million km
        rotationSpeed: 2.74, // days
        orbitSpeed: 10.03, // km/s
        description: "Dione is another medium-sized moon of Saturn with bright icy cliffs called 'wispy terrain'.",
        history: "It was discovered by Giovanni Cassini in 1684 and is named after a titaness in Greek mythology.",
      },
      {
        name: "Rhea",
        extendsPlanet: "Saturn",
        texture: "static/assets/rhea.jpg",
        size: 1.5, // km
        position: 527.1, // million km
        rotationSpeed: 4.52, // days
        orbitSpeed: 8.48, // km/s
        description: "Rhea is the second-largest moon of Saturn and has a heavily cratered surface.",
        history: "It was discovered by Giovanni Cassini in 1672 and is named after a titaness in Greek mythology.",
      },
  ];
  
export { originalMoonsData };

  
const originalPlanetsData = [
  {
    name: "Sun",
    texture: "static/assets/objects/sun.jpg",
    diameter: 1392684, // km
    distanceFromSun: 0, // million km
    rotationSpeed: 24.47, // days
    orbitSpeed: 0, // km/s
    moons: 0,
    description: "The Sun is a star at the center of the Solar System.",
    history: "The Sun formed about 4.6 billion years ago and provides the energy that sustains life on Earth.",
  },
  {
    name: "Mercury",
    texture: "static/assets/objects/mercury.jpg",
    diameter: 4879, // km
    distanceFromSun: 57.91, // million km
    rotationSpeed: 58.6, // days
    orbitSpeed: 47.87, // km/s
    moons: 0,
    description: "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
    history: "It is named after the Roman god Mercury, the messenger of the gods.",
  },
  {
    name: "Venus",
    texture: "static/assets/objects/venus.jpg",
    diameter: 12104, // km
    distanceFromSun: 108.2, // million km
    rotationSpeed: 243, // days
    orbitSpeed: 35.02, // km/s
    moons: 0,
    description: "Venus is often called the 'sister planet' of Earth because of their similar size and composition.",
    history: "It is named after the Roman goddess of love and beauty.",
  },
  {
    name: "Earth",
    texture: "static/assets/objects/earth.jpg",
    diameter: 12742, // km
    distanceFromSun: 149.6, // million km
    rotationSpeed: 0.99, // days
    orbitSpeed: 29.78, // km/s
    moons: 1,
    description: "Earth is the third planet from the Sun and the only known celestial body to support life.",
    history: "It is the birthplace of humanity and the cradle of human civilization.",
  },
  {
    name: "Mars",
    texture: "static/assets/objects/mars.jpg",
    diameter: 6779, // km
    distanceFromSun: 227.9, // million km
    rotationSpeed: 1.03, // days
    orbitSpeed: 24.08, // km/s
    moons: 2,
    description: "Mars is often called the 'Red Planet' due to its reddish appearance.",
    history: "It is named after the Roman god of war and is often considered a potential target for human colonization.",
  },
  {
    name: "Jupiter",
    texture: "static/assets/objects/jupiter.jpg",
    diameter: 139822, // km
    distanceFromSun: 778.3, // million km
    rotationSpeed: 0.41, // days
    orbitSpeed: 13.07, // km/s
    moons: 79,
    description: "Jupiter is the largest planet in the Solar System and is known for its Great Red Spot.",
    history: "It is named after the king of the Roman gods and is a gas giant composed mainly of hydrogen and helium.",
  },
  {
    name: "Saturn",
    texture: "static/assets/objects/saturn.jpg",
    ringTexture: "static/assets/objects/saturn_ring.png",
    diameter: 116464, // km
    distanceFromSun: 1427, // million km
    rotationSpeed: 0.45, // days
    orbitSpeed: 9.69, // km/s
    innerRadius: 74600, // km
    outerRadius: 136775, // km
    moons: 83,
    description: "Saturn is known for its prominent and extensive ring system.",
    history: "It is named after the Roman god of agriculture and is a gas giant like Jupiter.",
  },
  {
    name: "Uranus",
    texture: "static/assets/objects/uranus.jpg",
    ringTexture: "static/assets/objects/uranus_ring.png",
    diameter: 50724, // km
    distanceFromSun: 2871, // million km
    rotationSpeed: 0.72, // days
    orbitSpeed: 6.81, // km/s
    innerRadius: 26000, // km
    outerRadius: 51000, // km
    moons: 27,
    description: "Uranus is often called the 'sideways planet' due to its unique rotational axis.",
    history: "It is named after the Greek god of the sky and is an ice giant composed of water, ammonia, and methane.",
  },
  {
    name: "Neptune",
    texture: "static/assets/objects/neptune.jpg",
    diameter: 49244, // km
    distanceFromSun: 4495, // million km
    rotationSpeed: 0.67, // days
    orbitSpeed: 5.43, // km/s
    moons: 14,
    description: "Neptune is the eighth and farthest known planet from the Sun.",
    history: "It is named after the Roman god of the sea and is a gas giant similar to Jupiter and Saturn.",
  },
];


export { originalPlanetsData };

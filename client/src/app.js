// Esperamos a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
  // Animación de entrada inicial
  gsap.fromTo(
    ".tagline, h1, .description, .explore-btn", {
      opacity: 0,
      y: -50
    }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: "power3.out"
    }
  );

  gsap.to(".astronaut img", {
    scale: 1,
    duration: 2,
    ease: "elastic.out(1, 0.5)",
    delay: 1
  });

  // Evento para el botón de "Start Exploring"
  document.querySelector('.explore-btn').addEventListener('click', function () {
    // Animación de zoom hacia el fondo
    gsap.to("body", {
      scale: 2, // Simulamos el zoom hacia el fondo aumentando el scale del body
      duration: 2, // Duración de la animación
      ease: "power3.inOut", // Efecto de easing
      onComplete: function () {
        const heroSection = document.querySelector('.hero');
        if (heroSection) { // Verificamos que el .hero existe
          heroSection.style.display = 'none'; // Ocultar la sección hero
        }

        // Mostrar la sección del planeta 3D
        document.querySelector('.planet-section').style.display = 'flex'; // Mostrar la sección del planeta
        animatePlanet(); // Iniciar la animación del planeta 3D
      }
    });

    // Fade out del contenido
    gsap.to(".hero", {
      opacity: 0, // Ir ocultando la sección principal con opacidad
      duration: 1,
      ease: "power3.out"
    });
  });
});

// Función para iniciar la animación del planeta 3D
function animatePlanet() {
  // Crear la escena, cámara y renderizador
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('planet-container').appendChild(renderer.domElement);

  // Luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental suave
  scene.add(ambientLight);

  // Cargar las texturas
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('/client/src/assets/textures/00_earthmap1k.jpg');
  const specularTexture = textureLoader.load('/client/src/assets/textures/02_earthspec1k.jpg');
  const cloudTexture = textureLoader.load('/client/src/assets/textures/04_earthcloudmap.jpg');
  const cloudTransparency = textureLoader.load('/client/src/assets/textures/05_earthcloudmapTrans.jpg');

  // Crear la esfera (Tierra)
  const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture, // Textura de la Tierra
    specularMap: specularTexture, // Mapa especular
    specular: new THREE.Color(0x444444), // Especular
    shininess: 15 // Brillo especular
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Añadir nubes (otra esfera)
  const cloudGeometry = new THREE.SphereGeometry(5.1, 64, 64); // Ligeramente más grande que la Tierra
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    alphaMap: cloudTransparency,
    transparent: true,
    opacity: 0.8
  });
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(clouds);

  // Posición inicial de la cámara
  camera.position.z = 15;

  // Crear las estrellas
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
  });

  // Generar 1000 estrellas
  const starVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000; // Distribuye las estrellas hacia el fondo
    starVertices.push(x, y, z);
  }

  // Añadir las posiciones de las estrellas a la geometría
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  // Crear el objeto de estrellas y añadirlo a la escena
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Animación
  function animate() {
    requestAnimationFrame(animate);

    // Rotación de la Tierra y las nubes
    earth.rotation.y += 0.002;
    clouds.rotation.y += 0.001;

    // Renderizar la escena
    renderer.render(scene, camera);
  }

  // Responder a redimensionamiento de ventana
  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
}
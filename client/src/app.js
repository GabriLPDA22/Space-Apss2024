// Declarar variables globales
let scene, camera, renderer;
let satelliteMesh; // Mesh del satélite

// Inicializar el raycaster y el vector del mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Esperamos a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
  // Animación de entrada inicial con GSAP
  gsap.fromTo(
    ".tagline, h1, .description, .explore-btn",
    {
      opacity: 0,
      y: -50
    },
    {
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

// Esperar a que el documento esté completamente cargado
window.addEventListener("load", () => {
    // Establecer el token de acceso de Cesium ion
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjQ4NTM2Ny02MjUyLTQ2OWEtOWI0Zi0wMzEzMjFmZDhhNTUiLCJpZCI6MjQ0OTM0LCJpYXQiOjE3Mjc2MTk3Nzl9.JCgYGEruFIaJKAnDe8EC4AvkAgZ2WGPiHVH-Dmm_4G8';
  
    // Inicializar el visor de Cesium con capas base personalizadas
    const viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }), // Bing Maps Aerial
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1), // Cesium World Terrain
      }),
      animation: false,
      timeline: false,
      selectionIndicator: false,
      infoBox: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      navigationHelpButton: false,
      sceneModePicker: false,
    });
  
    // Añadir iluminación a la Tierra
    viewer.scene.globe.enableLighting = true;
  
    // Variable para la puntuación
    let puntuacion = 0;
    const scoreElement = document.getElementById("score");
  
    // Función para actualizar la puntuación en la interfaz
    function actualizarPuntuacion(puntos) {
      puntuacion += puntos;
      scoreElement.textContent = puntuacion;
    }
  
    // Función para agregar objetos orbitales
    function agregarObjeto(nombre, posicion, color, puntos) {
      return viewer.entities.add({
        name: nombre,
        position: posicion,
        ellipsoid: {
          radii: new Cesium.Cartesian3(50000.0, 50000.0, 50000.0),
          material: color,
        },
        puntos: puntos,
      });
    }
  
    // Lista de objetos con sus propiedades
    const objetos = [
      { nombre: "Satélite Funcional", color: Cesium.Color.GREEN, puntos: 10 },
      { nombre: "Basura Espacial", color: Cesium.Color.RED, puntos: -5 },
      { nombre: "Asteroide Peligroso", color: Cesium.Color.YELLOW, puntos: -15 },
      { nombre: "Cometa", color: Cesium.Color.BLUE, puntos: 20 },
    ];
  
    // Función para generar posiciones aleatorias en órbita
    function generarPosicionAleatoria() {
      const longitud = Math.random() * 360 - 180;
      const latitud = Math.random() * 180 - 90;
      const altura = 2000000 + Math.random() * 1000000; // Entre 2000 km y 3000 km
      return Cesium.Cartesian3.fromDegrees(longitud, latitud, altura);
    }
  
    // Agregar objetos al azar
    for (let i = 0; i < 100; i++) {
      const objeto = objetos[Math.floor(Math.random() * objetos.length)];
      const posicion = generarPosicionAleatoria();
      agregarObjeto(objeto.nombre, posicion, objeto.color, objeto.puntos);
    }
  
    // Manejar clics en los objetos
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (
        Cesium.defined(pickedObject) &&
        Cesium.defined(pickedObject.id) &&
        Cesium.defined(pickedObject.id.puntos)
      ) {
        const puntos = pickedObject.id.puntos;
        actualizarPuntuacion(puntos);
  
        // Eliminar el objeto después de hacer clic
        viewer.entities.remove(pickedObject.id);
  
        // Efecto visual al hacer clic (por ejemplo, destello)
        const efecto = viewer.entities.add({
          position: pickedObject.id.position.getValue(Cesium.JulianDate.now()),
          point: {
            pixelSize: 10,
            color: Cesium.Color.WHITE,
          },
        });
  
        setTimeout(() => {
          viewer.entities.remove(efecto);
        }, 500);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  });
  
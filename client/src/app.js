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


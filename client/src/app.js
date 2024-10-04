// Esperamos a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
  // Animación de entrada inicial con GSAP
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
});
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
  
    // Variables para el récord de puntuación
    let record = parseInt(localStorage.getItem('record')) || 0;
    const recordElement = document.getElementById("record-score");
    recordElement.textContent = record;
  
    // Variable para el temporizador
    const tiempoTotal = 5 * 60; // 5 minutos en segundos
    let tiempoRestante = tiempoTotal;
    const timeElement = document.getElementById("time");
  
    // Variables para controlar el estado del juego
    let juegoIniciado = false;
    let juegoTerminado = false;
    let temporizadorInterval;
  
    // Lista de preguntas para el quiz
    // Lista de preguntas para el quiz
    const preguntas = [
        {
            pregunta: "¿Cuál es la fuerza responsable de mantener los planetas en órbita alrededor del Sol?",
            opciones: ["Fuerza nuclear fuerte", "Fuerza electromagnética", "Fuerza gravitacional", "Fuerza nuclear débil"],
            respuestaCorrecta: "Fuerza gravitacional"
        },
        {
            pregunta: "¿Qué nombre recibe el fenómeno que describe la expansión acelerada del universo?",
            opciones: ["Materia oscura", "Energía oscura", "Radiación cósmica", "Big Bang"],
            respuestaCorrecta: "Energía oscura"
        },
        {
            pregunta: "¿Cuál es la teoría que describe la formación del universo?",
            opciones: ["Teoría de la Relatividad", "Teoría del Big Bang", "Teoría de Cuerdas", "Teoría Cuántica"],
            respuestaCorrecta: "Teoría del Big Bang"
        },
        {
            pregunta: "¿Qué son los agujeros negros?",
            opciones: ["Estrellas enanas blancas", "Regiones del espacio-tiempo con gravedad tan fuerte que nada puede escapar", "Planetas oscuros", "Nebulosas densas"],
            respuestaCorrecta: "Regiones del espacio-tiempo con gravedad tan fuerte que nada puede escapar"
        },
        {
            pregunta: "¿Cuál es la estrella más cercana a la Tierra después del Sol?",
            opciones: ["Proxima Centauri", "Sirius", "Betelgeuse", "Alpha Centauri A"],
            respuestaCorrecta: "Proxima Centauri"
        },
        {
            pregunta: "¿Qué es una supernova?",
            opciones: ["El nacimiento de una estrella", "La explosión de una estrella al final de su vida", "Un tipo de planeta gigante", "Un cometa que se acerca al Sol"],
            respuestaCorrecta: "La explosión de una estrella al final de su vida"
        },
        {
            pregunta: "¿Qué es el efecto Doppler en astronomía?",
            opciones: ["Cambio en la luminosidad de una estrella", "Desviación de la luz por campos gravitatorios", "Cambio en la frecuencia de la luz debido al movimiento relativo", "Expansión del universo"],
            respuestaCorrecta: "Cambio en la frecuencia de la luz debido al movimiento relativo"
        },
        {
            pregunta: "¿Cuál es el planeta más denso del sistema solar?",
            opciones: ["Tierra", "Saturno", "Júpiter", "Mercurio"],
            respuestaCorrecta: "Tierra"
        },
        {
            pregunta: "¿Qué son los exoplanetas?",
            opciones: ["Planetas enanos dentro del sistema solar", "Planetas que orbitan estrellas fuera de nuestro sistema solar", "Satélites naturales de otros planetas", "Asteroides de gran tamaño"],
            respuestaCorrecta: "Planetas que orbitan estrellas fuera de nuestro sistema solar"
        },
        {
            pregunta: "¿Quién propuso las leyes del movimiento planetario?",
            opciones: ["Isaac Newton", "Albert Einstein", "Johannes Kepler", "Galileo Galilei"],
            respuestaCorrecta: "Johannes Kepler"
        },
        {
            pregunta: "¿Qué es una galaxia espiral?",
            opciones: ["Una galaxia sin forma definida", "Una galaxia con forma esférica", "Una galaxia con brazos en forma de espiral", "Una galaxia formada solo por estrellas antiguas"],
            respuestaCorrecta: "Una galaxia con brazos en forma de espiral"
        },
        {
            pregunta: "¿Qué misión espacial llevó al primer ser humano a la Luna?",
            opciones: ["Apollo 11", "Vostok 1", "Challenger", "Sputnik 1"],
            respuestaCorrecta: "Apollo 11"
        },
        {
            pregunta: "¿Qué es la Vía Láctea?",
            opciones: ["Un cúmulo de galaxias", "Nuestra galaxia, donde se encuentra el sistema solar", "Una nebulosa cercana", "El nombre de una constelación"],
            respuestaCorrecta: "Nuestra galaxia, donde se encuentra el sistema solar"
        },
        {
            pregunta: "¿Qué son las manchas solares?",
            opciones: ["Zonas frías en la superficie de la Tierra", "Regiones más frías y oscuras en la superficie del Sol", "Pequeños asteroides cercanos al Sol", "Áreas de intensa actividad volcánica en planetas"],
            respuestaCorrecta: "Regiones más frías y oscuras en la superficie del Sol"
        },
        {
            pregunta: "¿Qué son los cúmulos globulares?",
            opciones: ["Agrupaciones de galaxias", "Grandes grupos de estrellas viejas y densamente empaquetadas", "Nubes de gas y polvo", "Regiones donde nacen nuevas estrellas"],
            respuestaCorrecta: "Grandes grupos de estrellas viejas y densamente empaquetadas"
        },
        {
            pregunta: "¿Cuál es el elemento más abundante en el universo?",
            opciones: ["Helio", "Oxígeno", "Carbono", "Hidrógeno"],
            respuestaCorrecta: "Hidrógeno"
        },
        {
            pregunta: "¿Qué instrumento se utiliza para observar objetos celestes lejanos?",
            opciones: ["Microscopio", "Telescopio", "Barómetro", "Sismógrafo"],
            respuestaCorrecta: "Telescopio"
        },
        {
            pregunta: "¿Qué es un año luz?",
            opciones: ["El tiempo que tarda la Tierra en orbitar el Sol", "La distancia que recorre la luz en un año", "Un año con mayor luminosidad solar", "El periodo de rotación del Sol"],
            respuestaCorrecta: "La distancia que recorre la luz en un año"
        },
        {
            pregunta: "¿Qué planeta tiene el día más largo (rotación más lenta) en el sistema solar?",
            opciones: ["Mercurio", "Venus", "Marte", "Neptuno"],
            respuestaCorrecta: "Venus"
        },
        {
            pregunta: "¿Qué fenómeno causa que las estrellas parezcan parpadear en el cielo nocturno?",
            opciones: ["Actividad solar", "Interferencia de asteroides", "Turbulencia en la atmósfera terrestre", "Variaciones intrínsecas en las estrellas"],
            respuestaCorrecta: "Turbulencia en la atmósfera terrestre"
        },
    ];
    // ... (Añade todas las demás preguntas aquí)
  
    // Función para obtener una pregunta aleatoria
    function obtenerPreguntaAleatoria() {
        return preguntas[Math.floor(Math.random() * preguntas.length)];
    }
  
    // Función para actualizar la puntuación en la interfaz
    function actualizarPuntuacion(puntos) {
        puntuacion += puntos;
        scoreElement.textContent = puntuacion;
    }
  
    // Información adicional de cada tipo de objeto
    const infoObjetos = {
        "Satélite Funcional": "Este es un satélite que está actualmente en operación y proporciona servicios vitales.",
        "Basura Espacial": "Fragmentos de satélites o cohetes que ya no están en uso y orbitan sin control.",
        "Asteroide Peligroso": "Un asteroide que podría representar una amenaza de colisión con la Tierra.",
        "Cometa": "Objeto celeste compuesto de hielo y polvo que orbita el Sol.",
    };
  
    // Función para agregar objetos orbitales con etiquetas
    function agregarObjeto(objeto, posicion) {
        return viewer.entities.add({
            name: objeto.nombre,
            position: posicion,
            ellipsoid: {
                radii: new Cesium.Cartesian3(50000.0, 50000.0, 50000.0),
                material: objeto.color,
            },
            label: {
                text: objeto.nombre,
                font: "14pt sans-serif",
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -50), // Ajusta la posición de la etiqueta
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            puntos: objeto.puntos,
            beneficioso: objeto.beneficioso,
            info: infoObjetos[objeto.nombre],
            esAmenaza: !objeto.beneficioso, // Añadimos esta propiedad para identificar amenazas
        });
    }
  
    // Lista de objetos con sus propiedades
    const objetos = [
        { nombre: "Satélite Funcional", color: Cesium.Color.GREEN, puntos: -10, beneficioso: true },
        { nombre: "Basura Espacial", color: Cesium.Color.RED, puntos: 5, beneficioso: false },
        { nombre: "Asteroide Peligroso", color: Cesium.Color.YELLOW, puntos: 15, beneficioso: false },
        { nombre: "Cometa", color: Cesium.Color.BLUE, puntos: -20, beneficioso: true },
    ];
  
    // Función para generar posiciones aleatorias en órbita
    function generarPosicionAleatoria() {
        const longitud = Math.random() * 360 - 180;
        const latitud = Math.random() * 180 - 90;
        const altura = 2000000 + Math.random() * 1000000; // Entre 2000 km y 3000 km
        return Cesium.Cartesian3.fromDegrees(longitud, latitud, altura);
    }
  
    // Función para inicializar el juego
    function iniciarJuego() {
        // Obtener el récord actualizado desde localStorage
        record = parseInt(localStorage.getItem('record')) || 0;
        recordElement.textContent = record;
  
        // Reiniciar variables
        puntuacion = 0;
        scoreElement.textContent = puntuacion;
  
        tiempoRestante = tiempoTotal;
        timeElement.textContent = formatoTiempo(tiempoRestante);
  
        juegoIniciado = false;
        juegoTerminado = false;
  
        // Eliminar todas las entidades existentes
        viewer.entities.removeAll();
  
        // Agregar objetos al azar
        for (let i = 0; i < 100; i++) {
            const objeto = objetos[Math.floor(Math.random() * objetos.length)];
            const posicion = generarPosicionAleatoria();
            agregarObjeto(objeto, posicion);
        }
  
        // Iniciar animación del planeta
        animatePlanet();
  
        // Mostrar el mensaje de bienvenida
        mostrarModalMensaje("¡Bienvenido!", "Tienes 5 minutos para limpiar la chatarra espacial. ¡Buena suerte!");
    }
  
    // Función para animar la rotación de la Tierra
    function animatePlanet() {
        viewer.clock.multiplier = 2000; // Velocidad de rotación
        viewer.clock.shouldAnimate = true; // Habilita la animación del reloj
        viewer.scene.globe.enableLighting = true; // Habilita la iluminación
    }
  
    // Función para mostrar el modal de quiz
    function mostrarModalQuiz(entidad) {
        const modalQuiz = document.getElementById("modal-quiz");
        const modalQuizTitulo = document.getElementById("modal-quiz-titulo");
        const modalQuizPregunta = document.getElementById("modal-quiz-pregunta");
        const quizOpciones = document.getElementById("quiz-opciones");
        const botonesOpciones = document.querySelectorAll(".quiz-opcion");
  
        // Obtener una pregunta aleatoria
        const pregunta = obtenerPreguntaAleatoria();
  
        modalQuizTitulo.textContent = entidad.name;
        modalQuizPregunta.textContent = pregunta.pregunta;
  
        // Mostrar las opciones
        quizOpciones.style.display = "block";
  
        // Asignar texto y eventos a los botones
        botonesOpciones.forEach((boton, index) => {
            boton.style.display = "inline-block";
            boton.textContent = pregunta.opciones[index];
            boton.onclick = () => {
                // Verificar si la respuesta es correcta
                if (pregunta.opciones[index] === pregunta.respuestaCorrecta) {
                    // Respuesta correcta
                    actualizarPuntuacion(entidad.puntos);
                    mostrarModalMensaje("¡Correcto!", `Has ganado ${entidad.puntos} puntos.`);
                } else {
                    // Respuesta incorrecta
                    tiempoRestante -= 15;
                    if (tiempoRestante < 0) tiempoRestante = 0;
                    timeElement.textContent = formatoTiempo(tiempoRestante);
                    mostrarModalMensaje("Incorrecto", "Has perdido 15 segundos.");
                }
  
                // Eliminar el objeto después de responder
                viewer.entities.remove(entidad);
  
                // Ocultar el modal de quiz
                modalQuiz.style.display = "none";
  
                // Si el objeto era una amenaza, verificar si quedan amenazas
                const amenazasRestantes = viewer.entities.values.filter(entity => entity.esAmenaza).length;
                if (amenazasRestantes === 0) {
                    finalizarJuego();
                }
            };
        });
  
        // Mostrar el modal de quiz
        modalQuiz.style.display = "block";
    }
  
    // Función para mostrar el modal de mensajes generales
    function mostrarModalMensaje(titulo, contenido, mostrarBotonReiniciar = false) {
        const modalMensaje = document.getElementById("modal-mensaje");
        const modalMensajeTitulo = document.getElementById("modal-mensaje-titulo");
        const modalMensajeContenido = document.getElementById("modal-mensaje-contenido");
        const botonReiniciar = document.getElementById("modal-reiniciar");
  
        modalMensajeTitulo.textContent = titulo;
        modalMensajeContenido.textContent = contenido;
  
        if (mostrarBotonReiniciar) {
            botonReiniciar.style.display = "block";
        } else {
            botonReiniciar.style.display = "none";
        }
  
        modalMensaje.style.display = "block";
    }
  
    // Función para cerrar el modal de mensajes
    function cerrarModalMensaje() {
        const modalMensaje = document.getElementById("modal-mensaje");
        modalMensaje.style.display = "none";
  
        if (!juegoIniciado && !juegoTerminado) {
            // Iniciar el juego al cerrar el modal de bienvenida
            juegoIniciado = true;
            temporizadorInterval = setInterval(actualizarTemporizador, 1000);
        }
    }
  
    // Función para cerrar el modal de quiz
    function cerrarModalQuiz() {
        const modalQuiz = document.getElementById("modal-quiz");
        modalQuiz.style.display = "none";
    }
  
    // Manejar clics en los objetos
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
        if (!juegoIniciado || juegoTerminado) return; // No hacer nada si el juego no ha iniciado o ha terminado
  
        const pickedObject = viewer.scene.pick(click.position);
        if (
            Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.id) &&
            Cesium.defined(pickedObject.id.puntos)
        ) {
            const entidad = pickedObject.id;
  
            // Efecto visual al hacer clic (por ejemplo, destello)
            const efecto = viewer.entities.add({
                position: entidad.position.getValue(Cesium.JulianDate.now()),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.WHITE,
                },
            });
  
            setTimeout(() => {
                viewer.entities.remove(efecto);
            }, 500);
  
            if (entidad.beneficioso) {
                // Si el objeto es beneficioso
                tiempoRestante -= 5;
                if (tiempoRestante < 0) tiempoRestante = 0;
                timeElement.textContent = formatoTiempo(tiempoRestante);
  
                mostrarModalMensaje("Objeto Beneficioso", "Este objeto es beneficioso. Has sido penalizado con 5 segundos.");
  
                // Eliminar el objeto
                viewer.entities.remove(entidad);
            } else {
                // Si el objeto es una amenaza, mostrar el quiz
                mostrarModalQuiz(entidad);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
    // Cerrar el modal de mensajes al hacer clic en la "X"
    document.getElementById("modal-mensaje-cerrar").addEventListener("click", cerrarModalMensaje);
  
    // Cerrar el modal de quiz al hacer clic en la "X"
    document.getElementById("modal-quiz-cerrar").addEventListener("click", cerrarModalQuiz);
  
    // Cerrar el modal de mensajes al hacer clic fuera de él
    window.addEventListener("click", (event) => {
        const modalMensaje = document.getElementById("modal-mensaje");
        if (event.target == modalMensaje) {
            cerrarModalMensaje();
        }
        const modalQuiz = document.getElementById("modal-quiz");
        if (event.target == modalQuiz) {
            cerrarModalQuiz();
        }
    });
  
    // Función para actualizar el temporizador
    function actualizarTemporizador() {
        if (juegoTerminado) return; // No actualizar si el juego ha terminado
  
        if (tiempoRestante <= 0) {
            // El tiempo se ha agotado
            finalizarJuego();
        } else {
            tiempoRestante--;
            timeElement.textContent = formatoTiempo(tiempoRestante);
        }
    }
  
    // Función para formatear el tiempo en mm:ss
    function formatoTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    }
  
    // Función para finalizar el juego
    function finalizarJuego() {
        juegoTerminado = true;
  
        // Detener la interacción
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
        // Detener el temporizador
        clearInterval(temporizadorInterval);
  
        // Contar cuántas amenazas quedan
        const amenazasRestantes = viewer.entities.values.filter(entity => entity.esAmenaza).length;
  
        let titulo;
        let mensaje;
  
        if (amenazasRestantes === 0) {
            titulo = "¡Felicidades!";
            mensaje = "Has salvado el planeta.";
        } else {
            titulo = "Juego Terminado";
            mensaje = `El tiempo se ha agotado. Quedaron ${amenazasRestantes} amenazas. Has perdido.`;
        }
  
        // Asegurar que puntuacion y record son números
        puntuacion = parseInt(puntuacion);
        record = parseInt(record);
  
        mensaje += `\n\nTu puntuación: ${puntuacion}`;
  
        // Actualizar el récord si es necesario
        if (puntuacion > record) {
            record = puntuacion;
            localStorage.setItem('record', record.toString());
            recordElement.textContent = record;
            mensaje += `\n\n¡Nuevo récord!`;
        } else {
            mensaje += `\nRécord actual: ${record}`;
        }
  
        // Mostrar el modal con el botón de reiniciar
        mostrarModalMensaje(titulo, mensaje, true); // Pasamos true para mostrar el botón de reiniciar
    }
  
    // Función para reiniciar el juego
    function reiniciarJuego() {
        cerrarModalMensaje();
        iniciarJuego();
    }
  
    // Añadir evento al botón de reiniciar
    document.getElementById("modal-reiniciar").addEventListener("click", reiniciarJuego);
  
    // Iniciar el juego por primera vez
    iniciarJuego();
  });
  
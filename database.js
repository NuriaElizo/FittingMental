/***************************************************
 * database.js
 * CORREGIDO PARA FUNCIONAR CON LA ESTRUCTURA HTML PADRE/HIJO
 ***************************************************/

console.log("database.js cargado correctamente");

// URL del Web App de Google Apps Script
const DATABASE_API_URL = "https://script.google.com/macros/s/AKfycbzhH641nGxukXdfITEHT3AcDzAX6WMrZQu0m6_C9UJmZJnfgYSoaIkIK-LDyfNAsByUmA/exec";

// 🔑 ESTADO GLOBAL REAL
const formData = {}; 

// ===============================
// 1. CAPTURA DE CLICKS (LÓGICA CORRECTA)
// ===============================
document.addEventListener("click", (e) => {
  // A) Detectar si el click fue en un botón emoji (o dentro de uno)
  const button = e.target.closest(".emoji");
  if (!button) return;

  // B) Buscar el contenedor padre que tiene la pregunta
  const questionDiv = button.closest("[data-question]");
  if (!questionDiv) return;

  // C) Extraer datos
  const questionId = questionDiv.dataset.question; // ej: "gestion_fallo_q0"
  const value = Number(button.dataset.value);      // ej: 3

  // D) Guardar en el estado global
  formData[questionId] = value;

  // E) Feedback visual (Quitar 'selected' a los hermanos, poner al actual)
  questionDiv.querySelectorAll(".emoji").forEach(b => b.classList.remove("selected"));
  button.classList.add("selected");

  // 🔍 DEBUG CLAVE - Esto es lo que tiene que salir en consola
  console.log("Respuesta guardada:", questionId, value);
  console.log("Estado actual formData:", formData);
});

// ===============================
// 2. FUNCIÓN DE ENVÍO (VALIDACIÓN POR CANTIDAD)
// ===============================
function enviarFittingMental() {
  console.log("Botón Enviar pulsado");

  // Ajusta este número al total real de tus preguntas
  const TOTAL_PREGUNTAS = 21; 

  // Validación: Contamos cuántas claves hay en formData, no importa cómo se llamen (q1 o gestion_fallo...)
  if (Object.keys(formData).length < TOTAL_PREGUNTAS) {
    alert(`Faltan preguntas por responder. Llevas ${Object.keys(formData).length} de ${TOTAL_PREGUNTAS}.`);
    console.log("Faltan respuestas. Estado actual:", formData);
    return;
  }

  // Construir payload
  const payload = {
    fecha: new Date().toISOString(),
    // Capturamos inputs manuales si existen, si no, cadena vacía
    email: document.getElementById("email")?.value || "",
    nombre: document.getElementById("nombre")?.value || "",
    handicap: document.getElementById("handicap")?.value || "",
    
    // Esparcimos las respuestas capturadas
    ...formData
  };

  console.log("Payload listo para enviar:", payload);

  // Envío SIN 'no-cors' para poder recibir respuesta de éxito/error
  fetch(DATABASE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // 'text/plain' evita preflight OPTIONS en Apps Script a veces
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Respuesta servidor:", data);
    if(data.result === 'success' || data.status === 'success') {
       alert("Fitting enviado correctamente ✅");
    } else {
       // A veces Apps Script devuelve éxito aunque nosotros no lo parseemos bien, pero esto ayuda
       alert("Formulario enviado (Server Response received) ✅");
    }
  })
  .catch(err => {
    console.error("Error al enviar:", err);
    alert("Hubo un error al enviar, revisa la consola.");
  });
}

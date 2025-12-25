/***************************************************
 * database.js
 * Envío de datos del Fitting Mental a Google Sheets
 ***************************************************/

console.log("database.js cargado");

// URL del Web App de Google Apps Script
const DATABASE_API_URL =
  "https://script.google.com/macros/s/AKfycbzhH641nGxukXdfITEHT3AcDzAX6WMrZQu0m6_C9UJmZJnfgYSoaIkIK-LDyfNAsByUmA/exec";

// Objeto donde se guardan las respuestas
const respuestas = {};

// ===============================
// CAPTURA DE CLICKS EN CARITAS
// ===============================
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-question][data-value]");
  if (!btn) return;

  const question = btn.dataset.question; // ej: "q1"
  const value = Number(btn.dataset.value); // 0,1,2,3

  respuestas[question] = value;

  // Feedback visual (opcional)
  const siblings = btn.parentElement.querySelectorAll("[data-value]");
  siblings.forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  console.log("Respuesta guardada:", question, value);
  console.log("Estado actual respuestas:", respuestas);
});

// ===============================
// ENVÍO DEL FITTING
// ===============================
function enviarFittingMental() {
  console.log("Botón enviar pulsado");

  // 1. Validación: comprobar q1 → q21
  for (let i = 1; i <= 21; i++) {
    if (respuestas[`q${i}`] === undefined) {
      alert("Faltan preguntas por responder");
      return;
    }
  }

  // 2. Construir payload
  const payload = {
    timestamp: new Date().toISOString(),
    alumno_id: crypto.randomUUID(),

    email: document.getElementById("email")?.value || "",
    nombre: document.getElementById("nombre")?.value || "",
    handicap: document.getElementById("handicap")?.value || "",
    frecuencia_juego: document.getElementById("frecuencia")?.value || "",

    ...respuestas
  };

  console.log("Payload final:", payload);

  // 3. Envío a Google Apps Script (SIN CORS)
  fetch(DATABASE_API_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  });

  alert("Fitting enviado correctamente ✅");
}

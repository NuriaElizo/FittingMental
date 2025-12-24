/***************************************************
 * database.js
 * Envío de datos del Fitting Mental a Google Sheets
 ***************************************************/

console.log("database.js cargado");

// URL del Web App de Google Apps Script
const DATABASE_API_URL =
  "https://script.google.com/macros/s/AKfycbzhH641nGxukXdfITEHT3AcDzAX6WMrZQu0m6_C9UJmZJnfgYSoaIkIK-LDyfNAsByUmA/exec";

// Respuestas del fitting (q1 → q21)
const respuestas = {};

// Captura de clicks en caritas
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-question][data-value]");
  if (!btn) return;

  const question = btn.dataset.question; // ej: q1
  const value = Number(btn.dataset.value); // 0–3

  respuestas[question] = value;

  // Feedback visual
  btn.parentElement
    .querySelectorAll("[data-value]")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
});

// Envío del fitting
function enviarFittingMental() {
  console.log("Botón enviar pulsado");

  // Validación: todas las preguntas respondidas
  for (let i = 1; i <= 21; i++) {
    if (respuestas[`q${i}`] === undefined) {
      alert("Faltan preguntas por responder");
      return;
    }
  }

  const payload = {
    timestamp: new Date().toISOString(),
    alumno_id: crypto.randomUUID(),
    email: document.getElementById("email")?.value || "",
    nombre: document.getElementById("nombre")?.value || "",
    handicap: document.getElementById("handicap")?.value || "",
    frecuencia_juego: document.getElementById("frecuencia")?.value || "",
    ...respuestas
  };

  console.log("Enviando payload:", payload);

  fetch(DATABASE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  alert("Fitting enviado correctamente ✅");
}

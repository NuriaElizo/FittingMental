/***************************************************
 * database.js
 * Envío de datos del Fitting Mental a Google Sheets
 ***************************************************/

// 1️⃣ Pega aquí la URL del Web App de Google Apps Script
const DATABASE_API_URL = "https://script.google.com/macros/s/AKfycbzhH641nGxukXdfITEHT3AcDzAX6WMrZQu0m6_C9UJmZJnfgYSoaIkIK-LDyfNAsByUmA/exec";

// 2️⃣ Objeto donde se guardan las respuestas
const respuestas = {};

// 3️⃣ Captura de clicks en las caritas
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-question][data-value]");
  if (!btn) return;

  const question = btn.dataset.question; // q1, q2, ...
  const value = Number(btn.dataset.value); // 0–3

  respuestas[question] = value;

  // Feedback visual (opcional)
  btn.parentElement
    .querySelectorAll("[data-value]")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
});

// 4️⃣ Envío del fitting completo
function enviarFittingMental() {

  // Comprobación mínima: todas las preguntas respondidas
  for (let i = 1; i <= 21; i++) {
    if (respuestas[`q${i}`] === undefined) {
      alert("Por favor, responde todas las preguntas.");
      return;
    }
  }

  // Payload que viaja a Google Sheets
  const payload = {
    alumno_id: crypto.randomUUID(),
    email: document.getElementById("email")?.value || "",
    nombre: document.getElementById("nombre")?.value || "",
    handicap: document.getElementById("handicap")?.value || "",
    frecuencia_juego: document.getElementById("frecuencia")?.value || "",
    ...respuestas
  };

  // Envío
  fetch(DATABASE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(() => {
      alert("Fitting mental enviado correctamente");
    })
    .catch(() => {
      alert("Error al enviar el fitting");
    });
}

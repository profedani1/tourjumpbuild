const express = require('express');
const app = express();
const port = 3000;

// Middleware base
app.use(express.json());
app.use(express.static('public'));

// === GESTIÓN DE PROCESOS ===
let maxConcurrentTasks = 3;
let currentTasks = 0;
let taskQueue = [];

// Función para manejar tareas encoladas
function processQueue() {
  if (taskQueue.length > 0 && currentTasks < maxConcurrentTasks) {
    const { req, res, handler } = taskQueue.shift();
    currentTasks++;
    handler(req, res).finally(() => {
      currentTasks--;
      processQueue(); // Llamar al siguiente cuando este termine
    });
  }
}

// Función para envolver cualquier endpoint "pesado"
function controlledRoute(handler) {
  return (req, res) => {
    if (currentTasks < maxConcurrentTasks) {
      currentTasks++;
      handler(req, res).finally(() => {
        currentTasks--;
        processQueue();
      });
    } else {
      // Encolar la solicitud
      taskQueue.push({ req, res, handler });
      // Se puede enviar una respuesta inicial si quieres
      console.log("Tarea en cola. Esperando turno...");
    }
  };
}

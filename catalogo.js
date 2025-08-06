// Abrir conexión con IndexedDB
let db;
const request = indexedDB.open('KnightsTourDB', 1);

request.onsuccess = function (event) {
  db = event.target.result;
  mostrarSoluciones();
};

request.onerror = function (event) {
  console.error('Error al abrir IndexedDB', event);
};

function mostrarSoluciones() {
  const transaction = db.transaction(['soluciones'], 'readonly');
  const objectStore = transaction.objectStore('soluciones');
  const request = objectStore.getAll();

  request.onsuccess = function (event) {
    const soluciones = event.target.result;
    const lista = document.getElementById('lista-soluciones');
    lista.innerHTML = '';

    soluciones.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.nombre}: ${item.pasos.length} pasos`;
      lista.appendChild(li);
    });
  };
}

function descargarCatalogo() {
  const transaction = db.transaction(['soluciones'], 'readonly');
  const objectStore = transaction.objectStore('soluciones');
  const request = objectStore.getAll();

  request.onsuccess = function (event) {
    const soluciones = event.target.result;
    const blob = new Blob([JSON.stringify(soluciones, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalogo_knights_tour.json';
    a.click();
    URL.revokeObjectURL(url);
  };
}

document.getElementById('btn-descargar').addEventListener('click', descargarCatalogo);

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
      li.innerHTML = `
        <strong>${item.nombre}</strong> — ${item.pasos.length} pasos
        <button data-index="${index}">Ver pasos</button>
        <pre id="pasos-${index}" class="pasos-output" style="display:none;"></pre>
      `;
      lista.appendChild(li);
    });

    // Añadir eventos a los botones
    document.querySelectorAll('button[data-index]').forEach(button => {
      button.addEventListener('click', e => {
        const index = e.target.getAttribute('data-index');
        const pre = document.getElementById(`pasos-${index}`);
        const transaction = db.transaction(['soluciones'], 'readonly');
        const objectStore = transaction.objectStore('soluciones');
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
          const soluciones = event.target.result;
          const pasos = soluciones[index].pasos;
          pre.textContent = pasos.map((p, i) => `Paso ${i + 1}: (${p[0]}, ${p[1]})`).join('\n');
          pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
        };
      });
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

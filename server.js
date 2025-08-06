import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public")); // sirve index.html y archivos estáticos en /public

// Ruta para guardar catálogo enviado desde cliente
app.post("/save-catalog", (req, res) => {
  const { catalog, boardSize } = req.body;
  if (!catalog || !boardSize) {
    return res.status(400).json({ error: "Faltan datos catalog o boardSize" });
  }
  const filename = `catalogo_knight_${boardSize}x${boardSize}.json`;
  const filepath = path.join(process.cwd(), filename);

  fs.writeFile(filepath, JSON.stringify(catalog, null, 2), (err) => {
    if (err) {
      console.error("Error guardando archivo:", err);
      return res.status(500).json({ error: "Error guardando archivo" });
    }
    console.log(`Archivo guardado: ${filename}`);
    res.json({ message: "Archivo guardado con éxito", filename });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

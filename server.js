import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10mb" }));

app.post("/save", (req, res) => {
  const data = req.body;
  fs.writeFile("productCatalog.json", JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error("❌ Error al guardar JSON:", err);
      res.status(500).send("Error al guardar el archivo.");
    } else {
      console.log("✅ Catálogo guardado correctamente.");
      res.send("Catálogo guardado.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

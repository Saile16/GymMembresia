const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const clientRoutes = require("./routes/clientRoutes");

const app = express();

app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Aumenta el tiempo de espera a 5 segundos
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    console.log("URI de conexión:", process.env.MONGODB_URI);
    console.log("Detalles del error:", err.reason);
  });

// Rutas (las añadiremos más adelante)
app.use("/api/clients", clientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

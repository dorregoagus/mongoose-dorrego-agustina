
import express from "express";
import dotenv from "dotenv";
import conectarDB from "./src/config/database.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/usuarios", userRoutes);

// Ruta inicial de prueba
app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API funcionando correctamente"
    });
});

const iniciarServidor = async () => {
    try {
        await conectarDB();

        app.listen(process.env.PORT, () => {
            console.log(`Servidor funcionando en el puerto ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error.message);
        process.exit(1);
    }
};

iniciarServidor();

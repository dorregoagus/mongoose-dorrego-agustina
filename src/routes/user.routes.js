
import { Router } from "express";
import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/user.controller.js";

import {
    validarCrearUsuario,
    validarActualizarUsuario,
    validarIdUsuario
} from "../middlewares/user.validators.js";

import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", obtenerUsuarios);

// Obtener un usuario por ID
router.get("/:id", validarIdUsuario, validarCampos, obtenerUsuarioPorId);

// Crear un usuario
router.post("/", validarCrearUsuario, validarCampos, crearUsuario);

// Actualizar un usuario
router.put(
    "/:id",
    validarIdUsuario,
    validarActualizarUsuario,
    validarCampos,
    actualizarUsuario
);

// Eliminar un usuario
router.delete("/:id", validarIdUsuario, validarCampos, eliminarUsuario);

export default router;

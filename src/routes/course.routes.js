
import { Router } from "express";

import {
    crearCurso,
    obtenerCursos,
    obtenerCursoPorId,
    actualizarCurso,
    eliminarCurso
} from "../controllers/course.controller.js";

import {
    validarIdCurso,
    validarCrearCurso,
    validarActualizarCurso
} from "../middlewares/course.validators.js";

import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// Obtener todos los cursos
router.get("/", obtenerCursos);

// Obtener un curso por ID
router.get(
    "/:id",
    validarIdCurso,
    validarCampos,
    obtenerCursoPorId
);

// Crear un curso
router.post(
    "/",
    validarCrearCurso,
    validarCampos,
    crearCurso
);

// Actualizar un curso
router.put(
    "/:id",
    validarIdCurso,
    validarActualizarCurso,
    validarCampos,
    actualizarCurso
);

// Eliminar un curso
router.delete(
    "/:id",
    validarIdCurso,
    validarCampos,
    eliminarCurso
);

export default router;

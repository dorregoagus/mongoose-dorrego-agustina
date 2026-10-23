
import { Router } from "express";

import {
    crearPerfil,
    obtenerPerfiles,
    obtenerPerfilPorId,
    actualizarPerfil,
    eliminarPerfil
} from "../controllers/profile.controller.js";

import {
    validarIdPerfil,
    validarCrearPerfil,
    validarActualizarPerfil
} from "../middlewares/profile.validators.js";

import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.get("/", obtenerPerfiles);

router.get(
    "/:id",
    validarIdPerfil,
    validarCampos,
    obtenerPerfilPorId
);

router.post(
    "/",
    validarCrearPerfil,
    validarCampos,
    crearPerfil
);

router.put(
    "/:id",
    validarIdPerfil,
    validarActualizarPerfil,
    validarCampos,
    actualizarPerfil
);

router.delete(
    "/:id",
    validarIdPerfil,
    validarCampos,
    eliminarPerfil
);

export default router;

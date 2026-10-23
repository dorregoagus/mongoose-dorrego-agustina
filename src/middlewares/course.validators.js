
import { body, param } from "express-validator";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Validar el ID del curso
export const validarIdCurso = [
    param("id")
        .isMongoId()
        .withMessage("El ID del curso no es válido")
];

// Validar los datos para crear un curso
export const validarCrearCurso = [
    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre del curso es obligatorio")
        .bail()
        .isLength({ min: 3, max: 80 })
        .withMessage("El nombre debe tener entre 3 y 80 caracteres")
        .bail()
        .custom(async (nombre) => {
            const curso = await Course.findOne({
                nombre,
                activo: true
            });

            if (curso) {
                throw new Error("Ya existe un curso activo con ese nombre");
            }

            return true;
        }),

    body("descripcion")
        .trim()
        .notEmpty()
        .withMessage("La descripción es obligatoria")
        .bail()
        .isLength({ max: 300 })
        .withMessage("La descripción no puede superar los 300 caracteres"),

    body("docente")
        .notEmpty()
        .withMessage("El ID del docente es obligatorio")
        .bail()
        .isMongoId()
        .withMessage("El ID del docente no es válido")
        .bail()
        .custom(async (id) => {
            const docente = await User.findOne({
                _id: id,
                activo: true,
                rol: "docente"
            });

            if (!docente) {
                throw new Error("El docente no existe, está inactivo o no tiene el rol docente");
            }

            return true;
        })
];

// Validar los datos para actualizar un curso
export const validarActualizarCurso = [
    body("nombre")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre no puede estar vacío")
        .bail()
        .isLength({ min: 3, max: 80 })
        .withMessage("El nombre debe tener entre 3 y 80 caracteres")
        .bail()
        .custom(async (nombre, { req }) => {
            const curso = await Course.findOne({
                nombre,
                activo: true,
                _id: { $ne: req.params.id }
            });

            if (curso) {
                throw new Error("Ya existe otro curso activo con ese nombre");
            }

            return true;
        }),

    body("descripcion")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("La descripción no puede estar vacía")
        .bail()
        .isLength({ max: 300 })
        .withMessage("La descripción no puede superar los 300 caracteres"),

    body("docente")
        .optional()
        .isMongoId()
        .withMessage("El ID del docente no es válido")
        .bail()
        .custom(async (id) => {
            const docente = await User.findOne({
                _id: id,
                activo: true,
                rol: "docente"
            });

            if (!docente) {
                throw new Error("El docente no existe, está inactivo o no tiene el rol docente");
            }

            return true;
        })
];

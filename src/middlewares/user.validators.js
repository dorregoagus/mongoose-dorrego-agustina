
import { body, param } from "express-validator";
import User from "../models/user.model.js";

export const validarIdUsuario = [
    param("id")
        .isMongoId()
        .withMessage("El ID del usuario no es válido")
];

export const validarCrearUsuario = [
    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El correo es obligatorio")
        .bail()
        .isEmail()
        .withMessage("El correo electrónico no es válido")
        .bail()
        .custom(async (email) => {
            const usuario = await User.findOne({
                email: email.toLowerCase()
            });

            if (usuario) {
                throw new Error("El correo electrónico ya está registrado");
            }

            return true;
        }),

    body("rol")
        .notEmpty()
        .withMessage("El rol es obligatorio")
        .bail()
        .isIn(["estudiante", "docente"])
        .withMessage("El rol debe ser estudiante o docente"),

    body("direccion")
        .isObject()
        .withMessage("La dirección debe ser un objeto"),

    body("direccion.calle")
        .trim()
        .notEmpty()
        .withMessage("La calle es obligatoria"),

    body("direccion.ciudad")
        .trim()
        .notEmpty()
        .withMessage("La ciudad es obligatoria")
];

export const validarActualizarUsuario = [
    body("nombre")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("El correo electrónico no es válido")
        .bail()
        .custom(async (email, { req }) => {
            const usuarioExistente = await User.findOne({
                email: email.toLowerCase()
            });

            if (
                usuarioExistente &&
                usuarioExistente._id.toString() !== req.params.id
            ) {
                throw new Error("El correo electrónico ya está registrado");
            }

            return true;
        }),

    body("rol")
        .optional()
        .isIn(["estudiante", "docente"])
        .withMessage("El rol debe ser estudiante o docente"),

    body("direccion")
        .optional()
        .isObject()
        .withMessage("La dirección debe ser un objeto"),

    body("direccion.calle")
        .if(body("direccion").exists())
        .trim()
        .notEmpty()
        .withMessage("La calle es obligatoria"),
    body("direccion.ciudad")
        .if(body("direccion").exists())
        .trim()
        .notEmpty()
        .withMessage("La ciudad es obligatoria")
];


import { body, param } from "express-validator";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

export const validarIdPerfil = [
    param("id")
        .isMongoId()
        .withMessage("El ID del perfil no es válido")
];

export const validarCrearPerfil = [
    body("usuario")
        .notEmpty()
        .withMessage("El ID del usuario es obligatorio")
        .bail()
        .isMongoId()
        .withMessage("El ID del usuario no es válido")
        .bail()
        .custom(async (id) => {
            const usuario = await User.findOne({
                _id: id,
                activo: true
            });

            if (!usuario) {
                throw new Error("El usuario no existe o está inactivo");
            }

            const perfil = await Profile.findOne({ usuario: id });

            if (perfil) {
                throw new Error("Este usuario ya tiene un perfil");
            }

            return true;
        }),

    body("biografia")
        .optional()
        .isString()
        .withMessage("La biografía debe ser un texto")
        .bail()
        .trim()
        .isLength({ max: 250 })
        .withMessage("La biografía no puede superar los 250 caracteres"),

    body("fechaNacimiento")
        .optional({ values: "null" })
        .isISO8601()
        .withMessage("La fecha de nacimiento debe tener un formato válido")
];

export const validarActualizarPerfil = [
    body("usuario")
        .not()
        .exists()
        .withMessage("No se puede cambiar el usuario asociado al perfil"),

    body("biografia")
        .optional()
        .isString()
        .withMessage("La biografía debe ser un texto")
        .bail()
        .trim()
        .isLength({ max: 250 })
        .withMessage("La biografía no puede superar los 250 caracteres"),

    body("fechaNacimiento")
        .optional({ values: "null" })
        .isISO8601()
        .withMessage("La fecha de nacimiento debe tener un formato válido")
];

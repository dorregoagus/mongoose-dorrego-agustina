
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import { matchedData } from "express-validator";

// Crear un perfil
export const crearPerfil = async (req, res) => {
    try {
        const datos = matchedData(req);

        const usuario = await User.findOne({
            _id: datos.usuario,
            activo: true
        });

        if (!usuario) {
            return res.status(400).json({
                mensaje: "El usuario no existe o está inactivo"
            });
        }

        const perfilExistente = await Profile.findOne({
            usuario: datos.usuario
        });

        if (perfilExistente) {
            return res.status(400).json({
                mensaje: "Este usuario ya tiene un perfil"
            });
        }

        const perfil = await Profile.create(datos);

        await perfil.populate("usuario", "nombre email");

        return res.status(201).json({
            mensaje: "Perfil creado correctamente",
            perfil
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                mensaje: "Este usuario ya tiene un perfil"
            });
        }

        return res.status(500).json({
            mensaje: "Error al crear el perfil",
            error: error.message
        });
    }
};

// Obtener todos los perfiles
export const obtenerPerfiles = async (req, res) => {
    try {
        const perfiles = await Profile.find()
            .populate("usuario", "nombre email");

        return res.status(200).json(perfiles);
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener los perfiles",
            error: error.message
        });
    }
};

// Obtener un perfil por su ID
export const obtenerPerfilPorId = async (req, res) => {
    try {
        const perfil = await Profile.findById(req.params.id)
            .populate("usuario", "nombre email");

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil no encontrado"
            });
        }

        return res.status(200).json(perfil);
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener el perfil",
            error: error.message
        });
    }
};

// Actualizar un perfil
export const actualizarPerfil = async (req, res) => {
    try {
        const datos = matchedData(req, {
            locations: ["body"]
        });

        const perfil = await Profile.findByIdAndUpdate(
            req.params.id,
            datos,
            { new: true, runValidators: true }
        ).populate("usuario", "nombre email");

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Perfil actualizado correctamente",
            perfil
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al actualizar el perfil",
            error: error.message
        });
    }
};

// Eliminar un perfil
export const eliminarPerfil = async (req, res) => {
    try {
        const perfil = await Profile.findByIdAndDelete(req.params.id);

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Perfil eliminado correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al eliminar el perfil",
            error: error.message
        });
    }
};

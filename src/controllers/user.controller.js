
import User from "../models/user.model.js";
import { matchedData } from "express-validator";

// Crear un usuario
export const crearUsuario = async (req, res) => {
    try {
        const datos = matchedData(req);

        const usuario = await User.create(datos);

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        res.status(500).json({
            mensaje: "Error al crear el usuario",
            error: error.message
        });
    }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find({ activo: true })
            .populate("perfil")
            .populate("cursosComoDocente")
            .populate("cursosComoEstudiante");

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await User.findOne({
            _id: req.params.id,
            activo: true
        })
            .populate("perfil")
            .populate("cursosComoDocente")
            .populate("cursosComoEstudiante");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el usuario",
            error: error.message
        });
    }
};

// Actualizar un usuario
export const actualizarUsuario = async (req, res) => {
    try {
        const datos = matchedData(req);

        const usuario = await User.findOneAndUpdate(
            { _id: req.params.id, activo: true },
            datos,
            { new: true, runValidators: true }
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            usuario
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        res.status(500).json({
            mensaje: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

// Eliminación lógica de un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await User.findOneAndUpdate(
            { _id: req.params.id, activo: true },
            { activo: false },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado o ya eliminado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });
    }
};

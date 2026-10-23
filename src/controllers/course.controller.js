
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { matchedData } from "express-validator";

// Crear un curso
export const crearCurso = async (req, res) => {
    try {
        const datos = matchedData(req);

        const docente = await User.findOne({
            _id: datos.docente,
            activo: true,
            rol: "docente"
        });

        if (!docente) {
            return res.status(400).json({
                mensaje: "El docente no existe o no tiene el rol correspondiente"
            });
        }

        const curso = await Course.create(datos);

        await curso.populate("docente", "nombre email");

        res.status(201).json({
            mensaje: "Curso creado correctamente",
            curso
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el curso",
            error: error.message
        });
    }
};

// Obtener todos los cursos activos
export const obtenerCursos = async (req, res) => {
    try {
        const cursos = await Course.find({ activo: true })
            .populate("docente", "nombre email")
            .populate("estudiantes", "nombre email");

        res.status(200).json(cursos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los cursos",
            error: error.message
        });
    }
};

// Obtener un curso por ID
export const obtenerCursoPorId = async (req, res) => {
    try {
        const curso = await Course.findOne({
            _id: req.params.id,
            activo: true
        })
            .populate("docente", "nombre email")
            .populate("estudiantes", "nombre email");

        if (!curso) {
            return res.status(404).json({
                mensaje: "Curso no encontrado"
            });
        }

        res.status(200).json(curso);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el curso",
            error: error.message
        });
    }
};

// Actualizar un curso
export const actualizarCurso = async (req, res) => {
    try {
        const datos = matchedData(req);

        if (datos.docente) {
            const docente = await User.findOne({
                _id: datos.docente,
                activo: true,
                rol: "docente"
            });

            if (!docente) {
                return res.status(400).json({
                    mensaje: "El docente no existe o no tiene el rol correspondiente"
                });
            }
        }

        const curso = await Course.findOneAndUpdate(
            { _id: req.params.id, activo: true },
            datos,
            { new: true, runValidators: true }
        )
            .populate("docente", "nombre email")
            .populate("estudiantes", "nombre email");

        if (!curso) {
            return res.status(404).json({
                mensaje: "Curso no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Curso actualizado correctamente",
            curso
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el curso",
            error: error.message
        });
    }
};

// Eliminación lógica de un curso
export const eliminarCurso = async (req, res) => {
    try {
        const curso = await Course.findOneAndUpdate(
            { _id: req.params.id, activo: true },
            { activo: false },
            { new: true }
        );

        if (!curso) {
            return res.status(404).json({
                mensaje: "Curso no encontrado o ya eliminado"
            });
        }

        res.status(200).json({
            mensaje: "Curso eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el curso",
            error: error.message
        });
    }
};

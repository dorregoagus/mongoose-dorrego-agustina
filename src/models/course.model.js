
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 80
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },
        docente: {
            // guarda solo el id del docente en vez de todo el objeto del usuario
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // arreglo que guarda los ids de varios estudiantes
        estudiantes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        activo: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;


import mongoose from "mongoose";

const direccionSchema = new mongoose.Schema(
    {
        calle: {
            type: String,
            required: true,
            trim: true
        },
        ciudad: {
            type: String,
            required: true,
            trim: true
        }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        rol: {
            type: String,
            enum: ["estudiante", "docente"],
            required: true
        },
        direccion: {
            type: direccionSchema,
            required: true
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Cursos en los que el usuario es docente
userSchema.virtual("cursosComoDocente", {
    ref: "Course",
    localField: "_id",
    foreignField: "docente"
});

// Cursos en los que el usuario está inscripto
userSchema.virtual("cursosComoEstudiante", {
    ref: "Course",
    localField: "_id",
    foreignField: "estudiantes"
});

// Perfil asociado al usuario
userSchema.virtual("perfil", {
    ref: "Profile",
    localField: "_id",
    foreignField: "usuario",
    justOne: true
});

const User = mongoose.model("User", userSchema);

export default User;

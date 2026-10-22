
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        biografia: {
            type: String,
            trim: true,
            maxlength: 250,
            default: ""
        },
        fechaNacimiento: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;

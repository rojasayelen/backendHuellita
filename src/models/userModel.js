const Persona = require("./personaModel");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    datosPersonales: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es un campo obligatorio."],
        minlength: [8, "La contraseña debe tener al menos 8 caracteres."]
    },
    roles: {
        type: [String],
        enum: ["admin", "user", "guest"],
        default: ["user"]
    },
    estado: {
        type: String,
        enum: ["activo", "inactivo"],
        default: "activo"
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^9\d{8}$/.test(v); // Validación para números de celular de Perú (9 seguido de 8 dígitos)
        },
        message: (props) =>
          `${props.value} no es un número de celular válido de Perú!`,
      },
    },
    firstJoinDate: { type: Date, default: Date.now },
    address: { type: String },
    dateOfBirth: { type: Date },
    emergencyContact: {
      name: { type: String },
      phoneNumber: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);

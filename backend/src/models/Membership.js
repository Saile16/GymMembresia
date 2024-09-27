const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: {
      type: String,
      required: true,
      enum: ["mensual", "trimestral", "semestral", "anual"],
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    price: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["efectivo", "transferencia"],
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", MembershipSchema);

const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [{ type: ObjectId, ref: "Product" }],
    payment: {},
    buyer: { type: ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);


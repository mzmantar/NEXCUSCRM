const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    productId: { type: String, required: true },
    
    productName: { type: String, required: true },
    productSku: { type: String, required: true },
    
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  { timestamps: true }
);

OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ productId: 1 });

module.exports = mongoose.model("OrderItem", OrderItemSchema);
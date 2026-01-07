const mongoose = require("mongoose");

const SupplierOrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: String,
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  receivedQuantity: { type: Number, default: 0 }
}, { _id: false });

const SupplierOrderSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  supplierId: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  
  items: [SupplierOrderItemSchema],
  totalAmount: { type: Number, required: true },
  
  status: {
    type: String,
    enum: ["draft", "pending", "confirmed", "partially_received", "received", "cancelled"],
    default: "draft"
  },
  
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date },
  deliveredDate: { type: Date },
  
  warehouseId: { type: String, required: true },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("SupplierOrder", SupplierOrderSchema);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const stockRoutes = require("./routes/stock.routes");
const supplierRoutes = require("./routes/supplier.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "e-commerce-service" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/suppliers", supplierRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");

  const PORT = process.env.E_COMMERCE_PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err.message);
});


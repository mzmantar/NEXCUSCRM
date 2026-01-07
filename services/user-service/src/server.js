const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const shopRoutes = require("./routes/shop.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");

  const PORT = process.env.USER_PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err.message);
});

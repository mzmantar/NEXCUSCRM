const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const contactRoutes = require("./routes/contact.routes.js");
const segmentRoutes = require("./routes/segment.routes.js");
const historyRoutes = require("./routes/history.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "crm-service" });
});

app.use("/contacts", contactRoutes);
app.use("/segments", segmentRoutes);
app.use("/history", historyRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const port = process.env.CRM_PORT;
    app.listen(port, () =>
      console.log(`CRM service running on port ${port}`)
    );
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
};

startServer();

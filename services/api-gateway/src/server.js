const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const { port } = require("./config/gateway.config");
const userRoutes = require("./routes/user.routes");
const crmRoutes = require("./routes/crm.routes");
const produitRoutes = require("./routes/produit.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors());


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

app.use(userRoutes);
app.use(crmRoutes);
app.use(produitRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
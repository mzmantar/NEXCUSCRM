const router = require("express").Router();
const { createProxy } = require("../utils/proxy");
const { services } = require("../config/gateway.config");

router.use("/api/products", createProxy(services.product, {
  pathRewrite: (path) => "/api/products" + path
}));

router.use("/api/products/categories", createProxy(services.product, {
  pathRewrite: (path) => "/api/categories" + path.replace(/^\/api\/products\/categories/, "")
}));

router.use("/api/products/reviews", createProxy(services.product, {
  pathRewrite: (path) => "/api/reviews" + path.replace(/^\/api\/products\/reviews/, "")
}));

module.exports = router;
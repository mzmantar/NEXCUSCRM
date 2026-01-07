const router = require("express").Router();
const { createProxy } = require("../utils/proxy");
const { services } = require("../config/gateway.config");

router.use("/api/users/auth", createProxy(services.user, {
  pathRewrite: (path) => "/api/auth" + path
}));

router.use("/api/users/shops", createProxy(services.user, {
  pathRewrite: (path) => "/api/shops" + path
}));

module.exports = router;
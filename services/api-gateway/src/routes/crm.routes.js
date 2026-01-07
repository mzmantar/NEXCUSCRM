const router = require("express").Router();
const { createProxy } = require("../utils/proxy");
const { services } = require("../config/gateway.config");

router.use("/api/crm/contacts", createProxy(services.crm, {
  pathRewrite: (path) => "/contacts" + path
}));

router.use("/api/crm/segments", createProxy(services.crm, {
  pathRewrite: (path) => "/segments" + path
}));

router.use("/api/crm/history", createProxy(services.crm, {
  pathRewrite: (path) => "/history" + path
}));

module.exports = router;
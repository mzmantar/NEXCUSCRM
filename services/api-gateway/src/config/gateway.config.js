const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const required = (value, name) => {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
};

const services = {
  user: required(process.env.USER_SERVICE_URL, "USER_SERVICE_URL"),
  crm: required(process.env.CRM_SERVICE_URL, "CRM_SERVICE_URL"),
  product: required(process.env.PRODUCT_SERVICE_URL, "PRODUCT_SERVICE_URL"),
};

const port = required(process.env.GATEWAY_PORT, "GATEWAY_PORT");

module.exports = { services, port };
const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * @param {string} target
 * @param {object} options
 */
const createProxy = (target, options = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ...options,
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${target}${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`[ERREUR] Proxy vers ${target}:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({ error: "Service indisponible" });
      }
    },
  });
};

module.exports = { createProxy };
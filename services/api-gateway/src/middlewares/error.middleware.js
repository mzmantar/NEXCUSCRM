const errorHandler = (err, req, res, next) => {
  console.error("Gateway error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Gateway Error" });
};

module.exports = { errorHandler };
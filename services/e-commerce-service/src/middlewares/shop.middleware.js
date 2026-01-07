const checkShop = (req, res, next) => {
  if (req.user.role === "super_admin") {
    req.shopId =
      req.body.shopId ||
      req.query.shopId ||
      req.params.shopId;

    if (!req.shopId) {
      return res.status(400).json({ message: "shopId requis" });
    }

    return next();
  }

  req.shopId = req.user.shopId;
  
  if (!req.shopId) {
    return res.status(403).json({ message: "shopId not found in token" });
  }
  
  next();
};

module.exports = { checkShop };

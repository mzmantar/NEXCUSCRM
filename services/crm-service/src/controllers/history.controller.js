const service = require("../services/history.service");

const add = async (req, res) => {
  const entry = await service.add({
    ...req.body,
    shopId: req.shopId,
    createdBy: req.user.userId
  });
  res.status(201).json(entry);
};

module.exports = { add };

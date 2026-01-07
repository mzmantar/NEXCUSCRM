const service = require("../services/contact.service");

const list = async (req, res) => {
  const data = await service.list(req.shopId);
  res.json({ data });
};

const create = async (req, res) => {
  const contact = await service.create({
    ...req.body,
    shopId: req.shopId,
    createdBy: req.user.userId
  });
  res.status(201).json(contact);
};

const update = async (req, res) => {
  const contact = await service.update(
    req.shopId,
    req.params.id,
    { ...req.body, updatedBy: req.user.userId }
  );

  if (!contact) {
    return res.status(404).json({ message: "Contact introuvable" });
  }

  res.json(contact);
};

const remove = async (req, res) => {
  const contact = await service.remove(
    req.shopId,
    req.params.id,
    req.user.userId
  );

  if (!contact) {
    return res.status(404).json({ message: "Contact introuvable" });
  }

  res.json({ message: "Contact supprime" });
};

module.exports = { list, create, update, remove };

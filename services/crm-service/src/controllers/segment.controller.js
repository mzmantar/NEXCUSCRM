const Segment = require("../models/segment.model");
const service = require("../services/segment.service");

const create = async (req, res) => {
  const segment = await service.create({
    ...req.body,
    shopId: req.shopId
  });
  res.status(201).json(segment);
};

const update = async (req, res) => {
  const segment = await service.update(
    req.shopId,
    req.params.id,
    req.body
  );

  if (!segment) {
    return res.status(404).json({ message: "Segment introuvable" });
  }

  res.json(segment);
};

const remove = async (req, res) => {
  const segment = await service.remove(req.shopId, req.params.id);
  if (!segment) {
    return res.status(404).json({ message: "Segment introuvable" });
  }
  res.json({ message: "Segment desactive" });
};

const recalculate = async (req, res) => {
  const segment = await Segment.findById(req.params.id);
  await service.recalculate(segment);
  res.json({ contactCount: segment.contactCount });
};

module.exports = { create, update, remove, recalculate };

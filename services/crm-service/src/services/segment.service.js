const Segment = require("../models/segment.model");
const Contact = require("../models/contact.model");

const create = data => Segment.create(data);

const update = (shopId, id, data) =>
  Segment.findOneAndUpdate({ _id: id, shopId }, data, { new: true });

const remove = (shopId, id) =>
  Segment.findOneAndUpdate({ _id: id, shopId }, { isActive: false });

const recalculate = async segment => {
  const count = await Contact.countDocuments({
    shopId: segment.shopId,
    ...segment.filters
  });

  segment.contactCount = count;
  segment.lastCalculatedAt = new Date();
  return segment.save();
};

module.exports = { create, update, remove, recalculate };

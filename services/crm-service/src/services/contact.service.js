const Contact = require("../models/contact.model");
const { v4: uuidv4 } = require("uuid");

const list = shopId =>
  Contact.find({ shopId, deletedAt: null }).populate('shopId').sort({ createdAt: -1 });

const create = data => Contact.create({
  ...data,
  contactId: uuidv4()
});

const update = (shopId, id, data) =>
  Contact.findOneAndUpdate(
    { _id: id, shopId, deletedAt: null },
    data,
    { new: true }
  );

const remove = (shopId, id, userId) =>
  Contact.findOneAndUpdate(
    { _id: id, shopId },
    { deletedAt: new Date(), updatedBy: userId },
    { new: true }
  );

module.exports = { list, create, update, remove };

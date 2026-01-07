const History = require("../models/history.model");
const Contact = require("../models/contact.model");
const { v4: uuidv4 } = require("uuid");

const add = async data => {
  const entry = await History.create({
    ...data,
    historyId: data.historyId || uuidv4(),
    contact: data.contactId || data.contact
  });
  const contact = await Contact.findById(data.contactId || data.contact);
  if (contact) await contact.updateStats(data.type);
  return entry;
};

module.exports = { add };

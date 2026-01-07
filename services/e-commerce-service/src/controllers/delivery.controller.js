const deliveryService = require("../services/delivery.service");

exports.createDelivery = async (req, res) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body);
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryService.getAllDeliveries();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id);
    res.status(200).json(delivery);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const updatedDelivery = await deliveryService.updateDeliveryStatus(req.params.id, req.body.status);
    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createDeliveryAgent = async (req, res) => {
  try {
    const agent = await deliveryService.createDeliveryAgent(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDeliveryAgents = async (req, res) => {
  try {
    const agents = await deliveryService.getAllDeliveryAgents();
    res.status(200).json(agents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createDeliveryAttempt = async (req, res) => {
  try {
    const attempt = await deliveryService.createDeliveryAttempt(req.body);
    res.status(201).json(attempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDeliveryAttemptsByDeliveryId = async (req, res) => {
  try {
    const attempts = await deliveryService.getDeliveryAttemptsByDeliveryId(req.params.deliveryId);
    res.status(200).json(attempts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createDeliveryCompany = async (req, res) => {
  try {
    const company = await deliveryService.createDeliveryCompany(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDeliveryCompanies = async (req, res) => {
  try {
    const companies = await deliveryService.getAllDeliveryCompanies();
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createDeliveryCompanyZone = async (req, res) => {
  try {
    const zone = await deliveryService.createDeliveryCompanyZone(req.body);
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDeliveryCompanyZones = async (req, res) => {
  try {
    const zones = await deliveryService.getDeliveryCompanyZones(req.params.companyId);
    res.status(200).json(zones);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createDeliveryZone = async (req, res) => {
  try {
    const zone = await deliveryService.createDeliveryZone(req.body);
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDeliveryZones = async (req, res) => {
  try {
    const zones = await deliveryService.getAllDeliveryZones();
    res.status(200).json(zones);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

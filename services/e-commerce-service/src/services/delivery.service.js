const Delivery = require("../models/Delivery/delivery.model");
const DeliveryAgent = require("../models/Delivery/deliveryAgent.model");
const DeliveryAttempt = require("../models/Delivery/deliveryAttempt.model");
const DeliveryCompany = require("../models/Delivery/deliveryCompany.model");
const DeliveryCompanyZone = require("../models/Delivery/deliveryCompanyZone.model");
const DeliveryZone = require("../models/Delivery/deliveryZone.model");

// Créer une livraison
exports.createDelivery = async (deliveryData) => {
  try {
    const delivery = new Delivery(deliveryData);
    await delivery.save();
    return delivery;
  } catch (error) {
    throw new Error("Error creating delivery: " + error.message);
  }
};

// Récupérer toutes les livraisons
exports.getAllDeliveries = async () => {
  try {
    const deliveries = await Delivery.find({}).populate('shopId');
    return deliveries;
  } catch (error) {
    throw new Error("Error fetching all deliveries: " + error.message);
  }
};

// Récupérer une livraison par ID
exports.getDeliveryById = async (deliveryId) => {
  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new Error("Delivery not found");
    }
    return delivery;
  } catch (error) {
    throw new Error("Error fetching delivery by ID: " + error.message);
  }
};

// Mettre à jour le statut d'une livraison
exports.updateDeliveryStatus = async (deliveryId, status) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    );
    if (!updatedDelivery) {
      throw new Error("Delivery not found");
    }
    return updatedDelivery;
  } catch (error) {
    throw new Error("Error updating delivery status: " + error.message);
  }
};

// Créer un agent de livraison
exports.createDeliveryAgent = async (agentData) => {
  try {
    const agent = new DeliveryAgent(agentData);
    await agent.save();
    return agent;
  } catch (error) {
    throw new Error("Error creating delivery agent: " + error.message);
  }
};

// Récupérer tous les agents de livraison
exports.getAllDeliveryAgents = async () => {
  try {
    const agents = await DeliveryAgent.find({});
    return agents;
  } catch (error) {
    throw new Error("Error fetching all delivery agents: " + error.message);
  }
};

// Créer une tentative de livraison
exports.createDeliveryAttempt = async (attemptData) => {
  try {
    const attempt = new DeliveryAttempt(attemptData);
    await attempt.save();
    return attempt;
  } catch (error) {
    throw new Error("Error creating delivery attempt: " + error.message);
  }
};

// Récupérer les tentatives de livraison d'une livraison
exports.getDeliveryAttemptsByDeliveryId = async (deliveryId) => {
  try {
    const attempts = await DeliveryAttempt.find({ deliveryId });
    return attempts;
  } catch (error) {
    throw new Error("Error fetching delivery attempts: " + error.message);
  }
};

// Créer une entreprise de livraison
exports.createDeliveryCompany = async (companyData) => {
  try {
    const company = new DeliveryCompany(companyData);
    await company.save();
    return company;
  } catch (error) {
    throw new Error("Error creating delivery company: " + error.message);
  }
};

// Récupérer toutes les entreprises de livraison
exports.getAllDeliveryCompanies = async () => {
  try {
    const companies = await DeliveryCompany.find({});
    return companies;
  } catch (error) {
    throw new Error("Error fetching all delivery companies: " + error.message);
  }
};

// Créer une zone de livraison pour une entreprise
exports.createDeliveryCompanyZone = async (zoneData) => {
  try {
    const zone = new DeliveryCompanyZone(zoneData);
    await zone.save();
    return zone;
  } catch (error) {
    throw new Error("Error creating delivery company zone: " + error.message);
  }
};

// Récupérer toutes les zones de livraison d'une entreprise
exports.getDeliveryCompanyZones = async (companyId) => {
  try {
    const zones = await DeliveryCompanyZone.find({ companyId });
    return zones;
  } catch (error) {
    throw new Error("Error fetching delivery company zones: " + error.message);
  }
};

// Créer une zone de livraison
exports.createDeliveryZone = async (zoneData) => {
  try {
    const zone = new DeliveryZone(zoneData);
    await zone.save();
    return zone;
  } catch (error) {
    throw new Error("Error creating delivery zone: " + error.message);
  }
};

// Récupérer toutes les zones de livraison
exports.getAllDeliveryZones = async () => {
  try {
    const zones = await DeliveryZone.find({});
    return zones;
  } catch (error) {
    throw new Error("Error fetching all delivery zones: " + error.message);
  }
};
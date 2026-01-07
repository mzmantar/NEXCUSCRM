const supplierService = require("../services/supplier.service");

// Créer un fournisseur
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les fournisseurs
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer un fournisseur par ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    res.status(200).json(supplier);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Mettre à jour un fournisseur
exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await supplierService.updateSupplier(req.params.id, req.body);
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un fournisseur
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await supplierService.deleteSupplier(req.params.id);
    res.status(200).json(deletedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Créer une commande fournisseur
exports.createSupplierOrder = async (req, res) => {
  try {
    const supplierOrder = await supplierService.createSupplierOrder(req.body);
    res.status(201).json(supplierOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les commandes fournisseur
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplierOrders = await supplierService.getSupplierOrders();
    res.status(200).json(supplierOrders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer une commande fournisseur par ID
exports.getSupplierOrderById = async (req, res) => {
  try {
    const supplierOrder = await supplierService.getSupplierOrderById(req.params.id);
    res.status(200).json(supplierOrder);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Mettre à jour une commande fournisseur
exports.updateSupplierOrder = async (req, res) => {
  try {
    const updatedSupplierOrder = await supplierService.updateSupplierOrder(req.params.id, req.body);
    res.status(200).json(updatedSupplierOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une commande fournisseur
exports.deleteSupplierOrder = async (req, res) => {
  try {
    const deletedSupplierOrder = await supplierService.deleteSupplierOrder(req.params.id);
    res.status(200).json(deletedSupplierOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

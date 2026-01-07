const Supplier = require("../models/supplier/supplier.model");
const SupplierOrder = require("../models/supplier/supplierOrder.model");

// Créer un fournisseur
exports.createSupplier = async (supplierData) => {
  try {
    const supplier = new Supplier(supplierData);
    await supplier.save();
    return supplier;
  } catch (error) {
    throw new Error("Error creating supplier: " + error.message);
  }
};

// Récupérer tous les fournisseurs
exports.getSuppliers = async () => {
  try {
    const suppliers = await Supplier.find({}).populate('shopId');
    return suppliers;
  } catch (error) {
    throw new Error("Error fetching suppliers: " + error.message);
  }
};

// Récupérer un fournisseur par ID
exports.getSupplierById = async (supplierId) => {
  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return supplier;
  } catch (error) {
    throw new Error("Error fetching supplier by ID: " + error.message);
  }
};

// Mettre à jour un fournisseur
exports.updateSupplier = async (supplierId, supplierData) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(supplierId, supplierData, { new: true });
    if (!updatedSupplier) {
      throw new Error("Supplier not found");
    }
    return updatedSupplier;
  } catch (error) {
    throw new Error("Error updating supplier: " + error.message);
  }
};

// Supprimer un fournisseur
exports.deleteSupplier = async (supplierId) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);
    if (!deletedSupplier) {
      throw new Error("Supplier not found");
    }
    return deletedSupplier;
  } catch (error) {
    throw new Error("Error deleting supplier: " + error.message);
  }
};

// Créer une commande fournisseur
exports.createSupplierOrder = async (supplierOrderData) => {
  try {
    const supplierOrder = new SupplierOrder(supplierOrderData);
    await supplierOrder.save();
    return supplierOrder;
  } catch (error) {
    throw new Error("Error creating supplier order: " + error.message);
  }
};

// Récupérer toutes les commandes fournisseur
exports.getSupplierOrders = async () => {
  try {
    const supplierOrders = await SupplierOrder.find({});
    return supplierOrders;
  } catch (error) {
    throw new Error("Error fetching supplier orders: " + error.message);
  }
};

// Récupérer une commande fournisseur par ID
exports.getSupplierOrderById = async (supplierOrderId) => {
  try {
    const supplierOrder = await SupplierOrder.findById(supplierOrderId);
    if (!supplierOrder) {
      throw new Error("Supplier order not found");
    }
    return supplierOrder;
  } catch (error) {
    throw new Error("Error fetching supplier order by ID: " + error.message);
  }
};

// Mettre à jour une commande fournisseur
exports.updateSupplierOrder = async (supplierOrderId, supplierOrderData) => {
  try {
    const updatedSupplierOrder = await SupplierOrder.findByIdAndUpdate(supplierOrderId, supplierOrderData, { new: true });
    if (!updatedSupplierOrder) {
      throw new Error("Supplier order not found");
    }
    return updatedSupplierOrder;
  } catch (error) {
    throw new Error("Error updating supplier order: " + error.message);
  }
};

// Supprimer une commande fournisseur
exports.deleteSupplierOrder = async (supplierOrderId) => {
  try {
    const deletedSupplierOrder = await SupplierOrder.findByIdAndDelete(supplierOrderId);
    if (!deletedSupplierOrder) {
      throw new Error("Supplier order not found");
    }
    return deletedSupplierOrder;
  } catch (error) {
    throw new Error("Error deleting supplier order: " + error.message);
  }
};

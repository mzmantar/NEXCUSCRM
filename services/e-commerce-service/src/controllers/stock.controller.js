const stockService = require("../services/stock.service");

// Alias helper to reduce repetition
const send = (res, promise) => promise.then((data) => res.status(200).json(data)).catch((error) => {
  res.status(400).json({ message: error.message });
});

// Créer un stock pour un produit dans un entrepôt
exports.createStock = async (req, res) => {
  try {
    const stock = await stockService.createStock(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les stocks
exports.getStock = async (req, res) => send(res, stockService.getAllStocks());

// Récupérer les stocks d'un produit spécifique
exports.getStockByProduct = async (req, res) =>
  send(res, stockService.getStockByProductId(req.params.productId));

// Ajuster les quantités d'un stock
exports.adjustStock = async (req, res) => {
  try {
    const adjusted = await stockService.adjustStock({
      productId: req.params.productId,
      warehouseId: req.body.warehouseId,
      quantity: req.body.quantity,
      type: req.body.type,
      reason: req.body.reason,
      performedBy: req.body.performedBy
    });
    res.status(200).json(adjusted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Transférer du stock entre entrepôts
exports.transferStock = async (req, res) => {
  try {
    const transfer = await stockService.transferStock({
      productId: req.body.productId,
      fromWarehouseId: req.body.fromWarehouseId,
      toWarehouseId: req.body.toWarehouseId,
      quantity: req.body.quantity,
      reason: req.body.reason,
      performedBy: req.body.performedBy
    });
    res.status(200).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les mouvements de stock
exports.getStockMovements = async (req, res) => send(res, stockService.getStockMovements());

// Récupérer les mouvements de stock par produit
exports.getStockMovementsByProduct = async (req, res) =>
  send(res, stockService.getStockMovementsByProduct(req.params.productId));

// Alerte stocks bas
exports.getStockAlerts = async (req, res) => send(res, stockService.getStockAlerts());

// Créer un entrepôt
exports.createWarehouse = async (req, res) => {
  try {
    const warehouse = await stockService.createWarehouse(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les entrepôts
exports.getWarehouses = async (req, res) => send(res, stockService.getWarehouses());

// Récupérer un entrepôt par ID
exports.getWarehouseById = async (req, res) => send(res, stockService.getWarehouseById(req.params.warehouseId));

// Mettre à jour un entrepôt
exports.updateWarehouse = async (req, res) => send(res, stockService.updateWarehouse(req.params.warehouseId, req.body));

// Supprimer un entrepôt
exports.deleteWarehouse = async (req, res) => send(res, stockService.deleteWarehouse(req.params.warehouseId));

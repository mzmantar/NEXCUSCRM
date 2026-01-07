const Stock = require("../models/Stock/stock.model");
const StockMovement = require("../models/Stock/stockMovement.model");
const Warehouse = require("../models/Stock/warehouse.model");

const recalcAvailability = (stock) => {
  stock.availableQuantity = stock.quantity - stock.reservedQuantity;
  if (stock.availableQuantity < 0) stock.availableQuantity = 0;
};

// Créer un stock pour un produit dans un entrepôt
exports.createStock = async (stockData) => {
  try {
    const stock = new Stock(stockData);
    await stock.save();
    return stock;
  } catch (error) {
    throw new Error("Error creating stock: " + error.message);
  }
};

// Récupérer les stocks d'un produit spécifique
exports.getStockByProductId = async (productId) => {
  try {
    const stocks = await Stock.find({ productId }).populate('shopId');
    return stocks;
  } catch (error) {
    throw new Error("Error fetching stock: " + error.message);
  }
};

// Récupérer tous les stocks
exports.getAllStocks = async () => {
  try {
    const stocks = await Stock.find({}).populate('shopId');
    return stocks;
  } catch (error) {
    throw new Error("Error fetching all stocks: " + error.message);
  }
};

// Mettre à jour les quantités d'un stock (augmentation ou diminution)
exports.updateStockQuantity = async (productId, warehouseId, quantity) => {
  try {
    const stock = await Stock.findOne({ productId, warehouseId }).populate('shopId');

    if (!stock) {
      throw new Error("Stock not found");
    }

    stock.quantity += quantity;
    recalcAvailability(stock);

    if (stock.quantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    await stock.save();
    return stock;
  } catch (error) {
    throw new Error("Error updating stock quantity: " + error.message);
  }
};

// Ajuster un stock (set/increment/decrement)
exports.adjustStock = async ({ productId, warehouseId, quantity, type = "set", reason, performedBy }) => {
  try {
    const stock = await Stock.findOne({ productId, warehouseId }).populate('shopId');
    if (!stock) {
      throw new Error("Stock not found");
    }

    if (type === "set") {
      stock.quantity = quantity;
    } else if (type === "increment") {
      stock.quantity += quantity;
    } else if (type === "decrement") {
      stock.quantity -= quantity;
    } else {
      throw new Error("Invalid adjustment type");
    }

    if (stock.quantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    recalcAvailability(stock);
    await stock.save();

    const movement = new StockMovement({
      shopId: stock.shopId,
      productId,
      warehouseId,
      type: "adjustment",
      quantity: stock.quantity,
      reason,
      performedBy
    });
    await movement.save();

    return { stock, movement };
  } catch (error) {
    throw new Error("Error adjusting stock: " + error.message);
  }
};

// Enregistrer un mouvement de stock (entrée ou sortie)
exports.createStockMovement = async (movementData) => {
  try {
    const stockMovement = new StockMovement(movementData);
    await stockMovement.save();

    const { productId, warehouseId, quantity } = movementData;
    await exports.updateStockQuantity(productId, warehouseId, quantity);

    return stockMovement;
  } catch (error) {
    throw new Error("Error creating stock movement: " + error.message);
  }
};

// Récupérer tous les mouvements de stocks
exports.getStockMovements = async () => {
  try {
    const stockMovements = await StockMovement.find({});
    return stockMovements;
  } catch (error) {
    throw new Error("Error fetching stock movements: " + error.message);
  }
};

// Récupérer les mouvements de stock par produit
exports.getStockMovementsByProduct = async (productId) => {
  try {
    const stockMovements = await StockMovement.find({ productId });
    return stockMovements;
  } catch (error) {
    throw new Error("Error fetching stock movements by product: " + error.message);
  }
};

// Transférer du stock entre deux entrepôts
exports.transferStock = async ({ productId, fromWarehouseId, toWarehouseId, quantity, reason, performedBy }) => {
  try {
    if (fromWarehouseId === toWarehouseId) {
      throw new Error("fromWarehouseId and toWarehouseId must differ");
    }

    const fromStock = await Stock.findOne({ productId, warehouseId: fromWarehouseId }).populate('shopId');
    const toStock = await Stock.findOne({ productId, warehouseId: toWarehouseId }).populate('shopId');

    if (!fromStock) {
      throw new Error("Source stock not found");
    }
    if (!toStock) {
      throw new Error("Destination stock not found");
    }

    if (quantity <= 0) {
      throw new Error("quantity must be positive");
    }

    if (fromStock.availableQuantity < quantity) {
      throw new Error("Insufficient available stock to transfer");
    }

    fromStock.quantity -= quantity;
    recalcAvailability(fromStock);
    toStock.quantity += quantity;
    recalcAvailability(toStock);

    if (fromStock.quantity < 0) {
      throw new Error("Source stock quantity cannot be negative");
    }

    await fromStock.save();
    await toStock.save();

    const movement = new StockMovement({
      shopId: fromStock.shopId,
      productId,
      warehouseId: fromWarehouseId,
      type: "transfer",
      quantity,
      fromWarehouseId,
      toWarehouseId,
      reason,
      performedBy
    });
    await movement.save();

    return { movement, fromStock, toStock };
  } catch (error) {
    throw new Error("Error transferring stock: " + error.message);
  }
};

// Créer un entrepôt
exports.createWarehouse = async (warehouseData) => {
  try {
    const warehouse = new Warehouse(warehouseData);
    await warehouse.save();
    return warehouse;
  } catch (error) {
    throw new Error("Error creating warehouse: " + error.message);
  }
};

// Récupérer tous les entrepôts
exports.getWarehouses = async () => {
  try {
    const warehouses = await Warehouse.find({});
    return warehouses;
  } catch (error) {
    throw new Error("Error fetching warehouses: " + error.message);
  }
};

// Récupérer un entrepôt par ID
exports.getWarehouseById = async (warehouseId) => {
  try {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      throw new Error("Warehouse not found");
    }
    return warehouse;
  } catch (error) {
    throw new Error("Error fetching warehouse by ID: " + error.message);
  }
};

// Mettre à jour les informations d'un entrepôt
exports.updateWarehouse = async (warehouseId, warehouseData) => {
  try {
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(warehouseId, warehouseData, { new: true });
    if (!updatedWarehouse) {
      throw new Error("Warehouse not found");
    }
    return updatedWarehouse;
  } catch (error) {
    throw new Error("Error updating warehouse: " + error.message);
  }
};

// Supprimer un entrepôt
exports.deleteWarehouse = async (warehouseId) => {
  try {
    const deletedWarehouse = await Warehouse.findByIdAndDelete(warehouseId);
    if (!deletedWarehouse) {
      throw new Error("Warehouse not found");
    }
    return deletedWarehouse;
  } catch (error) {
    throw new Error("Error deleting warehouse: " + error.message);
  }
};

// Détecter les stocks sous le seuil minimal
exports.getStockAlerts = async () => {
  try {
    const alerts = await Stock.find({
      $expr: { $lt: ["$availableQuantity", "$minStockLevel"] }
    });
    return alerts;
  } catch (error) {
    throw new Error("Error fetching stock alerts: " + error.message);
  }
};

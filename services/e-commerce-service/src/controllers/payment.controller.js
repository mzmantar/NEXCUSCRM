const paymentService = require("../services/payment.service");

// Créer un paiement
exports.createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les paiements
exports.getPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer un paiement par ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Récupérer tous les paiements
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour le statut d'un paiement
exports.updatePaymentStatus = async (req, res) => {
  try {
    const updatedPayment = await paymentService.updatePaymentStatus(req.params.id, req.body.status);
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Traiter un paiement en ligne
exports.processPayment = async (req, res) => {
  try {
    const payment = await paymentService.processPayment(req.params.id, req.body);
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Encaisser un paiement à la livraison (COD)
exports.collectCodPayment = async (req, res) => {
  try {
    const result = await paymentService.collectPaymentOnDelivery(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Créer une transaction de paiement
exports.createPaymentTransaction = async (req, res) => {
  try {
    const paymentTransaction = await paymentService.createPaymentTransaction(req.body);
    res.status(201).json(paymentTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les transactions de paiement
exports.getPaymentTransactions = async (req, res) => {
  try {
    const paymentTransactions = await paymentService.getPaymentTransactions();
    res.status(200).json(paymentTransactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les transactions de paiement d'un paiement
exports.getPaymentTransactionsByPaymentId = async (req, res) => {
  try {
    const paymentId = req.params.paymentId || req.params.id;
    const paymentTransactions = await paymentService.getPaymentTransactionsByPaymentId(paymentId);
    res.status(200).json(paymentTransactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Rembourser un paiement
exports.refundPayment = async (req, res) => {
  try {
    const result = await paymentService.refundPayment(req.params.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

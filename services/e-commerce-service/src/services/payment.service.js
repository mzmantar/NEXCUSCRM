const Payment = require("../models/payment/payment.model");
const PaymentTransaction = require("../models/payment/paymentTransaction.model");
const Order = require("../models/Order/order.model");
const { PAYMENT_STATUS, ORDER_STATUS, PAYMENT_METHODS } = require("../utils/constants");
const {
  emitPaymentCompleted,
  emitPaymentFailed,
  emitPaymentCodCollected,
  emitPaymentRefunded
} = require("../events/payment.events");

const syncOrderPaymentStatus = async (payment, options = {}) => {
  if (!payment?.orderId) {
    return null;
  }

  const order = await Order.findById(payment.orderId);
  if (!order) {
    return null;
  }

  order.paymentStatus = payment.status;
  order.paymentId = payment._id;

  if (payment.status === PAYMENT_STATUS.COMPLETED) {
    if (options.markDelivered) {
      order.status = ORDER_STATUS.DELIVERED;
    } else if (order.status !== ORDER_STATUS.DELIVERED) {
      order.status = ORDER_STATUS.PAID;
    }
  } else if (payment.status === PAYMENT_STATUS.FAILED && order.status !== ORDER_STATUS.DELIVERED) {
    order.status = ORDER_STATUS.FAILED;
  } else if (payment.status === PAYMENT_STATUS.CANCELLED && order.status !== ORDER_STATUS.DELIVERED) {
    order.status = ORDER_STATUS.CANCELLED;
  } else if (payment.status === PAYMENT_STATUS.REFUNDED && order.status !== ORDER_STATUS.DELIVERED) {
    order.status = ORDER_STATUS.RETURNED;
  }

  await order.save();
  return order;
};

const createTransaction = async (data) => {
  const transaction = new PaymentTransaction({
    paymentId: data.paymentId,
    transactionId: data.transactionId,
    type: data.type,
    amount: data.amount,
    status: data.status || "success",
    gateway: data.gateway,
    gatewayResponse: data.gatewayResponse,
    errorMessage: data.errorMessage,
    processedAt: data.processedAt || new Date()
  });

  await transaction.save();
  return transaction;
};

// Initialiser un paiement à partir d'une commande
exports.initializePaymentForOrder = async (order, options = {}) => {
  try {
    const payment = new Payment({
      orderId: order._id.toString(),
      shopId: order.shopId,
      amount: options.amount ?? order.totalAmount,
      paymentMethod:
        options.paymentMethod || (order.paymentType === "COD" ? PAYMENT_METHODS.COD : PAYMENT_METHODS.CARD),
      status: order.paymentType === "ONLINE" ? PAYMENT_STATUS.PROCESSING : PAYMENT_STATUS.PENDING,
      currency: options.currency || "TND",
      notes: options.notes
    });

    await payment.save();
    await syncOrderPaymentStatus(payment);
    return payment;
  } catch (error) {
    throw new Error("Error initializing payment: " + error.message);
  }
};

// Créer un paiement isolé
exports.createPayment = async (paymentData) => {
  try {
    const payment = new Payment(paymentData);
    await payment.save();
    await syncOrderPaymentStatus(payment);
    return payment;
  } catch (error) {
    throw new Error("Error creating payment: " + error.message);
  }
};

// Traiter un paiement en ligne (capture immédiate)
exports.processPayment = async (paymentId, payload = {}) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = PAYMENT_STATUS.PROCESSING;
    await payment.save();

    const transaction = await createTransaction({
      paymentId: payment._id,
      transactionId: payload.transactionId,
      type: "charge",
      amount: payload.amount ?? payment.amount,
      status: payload.status || "success",
      gateway: payload.gateway,
      gatewayResponse: payload.gatewayResponse,
      errorMessage: payload.errorMessage
    });

    if (transaction.status === "success") {
      payment.status = PAYMENT_STATUS.COMPLETED;
      payment.paidAt = new Date();
      emitPaymentCompleted(payment, transaction);
    } else {
      payment.status = PAYMENT_STATUS.FAILED;
      emitPaymentFailed(payment, transaction);
    }

    await payment.save();
    await syncOrderPaymentStatus(payment);

    return payment;
  } catch (error) {
    throw new Error("Error processing payment: " + error.message);
  }
};

// Encaisser un paiement à la livraison (COD)
exports.collectPaymentOnDelivery = async (paymentId, payload = {}) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.paymentMethod !== PAYMENT_METHODS.COD) {
      throw new Error("Payment is not marked as Cash on Delivery");
    }

    const transaction = await createTransaction({
      paymentId: payment._id,
      transactionId: payload.transactionId,
      type: "charge",
      amount: payload.amount ?? payment.amount,
      status: payload.status || "success",
      gateway: "cod",
      gatewayResponse: payload.gatewayResponse,
      processedAt: payload.collectedAt
    });

    if (transaction.status === "success") {
      payment.status = PAYMENT_STATUS.COMPLETED;
      payment.paidAt = payload.collectedAt || new Date();
      emitPaymentCodCollected(payment, transaction);
    } else {
      payment.status = PAYMENT_STATUS.FAILED;
      emitPaymentFailed(payment, transaction);
    }

    await payment.save();
    await syncOrderPaymentStatus(payment, { markDelivered: true });

    return { payment, transaction };
  } catch (error) {
    throw new Error("Error collecting COD payment: " + error.message);
  }
};

// Récupérer un paiement par ID
exports.getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  } catch (error) {
    throw new Error("Error fetching payment by ID: " + error.message);
  }
};

// Récupérer tous les paiements
exports.getAllPayments = async () => {
  try {
    return await Payment.find({}).populate('shopId');
  } catch (error) {
    throw new Error("Error fetching all payments: " + error.message);
  }
};

// Mettre à jour le statut d'un paiement
exports.updatePaymentStatus = async (paymentId, status) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });
    if (!updatedPayment) {
      throw new Error("Payment not found");
    }

    await syncOrderPaymentStatus(updatedPayment);
    return updatedPayment;
  } catch (error) {
    throw new Error("Error updating payment status: " + error.message);
  }
};

// Créer une transaction de paiement générique
exports.createPaymentTransaction = async (paymentTransactionData) => {
  try {
    const paymentTransaction = await createTransaction(paymentTransactionData);

    if (paymentTransaction.status === "success") {
      await exports.updatePaymentStatus(paymentTransaction.paymentId, PAYMENT_STATUS.COMPLETED);
    }

    return paymentTransaction;
  } catch (error) {
    throw new Error("Error creating payment transaction: " + error.message);
  }
};

// Récupérer toutes les transactions de paiement
exports.getPaymentTransactions = async () => {
  try {
    return await PaymentTransaction.find({});
  } catch (error) {
    throw new Error("Error fetching payment transactions: " + error.message);
  }
};

// Récupérer les transactions de paiement par paiement
exports.getPaymentTransactionsByPaymentId = async (paymentId) => {
  try {
    return await PaymentTransaction.find({ paymentId });
  } catch (error) {
    throw new Error("Error fetching payment transactions by payment ID: " + error.message);
  }
};

// Annuler un paiement
exports.cancelPayment = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = PAYMENT_STATUS.CANCELLED;
    await payment.save();
    await syncOrderPaymentStatus(payment);
    return payment;
  } catch (error) {
    throw new Error("Error cancelling payment: " + error.message);
  }
};

// Rembourser un paiement
exports.refundPayment = async (paymentId, payload = {}) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const transaction = await createTransaction({
      paymentId: payment._id,
      transactionId: payload.transactionId,
      type: "refund",
      amount: payload.amount ?? payment.amount,
      status: payload.status || "success",
      gateway: payload.gateway,
      gatewayResponse: payload.gatewayResponse,
      processedAt: payload.refundedAt,
      errorMessage: payload.reason
    });

    if (transaction.status === "success") {
      payment.status = PAYMENT_STATUS.REFUNDED;
      payment.refundedAt = payload.refundedAt || new Date();
      emitPaymentRefunded(payment, transaction);
    } else {
      payment.status = PAYMENT_STATUS.FAILED;
      emitPaymentFailed(payment, transaction);
    }

    await payment.save();
    await syncOrderPaymentStatus(payment);

    return { payment, transaction };
  } catch (error) {
    throw new Error("Error refunding payment: " + error.message);
  }
};

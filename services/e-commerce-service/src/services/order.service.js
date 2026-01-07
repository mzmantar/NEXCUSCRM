const Order = require("../models/Order/order.model");
const OrderItem = require("../models/Order/orderItem.model");
const paymentService = require("./payment.service");
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPES } = require("../utils/constants");
const {
  emitOrderCreated,
  emitOrderStatusUpdated,
  emitOrderCancelled,
  emitOrderReturned
} = require("../events/order.events");

const buildOrderItemsPayload = (orderId, items = []) =>
  items.map((item) => ({
    orderId,
    productId: item.productId,
    productName: item.productName,
    productSku: item.productSku,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    discount: item.discount || 0,
    tax: item.tax || 0
  }));

const findOrderOrThrow = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

// Créer une commande et initialiser le flux de paiement
exports.createOrder = async (orderData) => {
  try {
    const order = new Order({
      shopId: orderData.shopId,
      customerId: orderData.customerId,
      paymentType: orderData.paymentType,
      totalAmount: orderData.totalAmount,
      notes: orderData.notes,
      status: ORDER_STATUS.CONFIRMED,
      paymentStatus: PAYMENT_STATUS.PENDING
    });

    await order.save();

    if (orderData.items?.length) {
      await OrderItem.insertMany(buildOrderItemsPayload(order._id, orderData.items));
    }

    const payment = await paymentService.initializePaymentForOrder(order, {
      amount: order.totalAmount,
      paymentMethod: orderData.paymentMethod,
      currency: orderData.currency,
      notes: orderData.paymentNotes
    });

    let processedPayment = payment;
    if (order.paymentType === PAYMENT_TYPES.ONLINE) {
      processedPayment = await paymentService.processPayment(payment._id, {
        amount: order.totalAmount,
        paymentMethod: orderData.paymentMethod,
        gateway: orderData.gateway,
        gatewayResponse: orderData.gatewayResponse,
        transactionId: orderData.transactionId
      });
    }

    const refreshedOrder = await Order.findById(order._id);
    emitOrderCreated(refreshedOrder);
    return { order: refreshedOrder, payment: processedPayment };
  } catch (error) {
    throw new Error("Error creating order: " + error.message);
  }
};

// Récupérer toutes les commandes
exports.getOrders = async () => {
  try {
    return await Order.find({});
  } catch (error) {
    throw new Error("Error fetching all orders: " + error.message);
  }
};

// Récupérer une commande par ID avec ses articles
exports.getOrderById = async (orderId) => {
  try {
    const order = await findOrderOrThrow(orderId);
    const items = await OrderItem.find({ orderId });
    return { ...order.toObject(), items };
  } catch (error) {
    throw new Error("Error fetching order by ID: " + error.message);
  }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (orderId, status) => {
  try {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new Error("Invalid status");
    }
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    emitOrderStatusUpdated(updatedOrder);
    return updatedOrder;
  } catch (error) {
    throw new Error("Error updating order status: " + error.message);
  }
};

// Mettre à jour une commande
exports.updateOrder = async (orderId, updates) => {
  try {
    const updatePayload = {};

    if (updates.status) {
      if (!Object.values(ORDER_STATUS).includes(updates.status)) {
        throw new Error("Invalid status");
      }
      updatePayload.status = updates.status;
    }

    if (typeof updates.paymentType !== "undefined") {
      updatePayload.paymentType = updates.paymentType;
    }

    if (typeof updates.totalAmount !== "undefined") {
      updatePayload.totalAmount = updates.totalAmount;
    }

    if (typeof updates.notes !== "undefined") {
      updatePayload.notes = updates.notes;
    }

    if (Object.keys(updatePayload).length === 0) {
      return await findOrderOrThrow(orderId);
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatePayload, { new: true });
    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

// Supprimer une commande
exports.deleteOrder = async (orderId) => {
  try {
    const order = await findOrderOrThrow(orderId);
    await OrderItem.deleteMany({ orderId });
    await order.deleteOne();
    return order;
  } catch (error) {
    throw new Error("Error deleting order: " + error.message);
  }
};

// Annuler une commande
exports.cancelOrder = async (orderId) => {
  try {
    const order = await findOrderOrThrow(orderId);
    order.status = ORDER_STATUS.CANCELLED;
    order.paymentStatus = PAYMENT_STATUS.CANCELLED;
    await order.save();

    if (order.paymentId) {
      await paymentService.cancelPayment(order.paymentId);
    }

    emitOrderCancelled(order);
    return order;
  } catch (error) {
    throw new Error("Error cancelling order: " + error.message);
  }
};

// Marquer une commande comme retournée
exports.returnOrder = async (orderId) => {
  try {
    const order = await findOrderOrThrow(orderId);
    order.status = ORDER_STATUS.RETURNED;
    await order.save();
    emitOrderReturned(order);
    return order;
  } catch (error) {
    throw new Error("Error returning order: " + error.message);
  }
};

// Ajouter un article à une commande
exports.addOrderItem = async (orderId, itemData) => {
  try {
    await findOrderOrThrow(orderId);

    const orderItem = new OrderItem({
      orderId,
      productId: itemData.productId,
      productName: itemData.productName,
      productSku: itemData.productSku,
      quantity: itemData.quantity,
      unitPrice: itemData.unitPrice,
      totalPrice: itemData.totalPrice,
      discount: itemData.discount || 0,
      tax: itemData.tax || 0
    });

    await orderItem.save();
    return orderItem;
  } catch (error) {
    throw new Error("Error adding order item: " + error.message);
  }
};

// Supprimer un article de la commande
exports.removeOrderItem = async (orderId, itemId) => {
  try {
    await findOrderOrThrow(orderId);

    const orderItem = await OrderItem.findById(itemId);
    if (!orderItem) {
      throw new Error("Order item not found");
    }

    if (orderItem.orderId.toString() !== orderId) {
      throw new Error("Order item does not belong to the given order");
    }

    await orderItem.deleteOne();
    return orderItem;
  } catch (error) {
    throw new Error("Error removing order item: " + error.message);
  }
};

// Récupérer les articles d'une commande
exports.getOrderItems = async (orderId) => {
  try {
    return await OrderItem.find({ orderId });
  } catch (error) {
    throw new Error("Error fetching order items: " + error.message);
  }
};

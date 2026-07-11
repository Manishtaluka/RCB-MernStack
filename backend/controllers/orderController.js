import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import getRazorpayInstance from "../config/razorpay.js";

// @route POST /api/orders/checkout
// body: { items: [{ productId, size, quantity }], shippingAddress }
// Prices are recalculated server-side from the DB — never trust client-sent prices.
export const createCheckoutOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let itemsTotal = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);
      if (!product) return res.status(404).json({ message: `Product ${cartItem.productId} not found` });
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const unitPrice = product.discountPrice || product.price;
      itemsTotal += unitPrice * cartItem.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: unitPrice,
      });
    }

    const shippingFee = itemsTotal > 2000 ? 0 : 99;
    const totalAmount = itemsTotal + shippingFee;

    // Razorpay expects amount in paise
    const razorpayOrder = await getRazorpayInstance().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `rcb_order_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingFee,
      totalAmount,
      razorpay: { orderId: razorpayOrder.id },
      status: "pending",
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/orders/verify
// body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.status = "cancelled";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Deduct stock now that payment is confirmed
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    order.status = "paid";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    await order.save();

    res.json({ message: "Payment verified", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/mine
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders  (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PATCH /api/orders/:id/status  (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

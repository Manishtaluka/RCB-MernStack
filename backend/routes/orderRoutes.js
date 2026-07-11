import express from "express";
import {
  createCheckoutOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/checkout", protect, createCheckoutOrder);
router.post("/verify", protect, verifyPayment);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;

import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import {
  createOrder,
  getActiveOrders,
  getOrderHistory,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order (Public for customer)
router.post('/', createOrder);

// Get all active orders (Admin Protected)
router.get('/active', getActiveOrders);

// Get order history/stats (Admin Protected)
router.get('/history', getOrderHistory);


// Get single order status (Public for customer polling)
router.get('/:id', getOrderById);

// Update order status (Admin Protected)
router.put('/:id/status', updateOrderStatus);

export default router;

import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

// Get all menu items
router.get('/', getMenuItems);


// Create menu item (Admin Protected)
router.post(
  '/',
  protect,
  adminOnly,
  createMenuItem
);

// Update menu item (Admin Protected)
router.put(
  '/:id',
  protect,
  adminOnly,
  updateMenuItem
);


// Delete menu item (Admin Protected)
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteMenuItem
);


export default router;

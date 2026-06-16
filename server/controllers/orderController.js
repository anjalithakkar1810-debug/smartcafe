import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    const { tableNumber, items, totalAmount } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }
    try {
        const order = new Order({
            tableNumber,
            items,
            totalAmount,
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error placing order: ' + error.message });
    }
};

export const getActiveOrders = async (req, res) => {
    try {
        const activeOrders = await Order.find({ status: { $ne: 'served' } })
            .populate('items.menuItem')
            .sort({ createdAt: 1 }); // Oldest first to prioritize
        res.json(activeOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

export const getOrderHistory = async (req, res) => {
    try {
        const historyOrders = await Order.find({})
            .populate('items.menuItem')
            .sort({ createdAt: -1 });
        res.json(historyOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.menuItem');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'cooking', 'ready', 'served'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status: ' + error.message });
    }
};
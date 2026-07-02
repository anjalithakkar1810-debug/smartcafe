import API_BASE_URL from "./api";

// Create New Order
export const createOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        throw new Error("Failed to place order");
    }

    return await response.json();
};

// Get Single Order Status
export const getOrderById = async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

    if (!response.ok) {
        throw new Error("Order not found");
    }

    return await response.json();
};

// Get Active Orders
export const getActiveOrders = async (token) => {
    const response = await fetch(`${API_BASE_URL}/orders/active`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch active orders");
    }

    return await response.json();
};

// Get Order History
export const getOrderHistory = async (token) => {
    const response = await fetch(`${API_BASE_URL}/orders/history`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch order history");
    }

    return await response.json();
};

// Update Order Status
export const updateOrderStatus = async (orderId, status, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        throw new Error("Failed to update order status");
    }

    return await response.json();
};

// ✅ Dashboard Statistics (ye bahar rahega)
export const getDashboardStats = async (token) => {
    const response = await fetch(`${API_BASE_URL}/orders/dashboard-stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
    }

    return await response.json();
};
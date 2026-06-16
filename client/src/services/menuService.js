import API_BASE_URL from './api';

export const getAllMenu = async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);

    if (!response.ok) {
        throw new Error("Failed to fetch menu");
    }

    return await response.json();
};

export const createMenuItem = async (menuData, token) => {

    const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(menuData)
    });

    if (!response.ok) {
        throw new Error("Failed to create menu item");
    }

    return await response.json();
};

export const updateMenuItem = async (id, menuData, token) => {

    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(menuData)
    });

    if (!response.ok) {
        throw new Error("Failed to update menu item");
    }

    return await response.json();
};
export const deleteMenuItem = async (id, token) => {

    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete menu item");
    }

    return await response.json();
};
export const toggleMenuAvailability = async (
    id,
    isAvailable,
    token
) => {

    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            isAvailable
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update availability");
    }

    return await response.json();
};
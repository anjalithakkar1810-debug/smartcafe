import API_BASE_URL from "./api";

export const submitRating = async (ratingData) => {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
    });

    if (!response.ok) {
        throw new Error("Failed to submit rating");
    }

    return response.json();
};

export const getRatings = async () => {
    const response = await fetch(`${API_BASE_URL}/ratings`);

    if (!response.ok) {
        throw new Error("Failed to fetch ratings");
    }

    return response.json();
};
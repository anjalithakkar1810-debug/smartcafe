import Rating from "../models/Rating.js";
import Order from "../models/Order.js";

// Create Rating
export const createRating = async (req, res) => {
    try {
        const rating = await Rating.create(req.body);

        // Mark order as rated
        await Order.findByIdAndUpdate(req.body.orderId, {
            isRated: true,
        });

        res.status(201).json(rating);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Ratings
export const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find().sort({
            createdAt: -1,
        });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
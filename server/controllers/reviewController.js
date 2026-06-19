import Review from "../models/Review.js";

// Add Review
export const addReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Reviews by Food ID
export const getReviewsByFood = async (req, res) => {
    try {
        const reviews = await Review.find({
            foodId: req.params.foodId,
        }).sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Average Rating
export const getAverageRating = async (req, res) => {
    try {
        const result = await Review.aggregate([
            {
                $match: {
                    foodId: req.params.foodId
                }
            },
            {
                $group: {
                    _id: "$foodId",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length === 0) {
            return res.json({
                averageRating: 0,
                totalReviews: 0
            });
        }

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
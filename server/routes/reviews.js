import express from "express";
import {
    addReview,
    getReviewsByFood,
    getAverageRating,
} from "../controllers/reviewController.js";

const router = express.Router();

// Add Review
router.post("/", addReview);

// Get Reviews by Food Item
router.get("/:foodId", getReviewsByFood);

// Get Average Rating
router.get("/average/:foodId", getAverageRating);

export default router;
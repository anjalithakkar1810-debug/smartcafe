import React from "react";

const RatingModal = ({
    rating,
    setRating,
    review,
    setReview,
    onSubmit,
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>⭐ Rate Your Experience</h2>

                <p>How was your food?</p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        fontSize: "32px",
                        margin: "20px 0",
                    }}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            style={{
                                cursor: "pointer",
                                color: star <= rating ? "#FFD700" : "#ccc",
                            }}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    className="form-input"
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />

                <button
                    className="btn btn-primary"
                    style={{ marginTop: "20px", width: "100%" }}
                    onClick={onSubmit}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
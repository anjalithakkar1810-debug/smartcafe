const CheckoutModal = ({
    cart,
    menuItems,
    getCartTotal,
    tableNumber,
    setTableNumber,
    setIsCheckoutOpen,
    handlePlaceOrder
}) => {
    return (
        <div className="modal-overlay">
            <form className="modal-content" onSubmit={handlePlaceOrder}>
                <h3 style={{ marginBottom: "15px" }}>
                    Confirm Table & Order
                </h3>

                <div
                    style={{
                        maxHeight: "180px",
                        overflowY: "auto",
                        marginBottom: "20px",
                        background: "rgba(0,0,0,0.1)",
                        padding: "10px",
                        borderRadius: "6px"
                    }}
                >
                    {Object.entries(cart).map(([itemId, qty]) => {
                        const item = menuItems.find(
                            (i) => i._id === itemId
                        );

                        return item ? (
                            <div
                                key={itemId}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.9rem",
                                    marginBottom: "8px"
                                }}
                            >
                                <span>
                                    {item.name}
                                    <span
                                        style={{
                                            color: "var(--text-muted)"
                                        }}
                                    >
                                        {" "}
                                        x{qty}
                                    </span>
                                </span>

                                <span>
                                    ₹{item.price * qty}
                                </span>
                            </div>
                        ) : null;
                    })}

                    <div
                        style={{
                            borderTop:
                                "1px solid var(--glass-border)",
                            marginTop: "8px",
                            paddingTop: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold"
                        }}
                    >
                        <span>Grand Total</span>
                        <span>₹{getCartTotal()}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Enter Table Number</label>

                    <input
                        type="number"
                        placeholder="e.g. 3, 7, 12"
                        className="form-input"
                        required
                        value={tableNumber}
                        onChange={(e) =>
                            setTableNumber(e.target.value)
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            setIsCheckoutOpen(false)
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Send to Kitchen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutModal;
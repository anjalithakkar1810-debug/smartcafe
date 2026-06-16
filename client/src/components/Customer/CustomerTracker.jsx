const CustomerTracker = ({
    activeOrder,
    activeOrderId,
    tableNumber,
    setView
}) => {
    return (
        <div className="tracker-container">
            <div className="card tracker-card">
                <div className="tracker-title">
                    ☕ Smart<span>Cafe</span> Order Status
                </div>

                <p style={{ color: "var(--text-muted)" }}>
                    Order ID:{" "}
                    {activeOrderId
                        ? activeOrderId.slice(-6).toUpperCase()
                        : ""}
                </p>

                <div style={{ margin: "20px 0" }}>
                    <span
                        style={{
                            fontSize: "1rem",
                            color: "var(--text-muted)"
                        }}
                    >
                        Serving on
                    </span>

                    <div className="tracker-table-num">
                        Table {activeOrder?.tableNumber || tableNumber}
                    </div>
                </div>

                <div className="tracker-steps">

                    <div
                        className={`tracker-step ${activeOrder?.status === "pending"
                                ? "active"
                                : "completed"
                            }`}
                    >
                        <div className="step-dot"></div>

                        <div>
                            <h4>Order Placed</h4>

                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Sent to the chef's kitchen queue.
                            </p>
                        </div>
                    </div>

                    <div
                        className={`tracker-step ${activeOrder?.status === "cooking"
                                ? "active pulse"
                                : ["ready", "served"].includes(
                                    activeOrder?.status
                                )
                                    ? "completed"
                                    : ""
                            }`}
                    >
                        <div className="step-dot"></div>

                        <div>
                            <h4>Preparing Food</h4>

                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Chef is cooking your fresh meal.
                            </p>
                        </div>
                    </div>

                    <div
                        className={`tracker-step ${activeOrder?.status === "ready"
                                ? "active pulse"
                                : activeOrder?.status === "served"
                                    ? "completed"
                                    : ""
                            }`}
                    >
                        <div className="step-dot"></div>

                        <div>
                            <h4>Ready to Serve</h4>

                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Dish is ready! Waiter is bringing it.
                            </p>
                        </div>
                    </div>

                    <div
                        className={`tracker-step ${activeOrder?.status === "served"
                                ? "active"
                                : ""
                            }`}
                    >
                        <div className="step-dot"></div>

                        <div>
                            <h4>Delivered 🍔</h4>

                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Enjoy your tasty food!
                            </p>
                        </div>
                    </div>

                </div>

                {activeOrder && (
                    <div className="order-items-summary">

                        <h5
                            style={{
                                marginBottom: "8px",
                                borderBottom:
                                    "1px solid var(--glass-border)",
                                paddingBottom: "5px"
                            }}
                        >
                            Ordered Items
                        </h5>

                        {activeOrder.items?.map((it, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.85rem",
                                    marginBottom: "4px"
                                }}
                            >
                                <span>
                                    {it.menuItem?.name || "Dish"}

                                    <span
                                        style={{
                                            color: "var(--text-muted)"
                                        }}
                                    >
                                        {" "}
                                        x{it.quantity}
                                    </span>
                                </span>

                                <span>
                                    ₹{(it.menuItem?.price || 0) * it.quantity}
                                </span>
                            </div>
                        ))}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop:
                                    "1px solid var(--glass-border)",
                                marginTop: "8px",
                                paddingTop: "6px",
                                fontWeight: "bold",
                                fontSize: "0.9rem"
                            }}
                        >
                            <span>Total Paid</span>

                            <span>
                                ₹{activeOrder.totalAmount}
                            </span>
                        </div>

                    </div>
                )}

            </div>

            <button
                className="btn btn-secondary"
                onClick={() => setView("customer-menu")}
            >
                ⬅ Back to Menu
            </button>
        </div>
    );
};

export default CustomerTracker;
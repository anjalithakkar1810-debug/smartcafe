import generateInvoice from "../../utils/generateInvoice";
const CustomerTracker = ({
    activeOrder,
    activeOrderId,
    tableNumber,
    estimatedTime,
    setView
}) => {
    return (
        <div className="tracker-container">
            <div className="card tracker-card">
                <div className="tracker-title">

                    ☕ Smart<span>Cafe</span> Order Status
                </div>
                <div
                    style={{
                        background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                        color: "white",
                        borderRadius: "15px",
                        padding: "18px",
                        margin: "20px 0",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0" }}>
                        🚚 Estimated Delivery
                    </h3>

                    <div
                        style={{
                            background: "rgba(255,255,255,0.3)",
                            height: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            marginBottom: "10px"
                        }}
                    >
                        <div
                            style={{
                                width:
                                    activeOrder?.status === "pending"
                                        ? "25%"
                                        : activeOrder?.status === "cooking"
                                            ? "60%"
                                            : activeOrder?.status === "ready"
                                                ? "90%"
                                                : "100%",
                                height: "100%",
                                background: "#FFD54F",
                                transition: "0.5s"
                            }}
                        ></div>
                    </div>

                    <p style={{ margin: 0, fontWeight: "bold" }}>
                        {activeOrder?.status === "pending" && "⏱ About 20 minutes"}
                        {activeOrder?.status === "cooking" && "🍳 About 12 minutes"}
                        {activeOrder?.status === "ready" && "🍽 Almost there (2 minutes)"}
                        {activeOrder?.status === "served" && "✅ Delivered Successfully"}
                    </p>
                    <div
                        style={{
                            background: "#1f2937",
                            color: "#fff",
                            padding: "12px",
                            borderRadius: "10px",
                            margin: "15px 0",
                            textAlign: "center"
                        }}
                    >
                        <h4 style={{ margin: 0 }}>⏱ Estimated Delivery Time</h4>

                        <p
                            style={{
                                margin: "8px 0 0",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#fbbf24"
                            }}
                        >
                            {estimatedTime} Minutes
                        </p>
                    </div>
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
            {activeOrder?.status === "served" && (
                <button
                    className="btn btn-primary"
                    style={{ marginBottom: "10px" }}
                    onClick={() => generateInvoice(activeOrder)}
                >
                    📄 Download Invoice
                </button>
            )}
            <p>Status: {activeOrder?.status}</p>
            <p>Order ID: {activeOrder?._id}</p>
            <p>Table Number: {activeOrder?.tableNumber}</p>
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
const AdminMenu = ({
    adminActiveTab,
    setAdminActiveTab,
    setSidebarOpen,
}) => {
    return (
        <nav className="admin-menu">
            <div
                className={`admin-menu-item ${adminActiveTab === "orders" ? "active" : ""
                    }`}
                onClick={() => {
                    setAdminActiveTab("orders");
                    setSidebarOpen(false);
                }}
            >
                📋 Kitchen Orders
            </div>

            <div
                className={`admin-menu-item ${adminActiveTab === "menu-manager" ? "active" : ""
                    }`}
                onClick={() => {
                    setAdminActiveTab("menu-manager");
                    setSidebarOpen(false);
                }}
            >
                🍔 Edit Menu Items
            </div>

            <div
                className={`admin-menu-item ${adminActiveTab === "qr-generator" ? "active" : ""
                    }`}
                onClick={() => {
                    setAdminActiveTab("qr-generator");
                    setSidebarOpen(false);
                }}
            >
                🖨️ Table QR Codes
            </div>

            <div
                className={`admin-menu-item ${adminActiveTab === "stats" ? "active" : ""
                    }`}
                onClick={() => {
                    setAdminActiveTab("stats");
                    setSidebarOpen(false);
                }}
            >
                📈 Sales & Analytics
            </div>
            <div
                className={`admin-menu-item ${adminActiveTab === "reviews" ? "active" : ""
                    }`}
                onClick={() => {
                    setAdminActiveTab("reviews");
                    setSidebarOpen(false);
                }}
            >
                ⭐ Customer Reviews
            </div>
        </nav>
    );
};

export default AdminMenu;
const AdminMenu = ({
    adminActiveTab,
    setAdminActiveTab
}) => {
    return (
        <nav className="admin-menu">
            <div
                className={`admin-menu-item ${adminActiveTab === "orders" ? "active" : ""
                    }`}
                onClick={() => setAdminActiveTab("orders")}
            >
                📋 Kitchen Orders
            </div>

            <div
                className={`admin-menu-item ${adminActiveTab === "menu-manager" ? "active" : ""
                    }`}
                onClick={() => setAdminActiveTab("menu-manager")}
            >
                🍔 Edit Menu Items
            </div>

            <div
                className={`admin-menu-item ${adminActiveTab === "qr-generator" ? "active" : ""
                    }`}
                onClick={() => setAdminActiveTab("qr-generator")}
            >
                🖨️ Table QR Codes
            </div>

            <div
                className={`admin-menu-item ${adminActiveTab === "stats" ? "active" : ""
                    }`}
                onClick={() => setAdminActiveTab("stats")}
            >
                📈 Sales & Analytics
            </div>
        </nav>
    );
};

export default AdminMenu;
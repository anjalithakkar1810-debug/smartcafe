const Header = ({
    view,
    adminToken,
    setView,
    handleAdminLogout
}) => {
    return (
        <>
            {view !== "customer-menu" &&
                view !== "customer-tracker" && (
                    <header className="nav-bar">
                        <div
                            className="nav-logo"
                            onClick={() => setView("role-selection")}
                            style={{ cursor: "pointer" }}
                        >
                            ☕ Smart<span>Cafe</span>
                        </div>

                        <div className="nav-links">
                            {adminToken ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleAdminLogout}
                                >
                                    Logout Admin
                                </button>
                            ) : (
                                view !== "admin-login" && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setView("admin-login")}
                                    >
                                        Staff Login
                                    </button>
                                )
                            )}
                        </div>
                    </header>
                )}
        </>
    );
};

export default Header;
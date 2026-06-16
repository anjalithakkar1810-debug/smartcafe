const AdminLogin = ({
    adminUsername,
    setAdminUsername,
    adminPassword,
    setAdminPassword,
    handleAdminLogin,
    handleRegisterTestAdmin,
    adminError
}) => {
    return (
        <div className="container">
            <div className="glass-card auth-card">

                <h2>👨‍🍳 Staff Login</h2>

                {adminError && (
                    <p style={{ color: "red", marginBottom: "15px" }}>
                        {adminError}
                    </p>
                )}

                <form onSubmit={handleAdminLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-input"
                            required
                            placeholder="e.g. admin"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            required
                            placeholder="e.g. admin123"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: "10px" }}
                    >
                        Login to Dashboard
                    </button>
                </form>

                <div
                    style={{
                        marginTop: "25px",
                        borderTop: "1px solid var(--glass-border)",
                        paddingTop: "20px",
                        textAlign: "center"
                    }}
                >
                    <p
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            marginBottom: "10px"
                        }}
                    >
                        No account? Deploy a quick test admin database user:
                    </p>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: "100%", fontSize: "0.85rem" }}
                        onClick={handleRegisterTestAdmin}
                    >
                        Register Test Admin Account
                    </button>

                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--accent)",
                            marginTop: "8px"
                        }}
                    >
                        User: admin | Pass: admin123
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;
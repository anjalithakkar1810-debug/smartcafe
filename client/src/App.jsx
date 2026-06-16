import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  loginUser,
  registerUser
} from "./services/authService";

import {
  createOrder,
  getOrderById,
  getActiveOrders,
  getOrderHistory,
  updateOrderStatus
} from "./services/orderService";

import {
  getAllMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuAvailability
} from "./services/menuService";

import AdminMenu from "./components/Admin/AdminMenu";
import Header from "./components/Shared/Header";
import AdminLogin from "./components/Admin/AdminLogin";
import CheckoutModal from "./components/Customer/CheckoutModal";
import CustomerTracker from "./components/Customer/CustomerTracker";



function App() {
  // Navigation & Role Views
  // Views: 'role-selection' | 'customer-menu' | 'customer-tracker' | 'admin-login' | 'admin-dashboard'
  const [view, setView] = useState('role-selection');

  // Menu Data
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Cart & Order states
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const [tableNumber, setTableNumber] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  // Admin states
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('adminUser')) || null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState('orders'); // 'orders' | 'menu-manager' | 'stats'

  // Admin Live Orders & Stats
  const [activeOrders, setActiveOrders] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Admin Add/Edit Menu Item Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null); // null for add, item object for edit
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mains',
    imageUrl: '',
    isAvailable: true
  });

  // Sound enable & Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousOrdersCountRef = useRef(0);
  const [qrTableNumber, setQrTableNumber] = useState('');

  // Synth Audio notification for new orders
  const playNewOrderSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      // Play a cute "beep-beep" chime
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio Context error (User interaction required first):', e);
    }
  };

  // Fetch Menu Items (Shared)
  const fetchMenu = async () => {
    setMenuLoading(true);

    try {

      const data = await getAllMenu();

      setMenuItems(data);

    } catch (error) {

      console.error(error);

    } finally {

      setMenuLoading(false);

    }
  };

  // Initial menu load
  useEffect(() => {
    fetchMenu();
    // Read table query parameter on load
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
      setView('customer-menu');
    }
  }, []);

  // Customer: Poll Order Status when in tracker view
  useEffect(() => {
    let intervalId;

    if (view === "customer-tracker" && activeOrderId) {

      const fetchOrderStatus = async () => {
        try {

          const data = await getOrderById(activeOrderId);

          setActiveOrder(data);

          if (data.status === "served") {
            // Order complete
          }

        } catch (error) {
          console.error("Error tracking order:", error);
        }
      };

      fetchOrderStatus();

      intervalId = setInterval(fetchOrderStatus, 3000);

    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

  }, [view, activeOrderId]);

  // Admin: Poll Active Orders when on Dashboard


  // Check if there are new orders to play sound
  useEffect(() => {
    let intervalId;

    if (
      view === "admin-dashboard" &&
      adminToken &&
      adminActiveTab === "orders"
    ) {

      const fetchActiveOrders = async () => {
        try {

          const data = await getActiveOrders(adminToken);

          setActiveOrders(data);

          if (data.length > previousOrdersCountRef.current) {

            if (previousOrdersCountRef.current > 0) {
              playNewOrderSound();
            }

          }

          previousOrdersCountRef.current = data.length;

        } catch (error) {
          console.error("Error fetching active orders:", error);
        }
      };

      fetchActiveOrders();

      intervalId = setInterval(fetchActiveOrders, 4000);

    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

  }, [view, adminToken, adminActiveTab, soundEnabled]);

  // Admin: Load stats/history when clicking stats tab
  // Admin: Load stats/history when clicking stats tab
  useEffect(() => {
    if (
      view === "admin-dashboard" &&
      adminToken &&
      adminActiveTab === "stats"
    ) {

      const fetchStats = async () => {
        try {

          const data = await getOrderHistory(adminToken);

          setOrdersHistory(data);

        } catch (error) {

          console.error(
            "Error fetching orders history:",
            error
          );

        }
      };

      fetchStats();

    }
  }, [view, adminToken, adminActiveTab]);

  // Customer Cart logic
  const handleAddToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = menuItems.find((i) => i._id === itemId);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  };

  // Place Order API Call
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!tableNumber.trim()) {
      alert("Please enter a Table Number");
      return;
    }

    const orderItems = Object.entries(cart).map(([itemId, qty]) => ({
      menuItem: itemId,
      quantity: qty
    }));

    const orderData = {
      tableNumber,
      items: orderItems,
      totalAmount: getCartTotal()
    };

    try {

      const createdOrder = await createOrder(orderData);

      setActiveOrderId(createdOrder._id);
      setActiveOrder(createdOrder);

      setCart({});
      setIsCheckoutOpen(false);
      setView("customer-tracker");

    } catch (error) {

      console.error(error);
      alert(error.message);

    }
  };

  // Admin Authentication
  const handleAdminLogin = async (e) => {

    e.preventDefault();

    setAdminError("");

    try {

      const data = await loginUser(
        adminUsername,
        adminPassword
      );

      setAdminToken(data.token);
      setAdminUser(data);

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(data)
      );

      setView("admin-dashboard");

      setAdminUsername("");
      setAdminPassword("");

    } catch (error) {

      setAdminError(error.message);

    }

  };

  // Admin Test Account Auto-Registration helper
  const handleRegisterTestAdmin = async () => {
    setAdminError("");

    try {

      const data = await registerUser({
        username: "admin",
        password: "admin123",
        role: "admin"
      });

      alert(
        "Test account auto-registered! Username: admin, Password: admin123. Logging you in..."
      );

      setAdminToken(data.token);
      setAdminUser(data);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data));

      setView("admin-dashboard");

    } catch (error) {

      console.error(error);
      setAdminError(error.message);

    }
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setView('role-selection');
  };

  // Admin: Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {

      await updateOrderStatus(
        orderId,
        newStatus,
        adminToken
      );

      // Re-fetch active orders immediately
      const data = await getActiveOrders(adminToken);

      setActiveOrders(data);

      previousOrdersCountRef.current = data.length;

    } catch (error) {

      console.error(
        "Error updating order status:",
        error
      );

    }
  };

  // Admin: Toggle Menu Item Availability
  const handleToggleMenuAvailability = async (item) => {
    try {

      await toggleMenuAvailability(
        item._id,
        !item.isAvailable,
        adminToken
      );

      // Refresh Menu
      fetchMenu();

    } catch (error) {

      console.error(
        "Error toggling availability:",
        error
      );

    }
  };
  // Admin: Delete Menu Item
  const handleDeleteMenuItem = async (id) => {

    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {

      await deleteMenuItem(id, adminToken);

      // Refresh Menu
      fetchMenu();

    } catch (error) {

      console.error(
        "Error deleting menu item:",
        error
      );

    }
  };

  // Admin: Create or Update Menu Item (Form submit)
  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.price || !menuForm.category) {
      alert('Please fill in Name, Price, and Category');
      return;
    }
    try {

      const menuData = {
        ...menuForm,
        price: Number(menuForm.price)
      };

      if (editingMenuItem) {

        await updateMenuItem(
          editingMenuItem._id,
          menuData,
          adminToken
        );

      } else {

        await createMenuItem(
          menuData,
          adminToken
        );

      }

      setIsMenuModalOpen(false);
      setEditingMenuItem(null);

      setMenuForm({
        name: "",
        description: "",
        price: "",
        category: "Mains",
        imageUrl: "",
        isAvailable: true
      });

      fetchMenu();

    } catch (error) {

      console.error("Error saving item:", error);

      alert(error.message);

    }
  };




  const openAddMenuModal = () => {
    setEditingMenuItem(null);
    setMenuForm({
      name: '',
      description: '',
      price: '',
      category: 'Mains',
      imageUrl: '',
      isAvailable: true
    });
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (item) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable
    });
    setIsMenuModalOpen(true);
  };

  // Calculate statistics (Stats Tab)
  const getTotalSalesRevenue = () => {
    return ordersHistory
      .filter((o) => o.status === 'served')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  const getDishesPopularity = () => {
    const counts = {};
    ordersHistory.forEach((o) => {
      o.items.forEach((it) => {
        if (it.menuItem) {
          counts[it.menuItem.name] = (counts[it.menuItem.name] || 0) + it.quantity;
        }
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5
  };

  return (
    <div className="App">
      {/* HEADER BAR (Visible unless inside mobile customer views for immersive feels) */}
      {view !== 'customer-menu' && view !== 'customer-tracker' && (
        <Header
          view={view}
          adminToken={adminToken}
          setView={setView}
          handleAdminLogout={handleAdminLogout}
        />
      )}

      {/* VIEW 1: ROLE SELECTION */}
      {view === 'role-selection' && (
        <div className="container role-container">
          <div className="role-title">Welcome to ☕ <span>SmartCafe</span></div>
          <div className="role-subtitle">Select your portal to start exploring MERN application</div>

          <div className="role-cards">
            {/* Customer portal */}
            <div className="card role-card" onClick={() => setView('customer-menu')}>
              <div className="role-icon">📱</div>
              <h2>Customer Menu</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                Scan a simulated QR code, browse foods, place an order, and track status live.
              </p>
            </div>

            {/* Admin portal */}
            <div className="card role-card" onClick={() => (adminToken ? setView('admin-dashboard') : setView('admin-login'))}>
              <div className="role-icon">🖥️</div>
              <h2>Admin Dashboard</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                Manage live orders queue, toggle menu availability, edit prices, and view sales charts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CUSTOMER DIGITAL MENU */}
      {view === 'customer-menu' && (
        <div className="menu-layout">
          <div className="menu-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div className="nav-logo" onClick={() => setView('role-selection')} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                ☕ Smart<span>Cafe</span>
              </div>
              {activeOrderId && (
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setView('customer-tracker')}>
                  Track Active Order ➔
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search dishes... (e.g. coffee, burger)"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Tab Scroll */}
          <div className="menu-categories">
            {['All', 'Starters', 'Mains', 'Drinks', 'Desserts', 'Snacks'].map((cat) => (
              <button
                key={cat}
                className={`category-tab ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food Items List */}
          <div className="items-grid">
            {menuLoading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading menu items...</p>
            ) : menuItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <p>No dishes in the menu yet.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>Go to Admin Dashboard to add delicious dishes!</p>
              </div>
            ) : (
              menuItems
                .filter((item) => categoryFilter === 'All' || item.category === categoryFilter)
                .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <div key={item._id} className="food-card">
                    {!item.isAvailable && (
                      <div className="out-of-stock-badge">
                        <span>OUT OF STOCK</span>
                      </div>
                    )}
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="food-image" />
                    ) : (
                      <div className="food-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🍔</div>
                    )}
                    <div className="food-info">
                      <div className="food-name">{item.name}</div>
                      <div className="food-desc">{item.description || 'Tasty cafe dish cooked fresh on order.'}</div>
                      <div className="food-footer">
                        <div className="food-price">₹{item.price}</div>

                        {/* Cart add/remove controls */}
                        {cart[item._id] ? (
                          <div className="quantity-control">
                            <button className="qty-btn" onClick={() => handleRemoveFromCart(item._id)}>-</button>
                            <span style={{ fontWeight: 600 }}>{cart[item._id]}</span>
                            <button className="qty-btn" onClick={() => handleAddToCart(item._id)}>+</button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '15px' }}
                            onClick={() => handleAddToCart(item._id)}
                            disabled={!item.isAvailable}
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Floating Cart checkout bar */}
          {getCartItemsCount() > 0 && (
            <div className="cart-footer">
              <div className="cart-summary">
                <span className="cart-count">{getCartItemsCount()} item(s) selected</span>
                <span className="cart-total">Total: ₹{getCartTotal()}</span>
              </div>
              <button className="btn btn-primary" onClick={() => setIsCheckoutOpen(true)}>
                Place Order ➔
              </button>
            </div>
          )}

          {/* TABLE NUMBER & CHECKOUT DIALOG MODAL */}
         {isCheckoutOpen && (
  <CheckoutModal
    cart={cart}
    menuItems={menuItems}
    getCartTotal={getCartTotal}
    tableNumber={tableNumber}
    setTableNumber={setTableNumber}
    setIsCheckoutOpen={setIsCheckoutOpen}
    handlePlaceOrder={handlePlaceOrder}
  />
)}
        </div>  
      )}

      {/* VIEW 3: CUSTOMER ORDER LIVE TRACKER */}
   {view === "customer-tracker" && (
  <CustomerTracker
    activeOrder={activeOrder}
    activeOrderId={activeOrderId}
    tableNumber={tableNumber}
    setView={setView}
  />
)}

      {/* VIEW 4: STAFF/ADMIN LOGIN */}
      {view === "admin-login" && (
        <AdminLogin
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          adminError={adminError}
          handleAdminLogin={handleAdminLogin}
          handleRegisterTestAdmin={handleRegisterTestAdmin}
        />
      )}

      {/* VIEW 5: STAFF/ADMIN DASHBOARD */}
      {view === 'admin-dashboard' && (
        <div className="admin-layout">
          {/* SIDEBAR */}
          <aside className="admin-sidebar">
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>☕ Staff Control</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>ROLE: {adminUser?.role?.toUpperCase()}</div>
            </div>

            <AdminMenu
              adminActiveTab={adminActiveTab}
              setAdminActiveTab={setAdminActiveTab}
            />

            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '15px' }}>{adminUser?.username}</div>
              <button className="btn btn-danger" style={{ width: '100%', padding: '8px' }} onClick={handleAdminLogout}>
                Log Out
              </button>
            </div>
          </aside>

          {/* DASHBOARD CONTENT BODY */}
          <main className="admin-content">

            {/* TAB A: KITCHEN QUEUE */}
            {adminActiveTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1>Kitchen Active Queue</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Cook and manage customer orders in real-time</p>
                  </div>

                  {/* Sound Toggle Alert */}
                  <div className="sound-trigger-alert">
                    <span style={{ marginRight: '10px' }}>🔊 Sound alert on new orders:</span>
                    <input
                      type="checkbox"
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                    />
                  </div>
                </div>

                <div className="kitchen-board">
                  {/* Column 1: PENDING */}
                  <div className="board-col">
                    <div className="col-header">
                      <span>NEW ORDERS</span>
                      <span className="col-count badge badge-pending">
                        {activeOrders.filter((o) => o.status === 'pending').length}
                      </span>
                    </div>

                    {activeOrders.filter((o) => o.status === 'pending').map((order) => (
                      <div key={order._id} className="card ticket-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                        <div className="ticket-header">
                          <span className="ticket-table">Table {order.tableNumber}</span>
                          <span className="ticket-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="ticket-items">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="ticket-item">
                              <span>{it.menuItem?.name || 'Deleted Item'}</span>
                              <span className="ticket-item-qty">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="ticket-actions">
                          <button
                            className="btn btn-primary ticket-btn"
                            onClick={() => handleUpdateOrderStatus(order._id, 'cooking')}
                          >
                            Accept & Cook 🍳
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2: COOKING */}
                  <div className="board-col">
                    <div className="col-header">
                      <span>PREPARING</span>
                      <span className="col-count badge badge-cooking">
                        {activeOrders.filter((o) => o.status === 'cooking').length}
                      </span>
                    </div>

                    {activeOrders.filter((o) => o.status === 'cooking').map((order) => (
                      <div key={order._id} className="card ticket-card" style={{ borderLeft: '4px solid var(--info)' }}>
                        <div className="ticket-header">
                          <span className="ticket-table">Table {order.tableNumber}</span>
                          <span className="ticket-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="ticket-items">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="ticket-item">
                              <span>{it.menuItem?.name || 'Deleted Item'}</span>
                              <span className="ticket-item-qty">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="ticket-actions">
                          <button
                            className="btn btn-primary ticket-btn"
                            style={{ backgroundColor: 'var(--success)', color: 'white' }}
                            onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                          >
                            Mark Ready ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 3: READY TO SERVE */}
                  <div className="board-col">
                    <div className="col-header">
                      <span>READY TO SERVE</span>
                      <span className="col-count badge badge-ready">
                        {activeOrders.filter((o) => o.status === 'ready').length}
                      </span>
                    </div>

                    {activeOrders.filter((o) => o.status === 'ready').map((order) => (
                      <div key={order._id} className="card ticket-card" style={{ borderLeft: '4px solid var(--success)' }}>
                        <div className="ticket-header">
                          <span className="ticket-table">Table {order.tableNumber}</span>
                          <span className="ticket-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="ticket-items">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="ticket-item">
                              <span>{it.menuItem?.name || 'Deleted Item'}</span>
                              <span className="ticket-item-qty">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="ticket-actions">
                          <button
                            className="btn btn-secondary ticket-btn"
                            style={{ borderColor: 'var(--success)' }}
                            onClick={() => handleUpdateOrderStatus(order._id, 'served')}
                          >
                            Served & Clear ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: MENU MANAGER */}
            {adminActiveTab === 'menu-manager' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1>Menu Item Manager</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure dishes, descriptions, prices, and stock limits</p>
                  </div>
                  <button className="btn btn-primary" onClick={openAddMenuModal}>
                    Add New Dish +
                  </button>
                </div>

                <div className="menu-table-container">
                  <table className="menu-table">
                    <thead>
                      <tr>
                        <th>Dish Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>In Stock</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description || 'No description'}</div>
                          </td>
                          <td>
                            <span className="badge badge-cooking" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                          </td>
                          <td style={{ fontWeight: 'bold' }}>₹{item.price}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.isAvailable}
                                onChange={() => handleToggleMenuAvailability(item)}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '10px' }}
                              onClick={() => openEditMenuModal(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => handleDeleteMenuItem(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB C: SALES ANALYTICS & STATS */}
            {adminActiveTab === 'stats' && (
              <div>
                <h1 style={{ marginBottom: '30px' }}>Sales & Analytics Dashboard</h1>

                <div className="stats-grid">
                  <div className="card stat-card">
                    <span className="stat-label">Total Completed Revenue</span>
                    <span className="stat-value">₹{getTotalSalesRevenue()}</span>
                  </div>
                  <div className="card stat-card">
                    <span className="stat-label">Orders Handled</span>
                    <span className="stat-value">{ordersHistory.length}</span>
                  </div>
                  <div className="card stat-card">
                    <span className="stat-label">Active Queue size</span>
                    <span className="stat-value">{activeOrders.length} orders</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                  {/* Popular Items Panel */}
                  <div className="card">
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Most Popular Dishes</h3>
                    {getDishesPopularity().length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>No statistics available. Serve some orders first!</p>
                    ) : (
                      getDishesPopularity().map(([name, count], index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <span>{index + 1}. {name}</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{count} ordered</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Recent Activity Log Panel */}
                  <div className="card" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Recent Orders Audit Log</h3>
                    {ordersHistory.slice(0, 10).map((o, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                          <span>Table {o.tableNumber} ({o.status.toUpperCase()})</span>
                          <span>₹{o.totalAmount}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                          Ordered: {o.items.map((it) => `${it.menuItem?.name || 'Dish'} x${it.quantity}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB D: QR CODE GENERATOR */}
            {adminActiveTab === 'qr-generator' && (
              <div>
                <h1 style={{ marginBottom: '10px' }}>Table QR Code Generator</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Generate and print QR codes linked directly to customer tables</p>

                <div className="card" style={{ maxWidth: '500px', padding: '30px' }}>
                  <div className="form-group">
                    <label style={{ fontWeight: '500', marginBottom: '10px', display: 'block' }}>Enter Table Number</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 1, 2, 5, 12"
                      value={qrTableNumber}
                      onChange={(e) => setQrTableNumber(e.target.value)}
                    />
                  </div>
                  {qrTableNumber && (
                    <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ marginBottom: '15px' }}>Table {qrTableNumber} QR Code</h4>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`http://localhost:5173/?table=${qrTableNumber}`)}`}
                        alt={`QR Code Table ${qrTableNumber}`}
                        style={{ background: 'white', padding: '10px', borderRadius: '6px', width: '180px', height: '180px' }}
                      />
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '15px' }}>
                        Customer URL: <a href={`http://localhost:5173/?table=${qrTableNumber}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>http://localhost:5173/?table={qrTableNumber}</a>
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: '20px', width: '100%' }}
                        onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`http://localhost:5173/?table=${qrTableNumber}`)}`, '_blank')}
                      >
                        Print / Open High-Res QR 🖨️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ADMIN ADD/EDIT MENU MODAL POPUP */}
      {isMenuModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSaveMenuItem}>
            <h3 style={{ marginBottom: '20px' }}>{editingMenuItem ? 'Edit Menu Dish' : 'Add New Dish to Menu'}</h3>

            <div className="form-group">
              <label>Dish Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Cheese Garlic Bread"
                value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                placeholder="Describe this dish... (spiciness, key ingredients)"
                style={{ height: '70px', resize: 'none' }}
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Price (in ₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  placeholder="e.g. 150"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-input"
                  value={menuForm.category}
                  onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                >
                  <option value="Starters">Starters</option>
                  <option value="Mains">Mains</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Paste an online image URL, or leave blank"
                value={menuForm.imageUrl}
                onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setIsMenuModalOpen(false); setEditingMenuItem(null); }}
              >
                Cancel
              </button>1
              <button type="submit" className="btn btn-primary">
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Users, Package,
    LogOut, MessageSquare, BarChart, FileText, CheckCircle, Clock,
    Search, Bell, Settings, ChevronRight, TrendingUp, TrendingDown,
    ArrowUpRight, List, Grid, Calendar, Plus, Trash2, Edit3, Filter,
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
    MoreVertical, ExternalLink, Activity, Shield, Terminal, Loader2
=======
    MoreVertical, ExternalLink, Activity, Shield, Terminal, EyeOff, X
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- INTERACTIVE SUB-COMPONENTS ---
const StatCard = ({ stat }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/[0.02] group hover:border-[#D11919]/20 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl bg-black/5 group-hover:bg-[#D11919]/5 transition-colors`}>
                <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-black ${stat.isPositive ? 'text-green-500' : 'text-red-500'} uppercase tracking-widest`}>
                {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
            </div>
        </div>
        <p className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
        <h3 className="text-3xl font-black text-black tracking-tighter">{stat.value}</h3>
    </motion.div>
);

const LiveChart = () => (
    <div className="h-64 flex items-end gap-3 mt-10">
        {[40, 70, 45, 90, 65, 80, 50, 85, 45, 75, 55, 95, 60, 40].map((h, i) => (
            <motion.div 
                key={i} 
                initial={{ height: 0 }} 
                animate={{ height: `${h}%` }} 
                className="flex-1 bg-black/[0.03] rounded-xl hover:bg-[#D11919] transition-all relative group/bar"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#D11919]/10 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-xl" />
            </motion.div>
        ))}
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
    
    // Remote Data States
    const [products, setProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({ revenue: 0, activeOrders: 0, totalUsers: 0, conversion: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProductForm, setNewProductForm] = useState({ name: '', brand: '', price: '', category: '', stock: '' });

    // System Logs State
=======
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [liveOrders, setLiveOrders] = useState(24);
    
    // Add Product Modal State
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: '', stock: '', category: '', image: '' });

    const handleAddProduct = (e) => {
        e.preventDefault();
        const p = {
            id: 'PROD-' + Date.now(),
            ...newProduct,
            isNew: true
        };
        setProducts([p, ...products]);
        setIsAddProductOpen(false);
        setNewProduct({ name: '', brand: '', price: '', stock: '', category: '', image: '' });
    };

    const toggleProductStatus = (id) => {
        setProducts(products.map(p => p.id === id ? { ...p, disabled: !p.disabled } : p));
    };

    // Dynamic Orders State
    const [recentOrders, setRecentOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
    const [logs, setLogs] = useState([
        'PAYMENT_SUCCESS: CLUSTER_0', 
        'INVENTORY_SYNC: REAL_TIME', 
        'DATABASE_LINK: ACTIVE'
    ]);

<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
    // Fetch From Backend
    useEffect(() => {
        const fetchRemoteData = async () => {
            try {
                setLoading(true);
                const [prodRes, ordRes, statRes, userRes] = await Promise.all([
                    fetch('http://localhost:5001/api/products'),
                    fetch('http://localhost:5001/api/orders/all', { headers: { 'Authorization': `Bearer ${user?.token}` } }),
                    fetch('http://localhost:5001/api/orders/stats', { headers: { 'Authorization': `Bearer ${user?.token}` } }),
                    fetch('http://localhost:5001/api/auth/users', { headers: { 'Authorization': `Bearer ${user?.token}` } })
                ]);

                if (prodRes.ok) setProducts(await prodRes.json());
                if (ordRes.ok) setRecentOrders(await ordRes.json());
                
                if (statRes.ok) {
                    const data = await statRes.json();
                    setDashboardStats({
                        revenue: data.totalRevenue || 0,
                        activeOrders: data.totalOrders || 0,
                        totalUsers: data.totalCustomers || 0,
                        conversion: 4.5
                    });
                }
                
                if (userRes.ok) setUsers(await userRes.json());
                setError(null);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to fetch data from server');
            } finally {
                setLoading(false);
            }
        };
        if (user?.token) fetchRemoteData();
    }, [user?.token]);

    const stats = [
        { label: 'Net Revenue', value: `₹${(dashboardStats?.revenue || 0).toLocaleString()}`, change: '+12.5%', isPositive: true, icon: ShoppingBag, color: '#D11919' },
        { label: 'Active Orders', value: (dashboardStats?.activeOrders || 0).toString(), change: '+8.2%', isPositive: true, icon: Package, color: '#3B82F6' },
        { label: 'Total Users', value: (dashboardStats?.totalUsers || 0).toString(), change: '-2.4%', isPositive: false, icon: Users, color: '#10B981' },
        { label: 'Conversion', value: `${dashboardStats?.conversion || 0}%`, change: '+1.1%', isPositive: true, icon: BarChart, color: '#8B5CF6' },
    ];

    const handleAcceptOrder = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ status: 'Packed' })
            });
            if (res.ok) {
                // Refresh data
                const ordRes = await fetch('http://localhost:5001/api/orders/all', {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                setRecentOrders(await ordRes.json());
                setLogs(prev => [`ORDER_ACCEPTED: ${orderId}`, ...prev].slice(0, 5));
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

=======
    // Fetch Admin Data
    useEffect(() => {
        const fetchAdminData = async () => {
            console.log('Fetching Admin Data with token:', user?.token?.slice(0, 10) + '...');
            try {
                const headers = { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch Orders
                const ordersRes = await fetch('http://localhost:5000/api/orders/all', { headers });
                const ordersData = await ordersRes.json();
                console.log('Orders Data:', ordersData);
                if (ordersRes.ok) setRecentOrders(ordersData);

                // Fetch Customers
                const usersRes = await fetch('http://localhost:5000/api/auth/users', { headers });
                const usersData = await usersRes.json();
                console.log('Users Data:', usersData);
                if (usersRes.ok) setCustomers(usersData);

                // Fetch Stats
                const statsRes = await fetch('http://localhost:5000/api/orders/stats', { headers });
                const statsData = await statsRes.json();
                console.log('Stats Data:', statsData);
                if (statsRes.ok) setAdminStats(statsData);

                // Fetch Products from DB
                const productsRes = await fetch('http://localhost:5000/api/products');
                const productsData = await productsRes.json();
                console.log('Products Data:', productsData);
                if (productsRes.ok) setProducts(productsData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchAdminData();
        }
    }, [user?.token]);

    const handleAcceptOrder = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Shipped' })
            });
            if (res.ok) {
                setRecentOrders(prev => prev.map(order => 
                    order._id === orderId ? { ...order, status: 'Shipped' } : order
                ));
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const stats = [
        { label: 'Net Revenue', value: `₹${adminStats?.totalRevenue?.toLocaleString() || '0'}`, change: '+12.5%', isPositive: true, icon: ShoppingBag, color: '#D11919' },
        { label: 'Active Orders', value: adminStats?.pendingOrders?.toString() || recentOrders.length.toString() || '0', change: '+8.2%', isPositive: true, icon: Package, color: '#3B82F6' },
        { label: 'Total Users', value: (customers?.length || 0).toString(), change: '+2.4%', isPositive: true, icon: Users, color: '#10B981' },
        { label: 'Conversion', value: '3.24%', change: '+1.1%', isPositive: true, icon: BarChart, color: '#8B5CF6' },
    ];

>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
    const menuItems = [
        { group: 'Terminal', items: [
            { name: 'Overview', icon: Grid },
            { name: 'Products', icon: Package },
            { name: 'Orders', icon: ShoppingBag },
            { name: 'Analytics', icon: BarChart },
        ]},
        { group: 'Operational', items: [
            { name: 'Customers', icon: Users },
            { name: 'Inventory', icon: List },
        ]},
    ];

<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
    const OverviewView = () => (
        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
=======
    const StatCard = ({ stat }) => (
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 flex flex-col justify-between group hover:border-[#D11919]/30 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-black/5 rounded-xl group-hover:bg-[#D11919]/10 transition-colors text-black group-hover:text-[#D11919]">
                    <stat.icon size={20} />
                </div>
                <span className={`text-[12px] font-black ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>{stat.change}</span>
            </div>
            <p className="text-[11px] font-black text-black/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-black tracking-tighter">{stat.value}</h3>
        </div>
    );

    const LiveChart = () => (
        <div className="h-64 flex items-end gap-2 w-full">
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${20 + Math.random() * 80}%` }} 
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex-1 bg-black/5 hover:bg-[#D11919] rounded-t-md transition-colors"
                />
            ))}
        </div>
    );

    const OverviewView = () => (
        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-semibold">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">₹{dashboardStats.revenue.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-semibold">Active Orders</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{dashboardStats.activeOrders}</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-semibold">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{dashboardStats.totalUsers}</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-semibold">Conversion Rate</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{dashboardStats.conversion}%</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Recent Orders</h3>
                    <div className="space-y-3">
                        {recentOrders.map((order, i) => (
                            <div key={order._id || i} className="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-100">
                                <div>
                                    <p className="font-bold text-gray-800">{order.customer?.name || 'Guest User'}</p>
                                    <p className="text-xs text-gray-500 tracking-wide mt-1">#{order._id?.slice(-6) || 'N/A'} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#D11919]">₹{order.totalAmount || 0}</p>
                                    <p className="text-[10px] uppercase font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded mt-1 inline-block">{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Quick Information</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        Welcome to the simple version of the admin panel. From here, you can navigate to the <strong className="text-gray-800">Products</strong> section to add new items or delete existing ones. You can also view more details about transactions in the <strong className="text-gray-800">Orders</strong> tab. 
                    </p>
                    <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200 my-4 text-sm font-medium">
                        ✓ API Database connection is active and syncing.
                    </div>
=======
            <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Activity Feed .</h3>
                    <button onClick={() => setActiveTab('Orders')} className="text-[10px] font-black text-[#D11919] flex items-center gap-2 hover:gap-3 transition-all tracking-[0.3em]">
                        ACCESS DATABASE <ArrowUpRight size={14} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/5">
                    {recentOrders.map((order, i) => (
                        <div key={i} className="p-8 hover:bg-white/[0.04] transition-all group cursor-pointer border-r border-white/5 last:border-0">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-[#D11919] tracking-widest">{order?._id?.slice(-8) || 'N/A'}</span>
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{order?.createdAt ? new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'NEW'}</span>
                            </div>
                            <p className="font-black text-[13px] uppercase mb-1 tracking-tight truncate max-w-[120px]">{order?.user?.name || 'Guest User'}</p>
                            <p className="font-black text-xl mb-4 text-white/90">₹{order?.totalPrice?.toLocaleString()}</p>
                            <div className={`inline-block px-5 py-2.5 bg-white/5 text-white/60 group-hover:bg-[#D11919] group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all`}>
                                {order?.status}
                            </div>
                        </div>
                    ))}
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                </div>
            </div>
        </motion.div>
    );

    const handleDeleteProduct = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter(item => item.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5001/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...newProductForm, 
                    price: Number(newProductForm.price), 
                    stock: Number(newProductForm.stock),
                    image: '/images/nike_pegasus_1773250233228.png', 
                    isNew: true 
                })
            });
            if (res.ok) {
                const savedProduct = await res.json();
                setProducts([savedProduct, ...products]);
                setIsAddModalOpen(false);
                setNewProductForm({ name: '', brand: '', price: '', category: '', stock: '' });
                setLogs(prev => [`PRODUCT_CREATED: ${savedProduct.name}`, ...prev].slice(0, 5));
            }
        } catch (err) { console.error('Error adding product', err); }
    };

    const ProductsView = () => (
        <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                <div className="relative flex-grow max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH INVENTORY..." 
                        className="w-full bg-black/5 border border-transparent rounded-2xl pl-16 pr-8 py-5 text-[11px] font-black tracking-widest uppercase focus:bg-white focus:border-[#D11919] outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 ml-6">
                    <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><Filter size={20}/></button>
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl">New Item</button>
=======
                    <button onClick={() => setIsAddProductOpen(true)} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl">New Item</button>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                    <motion.div 
                        layout
                        key={product.id}
                        className={`bg-white border border-black/5 rounded-[2.5rem] p-8 hover:border-[#D11919]/50 transition-all group relative overflow-hidden shadow-lg shadow-black/[0.02] ${product.disabled ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                            <button className="p-2 bg-black/5 rounded-lg hover:text-[#D11919]"><Edit3 size={14}/></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
=======
                            <button onClick={() => toggleProductStatus(product.id)} className="p-2 bg-black/5 rounded-lg hover:text-[#D11919]" title={product.disabled ? "Enable Product" : "Disable Product"}><EyeOff size={14}/></button>
                            <button className="p-2 bg-black/5 rounded-lg hover:text-[#D11919]" title="Edit"><Edit3 size={14}/></button>
                            <button onClick={() => setProducts(products.filter(item => item.id !== product.id))} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete"><Trash2 size={14}/></button>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                        </div>
                        <div className="aspect-square bg-black/[0.02] rounded-2xl mb-6 p-4 overflow-hidden relative">
                            <img src={product.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            {product.isNew && (
                                <span className="absolute top-4 left-4 px-4 py-2 bg-[#D11919] text-white text-[9px] font-black uppercase rounded-lg shadow-lg">New Release</span>
                            )}
                            {product.disabled && (
                                <span className="absolute top-4 left-4 px-4 py-2 bg-black text-white text-[9px] font-black uppercase rounded-lg shadow-lg">Disabled</span>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-[#D11919] transition-colors">{product.name}</h4>
                                    <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest">{product.brand}</p>
                                </div>
                                <p className="font-black text-xl text-[#D11919]">₹{product.price}</p>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-black/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                    <span className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em]">{product.stock} Units</span>
                                </div>
                                <span className="text-[11px] font-black text-black/20 uppercase tracking-widest group-hover:text-black transition-colors">{product.category}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    if (loading || !user) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#D11919] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Syncing System Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#FDFDFD] text-black overflow-hidden font-sans fixed inset-0 z-[1000]">
            {/* Sidebar */}
            <div className="w-[300px] bg-[#F8F8F8] border-r border-black/5 flex flex-col z-10 shrink-0 shadow-2xl shadow-black/[0.02]">
                <div className="p-10 border-b border-black/5 mb-6 bg-white">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-[#D11919] flex items-center justify-center rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <span className="font-black tracking-tighter text-2xl uppercase text-black">ADMIN<span className="text-[#D11919]"> .</span></span>
                            <p className="text-[8px] font-black tracking-[0.4em] text-black/20 uppercase mt-[-4px]">SYSTEM_MANAGEMENT</p>
                        </div>
                    </Link>
                </div>
                
                <div className="flex-1 px-6 space-y-10 overflow-y-auto pt-6">
                    {menuItems.map((group) => (
                        <div key={group.group} className="space-y-3">
                            <p className="px-4 text-[10px] font-black tracking-[0.4em] uppercase text-[#D11919] opacity-60">{group.group}</p>
                            {group.items.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === item.name 
                                        ? 'bg-black text-white shadow-xl translate-x-1' 
                                        : 'text-black/40 hover:text-black hover:bg-black/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon size={18} strokeWidth={2.5} className={activeTab === item.name ? 'text-[#D11919]' : 'text-current'} />
                                        {item.name}
                                    </div>
                                    {activeTab === item.name && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="p-10 border-t border-black/5 space-y-4">
                    <Link to="/" className="w-full flex items-center justify-center gap-4 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-black text-white hover:bg-[#D11919] transition-all shadow-xl">
                        <ExternalLink size={18} /> Public Store
                    </Link>
                    <button 
                        onClick={() => {
                            logout();
                            navigate('/admin/login');
                        }}
                        className="w-full flex items-center justify-center gap-4 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#D11919] bg-[#D11919]/5 hover:bg-[#D11919] hover:text-white transition-all transform active:scale-95"
                    >
                        <LogOut size={18} /> Secure Exit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-[#FFFFFF] relative scrollbar-hide">
                <div className="sticky top-0 z-20 px-10 py-8 flex justify-between items-center backdrop-blur-3xl bg-white/80 border-b border-black/5">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] font-black tracking-[0.4em] text-[#D11919] uppercase">Terminal_Sync // Online</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3 text-[11px] font-black tracking-widest text-black/40 uppercase">
                            <Calendar size={16} />
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="h-6 w-px bg-black/10" />
                        <button className="relative p-2 text-black hover:text-[#D11919] transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D11919] rounded-full border-2 border-white" />
                        </button>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">AD</div>
                    </div>
                </div>

                <div className="p-10 max-w-[1700px] mx-auto space-y-12 bg-transparent">
                    <div className="flex justify-between items-end border-b-8 border-black pb-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <p className="text-[#D11919] text-[11px] font-black tracking-[0.6em] uppercase">Admin Terminal // 2026</p>
                                <div className="h-px w-16 bg-black/10" />
                                <p className="text-[9px] font-black tracking-[0.4em] text-black/10 uppercase">ISSN_0023_491X</p>
                            </div>
                            <h1 className="text-7xl font-black tracking-tighter uppercase text-black leading-none relative">
                                {activeTab}<span className="text-[#D11919]">.</span>
                                <span className="absolute -top-3 -right-20 text-[10px] font-black tracking-[0.3em] text-black/5">VOL_2026 // ED_04</span>
                            </h1>
                        </div>
                        <div className="hidden md:flex gap-4 mb-4">
                            <button className="px-8 py-4 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl active:scale-95">Global Sync</button>
                        </div>
                    </div>

<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                    {error && (
                        <div className="p-4 bg-red-100/50 border border-red-200 text-red-600 rounded-2xl font-bold text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 size={40} className="animate-spin text-[#D11919]" />
                            <span className="text-xs font-black uppercase tracking-widest opacity-50">Fetching API Data...</span>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                        {activeTab === 'Overview' && OverviewView()}
                        {activeTab === 'Products' && ProductsView()}
                        {activeTab === 'Orders' && (
                            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="space-y-6">
                                    {recentOrders.map((order) => (
                                        <div key={order._id} className="bg-white border border-black/5 p-12 rounded-[3rem] transition-all hover:bg-black/[0.01] group relative shadow-sm">
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                                <div className="flex items-center gap-10">
                                                    <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center font-black text-black/20 group-hover:bg-[#D11919] group-hover:text-white transition-all text-xl">
                                                        #{order._id?.slice(-4) || 'NEW'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-3xl mb-2 text-black">{order.customer?.name || 'Customer'}</h4>
                                                        <p className="text-[12px] font-bold text-black/30 uppercase tracking-[0.3em] flex items-center gap-3">
                                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
=======
                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' && <OverviewView />}
                        {activeTab === 'Products' && <ProductsView />}
                        {activeTab === 'Orders' && (
                            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="grid gap-4">
                                    {recentOrders.map((order, i) => (
                                        <div key={i} className="bg-white border border-black/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group hover:border-[#D11919]/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center font-black text-[#D11919]">#{order?._id ? order._id.slice(-4).toUpperCase() : 'N/A'}</div>
                                                <div>
                                                    <h4 className="font-black text-lg uppercase tracking-tight text-black">{order?.user?.name || 'Guest User'}</h4>
                                                    <p className="text-[11px] font-bold text-black/30 uppercase tracking-widest">{order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'} // {order?.paymentMethod || 'Online'}</p>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                                                </div>
                                                <div className="flex-grow lg:flex-grow-0 text-left lg:text-right">
                                                    <p className="text-[12px] font-black text-black/20 uppercase tracking-[0.2em]">Total Amount</p>
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                                                    <p className="font-black text-2xl text-black">₹{order.totalAmount}</p>
=======
                                                    <p className="font-black text-2xl text-black">₹{order.totalPrice?.toLocaleString()}</p>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                                                </div>
                                                <div className={`px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest border-2 ${
                                                    order.status === 'Delivered' ? 'border-green-500/20 text-green-600 bg-green-50' : 
                                                    order.status === 'Shipped' ? 'border-blue-500/20 text-blue-600 bg-blue-50' :
                                                    'border-[#D11919]/20 text-[#D11919] bg-red-50'
                                                }`}>
                                                    {order.status}
                                                </div>
                                                {(order.status === 'Placed' || order.status === 'Pending' || !order.status) && (
                                                    <button 
                                                        onClick={() => handleAcceptOrder(order._id)}
                                                        className="px-10 py-5 bg-black text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl"
                                                    >
                                                        Accept Order
                                                    </button>
                                                )}
                                                <button className="p-4 bg-black/5 rounded-xl hover:text-[#D11919] transition-colors"><ChevronRight size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <div className="text-center py-20 bg-black/5 rounded-[2.5rem] border-2 border-dashed border-black/10">
                                            <p className="text-[11px] font-black text-black/20 uppercase tracking-[0.3em]">No orders found in database</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'Customers' && (
                            <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                                {users.map((user, i) => (
                                    <div key={user._id || i} className="bg-white border border-black/5 p-8 rounded-[2.5rem] group hover:border-[#D11919]/30 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center font-black text-2xl text-black/20 group-hover:bg-[#D11919] group-hover:text-white transition-all">
                                                {user.name ? user.name.split(' ').map(n=>n[0]).join('') : 'U'}
                                            </div>
                                            <span className={`text-[9px] font-black px-4 py-2 rounded-lg border-2 ${
                                                user.role === 'admin' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-black/5 text-black/40'
                                            }`}>{user.role || 'customer'}</span>
=======
                                {customers.map((customer, i) => (
                                    <div key={i} className="bg-white border border-black/5 p-8 rounded-[2.5rem] group hover:border-[#D11919]/30 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center font-black text-2xl text-black/20 group-hover:bg-[#D11919] group-hover:text-white transition-all overflow-hidden">
                                                {customer.avatar ? <img src={customer.avatar} className="w-full h-full object-cover" alt="" /> : (customer.name || 'Customer').split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <span className={`text-[9px] font-black px-4 py-2 rounded-lg border-2 ${
                                                customer.role === 'admin' ? 'border-red-200 text-red-600 bg-red-50' : 'border-black/5 text-black/40'
                                            }`}>{customer.role?.toUpperCase()}</span>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                                        </div>
                                        <h4 className="font-black text-2xl uppercase tracking-tighter mb-2 text-black">{customer.name}</h4>
                                        <p className="text-[13px] font-bold text-black/40 uppercase tracking-[0.2em] mb-12 truncate">{customer.email}</p>
                                        <div className="pt-10 border-t border-black/5 flex justify-between items-center">
                                            <div>
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                                                <p className="text-[11px] font-black text-black/20 uppercase tracking-widest">Total Investment</p>
                                                <p className="font-black text-xl text-black">₹0</p>
=======
                                                <p className="text-[11px] font-black text-black/20 uppercase tracking-widest">Customer ID</p>
                                                <p className="font-black text-xs text-black truncate max-w-[150px]">{customer._id}</p>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                                            </div>
                                            <button className="text-[12px] font-black uppercase text-[#D11919] tracking-widest border-b-2 border-transparent hover:border-[#D11919] transition-all">Profile</button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                        {activeTab === 'Inventory' && (
                            <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-black/5 bg-black/[0.02]">
                                            <tr>
                                                <th className="px-10 py-10 text-[13px] font-black uppercase text-black/40 tracking-[0.4em]">Resource_Identity</th>
                                                <th className="px-10 py-10 text-[13px] font-black uppercase text-black/40 tracking-[0.4em]">Operational_Status</th>
                                                <th className="px-10 py-10 text-[13px] font-black uppercase text-black/40 tracking-[0.4em] text-right">Modifier</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/5">
                                            {products.slice(0, 10).map((item, i) => (
                                                <tr key={i} className="hover:bg-black/[0.01] transition-colors group">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-black/5 rounded-2xl p-2 group-hover:bg-[#D11919]/5 transition-all">
                                                                <img src={item.image} alt="" className="w-full h-full object-contain" />
                                                            </div>
                                                            <span className="font-black text-sm uppercase tracking-tight text-black">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-24 h-2 rounded-full bg-black/5 overflow-hidden">
                                                                <div className={`h-full ${item.stock < 10 ? 'bg-red-500' : 'bg-black'}`} style={{ width: `${Math.min(item.stock * 2, 100)}%` }} />
                                                            </div>
                                                            <span className={`text-[11px] font-black ${item.stock < 10 ? 'text-red-500' : 'text-black/40'}`}>{item.stock} UNITS</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <button className="text-[11px] font-black uppercase text-black/30 hover:text-[#D11919] transition-all tracking-widest">Adjust_Link</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'Analytics' && (
                            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 group">
                                <div className="bg-white border-2 border-black p-12 rounded-[2.5rem] relative overflow-hidden shadow-[30px_30px_0px_rgba(209,25,25,0.05)]">
                                    <div className="flex justify-between items-center mb-12">
                                        <div>
                                            <h4 className="text-[12px] font-black text-[#D11919] uppercase tracking-[0.4em] mb-2">Growth Analysis</h4>
                                            <h2 className="text-5xl font-black text-black tracking-tighter uppercase italic">Live System Data.</h2>
                                        </div>
                                        <div className="flex gap-4">
                                            <button className="px-10 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#D11919] transition-all">Generate_Report</button>
                                        </div>
                                    </div>
                                    <div className="h-[400px] w-full bg-black/[0.02] rounded-[2rem] flex items-center justify-center relative group-hover:bg-[#D11919]/[0.02] transition-colors">
                                        <div className="text-center">
                                            <BarChart size={60} className="text-black/10 mb-6 mx-auto group-hover:text-[#D11919]/30 group-hover:scale-110 transition-all duration-700" />
                                            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-black/20 group-hover:text-[#D11919]/40">Analytics_Engine_Standby</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
<<<<<<< HEAD:frontend/src/pages/admin/AdminDashboard.jsx
                {isAddModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative"
                        >
                            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 p-2 text-black/40 hover:text-[#D11919] transition-colors"><Trash2 size={24} className="opacity-0" /><div className="absolute inset-0 flex items-center justify-center font-bold text-xl">✕</div></button>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Add New Product.</h2>
                            <form onSubmit={handleAddProductSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">Product Name</label>
                                    <input required type="text" value={newProductForm.name} onChange={e => setNewProductForm({...newProductForm, name: e.target.value})} className="w-full bg-black/5 py-4 px-6 rounded-2xl font-bold uppercase tracking-tight text-sm focus:outline-none focus:ring-2 focus:ring-[#D11919]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">Brand</label>
                                        <input required type="text" value={newProductForm.brand} onChange={e => setNewProductForm({...newProductForm, brand: e.target.value})} className="w-full bg-black/5 py-4 px-6 rounded-2xl font-bold uppercase tracking-tight text-sm focus:outline-none focus:ring-2 focus:ring-[#D11919]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">Category</label>
                                        <input required type="text" value={newProductForm.category} onChange={e => setNewProductForm({...newProductForm, category: e.target.value})} className="w-full bg-black/5 py-4 px-6 rounded-2xl font-bold uppercase tracking-tight text-sm focus:outline-none focus:ring-2 focus:ring-[#D11919]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">Price (₹)</label>
                                        <input required type="number" value={newProductForm.price} onChange={e => setNewProductForm({...newProductForm, price: e.target.value})} className="w-full bg-black/5 py-4 px-6 rounded-2xl font-bold uppercase tracking-tight text-sm focus:outline-none focus:ring-2 focus:ring-[#D11919]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">Stock</label>
                                        <input required type="number" value={newProductForm.stock} onChange={e => setNewProductForm({...newProductForm, stock: e.target.value})} className="w-full bg-black/5 py-4 px-6 rounded-2xl font-bold uppercase tracking-tight text-sm focus:outline-none focus:ring-2 focus:ring-[#D11919]" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button type="submit" className="w-full bg-[#D11919] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#D11919]/25 hover:bg-black transition-all">Publish Item</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
=======
                {isAddProductOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-black/[0.02]">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Add New Product</h3>
                                <button onClick={() => setIsAddProductOpen(false)} className="p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Product Name</label>
                                        <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} type="text" className="w-full bg-black/5 border border-transparent rounded-xl px-5 py-4 font-bold text-sm focus:bg-white focus:border-[#D11919] outline-none transition-all" placeholder="E.g. StepUp AirMax" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Brand</label>
                                        <input required value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} type="text" className="w-full bg-black/5 border border-transparent rounded-xl px-5 py-4 font-bold text-sm focus:bg-white focus:border-[#D11919] outline-none transition-all" placeholder="Nike" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Category</label>
                                        <input required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} type="text" className="w-full bg-black/5 border border-transparent rounded-xl px-5 py-4 font-bold text-sm focus:bg-white focus:border-[#D11919] outline-none transition-all" placeholder="Running" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Price (₹)</label>
                                        <input required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} type="number" className="w-full bg-black/5 border border-transparent rounded-xl px-5 py-4 font-bold text-sm focus:bg-white focus:border-[#D11919] outline-none transition-all" placeholder="4999" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Stock</label>
                                        <input required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} type="number" className="w-full bg-black/5 border border-transparent rounded-xl px-5 py-4 font-bold text-sm focus:bg-white focus:border-[#D11919] outline-none transition-all" placeholder="50" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Image URL</label>
                                        <input required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} type="url" className="w-full bg-black/5 border border-transparent rounded-xl px-5 py-4 font-bold text-sm focus:bg-white focus:border-[#D11919] outline-none transition-all" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button type="submit" className="w-full bg-black text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl">Create Item</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
>>>>>>> 8795f6cb2054a9f14f394ce82d1acf8e0772dd14:src/pages/admin/AdminDashboard.jsx
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

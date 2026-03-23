import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Users, Package,
    LogOut, MessageSquare, BarChart, FileText, CheckCircle, Clock,
    Search, Bell, Settings, ChevronRight, TrendingUp, TrendingDown,
    ArrowUpRight, List, Grid, Calendar, Plus, Trash2, Edit3, Filter,
    MoreVertical, ExternalLink, Activity, Shield, Terminal, EyeOff, X
} from 'lucide-react';
import { products as initialProducts } from '../../data/products';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
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
    const [logs, setLogs] = useState([
        'PAYMENT_SUCCESS: CLUSTER_0', 
        'INVENTORY_SYNC: REAL_TIME', 
        'DATABASE_LINK: ACTIVE'
    ]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-black/5 p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Revenue Analytics</h2>
                            <p className="text-xs text-[#666] font-bold uppercase tracking-widest mt-1">Monitoring performance trends</p>
                        </div>
                    </div>
                    <LiveChart />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 flex flex-col justify-between group shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[#D11919]">
                            <Terminal size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Logs</span>
                        </div>
                        <div className="space-y-4 font-mono text-[10px]">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3 text-black/40 hover:text-black transition-colors cursor-default">
                                    <span className="text-[#D11919] shrink-0">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}]</span>
                                    <span className="uppercase tracking-tighter font-bold">{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="w-full py-5 mt-10 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-[#D11919] transition-all transform active:scale-95">
                        Broadcast Sync
                    </button>
                </div>
            </div>

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
                </div>
            </div>
        </motion.div>
    );

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
                    <button onClick={() => setIsAddProductOpen(true)} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl">New Item</button>
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
                            <button onClick={() => toggleProductStatus(product.id)} className="p-2 bg-black/5 rounded-lg hover:text-[#D11919]" title={product.disabled ? "Enable Product" : "Disable Product"}><EyeOff size={14}/></button>
                            <button className="p-2 bg-black/5 rounded-lg hover:text-[#D11919]" title="Edit"><Edit3 size={14}/></button>
                            <button onClick={() => setProducts(products.filter(item => item.id !== product.id))} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete"><Trash2 size={14}/></button>
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
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-16 mt-8 md:mt-0">
                                                <div className="text-right">
                                                    <p className="text-[12px] font-black text-black/20 uppercase tracking-[0.2em]">Total Amount</p>
                                                    <p className="font-black text-2xl text-black">₹{order.totalPrice?.toLocaleString()}</p>
                                                </div>
                                                <div className={`px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest border-2 ${
                                                    order.status === 'Delivered' ? 'border-green-500/20 text-green-600 bg-green-50' : 
                                                    order.status === 'Shipped' ? 'border-blue-500/20 text-blue-600 bg-blue-50' :
                                                    'border-[#D11919]/20 text-[#D11919] bg-red-50'
                                                }`}>
                                                    {order.status}
                                                </div>
                                                {(order.status === 'Pending' || order.status === 'Processing') && (
                                                    <button 
                                                        onClick={() => handleAcceptOrder(order._id)}
                                                        className="px-10 py-5 bg-black text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl"
                                                    >
                                                        Review & Accept
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
                                {customers.map((customer, i) => (
                                    <div key={i} className="bg-white border border-black/5 p-8 rounded-[2.5rem] group hover:border-[#D11919]/30 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center font-black text-2xl text-black/20 group-hover:bg-[#D11919] group-hover:text-white transition-all overflow-hidden">
                                                {customer.avatar ? <img src={customer.avatar} className="w-full h-full object-cover" alt="" /> : (customer.name || 'Customer').split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <span className={`text-[9px] font-black px-4 py-2 rounded-lg border-2 ${
                                                customer.role === 'admin' ? 'border-red-200 text-red-600 bg-red-50' : 'border-black/5 text-black/40'
                                            }`}>{customer.role?.toUpperCase()}</span>
                                        </div>
                                        <h4 className="font-black text-2xl uppercase tracking-tighter mb-2 text-black">{customer.name}</h4>
                                        <p className="text-[13px] font-bold text-black/40 uppercase tracking-[0.2em] mb-12 truncate">{customer.email}</p>
                                        <div className="pt-10 border-t border-black/5 flex justify-between items-center">
                                            <div>
                                                <p className="text-[11px] font-black text-black/20 uppercase tracking-widest">Customer ID</p>
                                                <p className="font-black text-xs text-black truncate max-w-[150px]">{customer._id}</p>
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
                                            <p className="text-4xl font-black text-black">Performance Matrix</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-end gap-6 h-80 relative z-10">
                                        {[60, 40, 85, 55, 95, 75, 90].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center group/item">
                                                <motion.div 
                                                    initial={{ height: 0 }} 
                                                    animate={{ height: `${h}%` }} 
                                                    className="w-full bg-black/[0.03] rounded-xl group-hover/item:bg-[#D11919] transition-all relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#D11919]/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity rounded-xl" />
                                                </motion.div>
                                                <span className="mt-6 text-[10px] font-black text-black/20 uppercase tracking-[0.2em] group-hover/item:text-black transition-colors">Node_0{i+1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        { label: 'Bounce Rate', value: '24.2%', growth: '-2.1%', icon: Activity },
                                        { label: 'Session Time', value: '04:12', growth: '+15%', icon: Clock },
                                        { label: 'New Visitors', value: '1,248', growth: '+12%', icon: Users },
                                        { label: 'Conversion', value: '3.8%', growth: '+0.5%', icon: TrendingUp },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white border-2 border-black/5 p-8 rounded-[2.5rem] group hover:border-black transition-all shadow-lg shadow-black/[0.02]">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-black text-white rounded-xl group-hover:bg-[#D11919] transition-all">
                                                    <item.icon size={20} />
                                                </div>
                                                <span className="text-[12px] font-black text-green-600">{item.growth}</span>
                                            </div>
                                            <p className="text-[11px] font-black text-black/40 uppercase tracking-widest mb-1">{item.label}</p>
                                            <h3 className="text-3xl font-black text-black tracking-tighter">{item.value}</h3>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
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
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

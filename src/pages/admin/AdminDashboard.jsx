import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Users, Package,
    LogOut, MessageSquare, BarChart, FileText, CheckCircle, Clock,
    Search, Bell, Settings, ChevronRight, TrendingUp, TrendingDown,
    ArrowUpRight, List, Grid, Calendar, Plus, Trash2, Edit3, Filter,
    MoreVertical, ExternalLink, Activity, Shield, Terminal
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

    // Dynamic Orders State
    const [recentOrders, setRecentOrders] = useState([
        { id: '#MAG-9482', customer: 'Rahul Sharma', amount: '12,499', status: 'Delivered', time: '2m ago' },
        { id: '#MAG-9481', customer: 'Priya Singh', amount: '4,899', status: 'Shipped', time: '15m ago' },
        { id: '#MAG-9480', customer: 'Amit Patel', amount: '2,999', status: 'Processing', time: '1h ago' },
        { id: '#MAG-9479', customer: 'Neha Gupta', amount: '9,250', status: 'Pending', time: '3h ago' },
    ]);

    // System Logs State
    const [logs, setLogs] = useState([
        'PAYMENT_SUCCESS: #4029', 
        'INVENTORY_SYNC: 142 items', 
        'SSL_HANDSHAKE: OK'
    ]);

    // Dynamic stats animation
    const [currentRevenue, setCurrentRevenue] = useState(245000);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRevenue(prev => prev + Math.floor(Math.random() * 50));
            setLiveOrders(prev => prev + (Math.random() > 0.8 ? 1 : 0));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Net Revenue', value: `₹${currentRevenue.toLocaleString()}`, change: '+12.5%', isPositive: true, icon: ShoppingBag, color: '#D11919' },
        { label: 'Active Orders', value: liveOrders.toString(), change: '+8.2%', isPositive: true, icon: Package, color: '#3B82F6' },
        { label: 'Total Users', value: '8,432', change: '-2.4%', isPositive: false, icon: Users, color: '#10B981' },
        { label: 'Conversion', value: '3.24%', change: '+1.1%', isPositive: true, icon: BarChart, color: '#8B5CF6' },
    ];

    const handleAcceptOrder = (orderId) => {
        setRecentOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, status: 'Shipped', time: 'Just now' } : order
        ));
        setLogs(prev => [`ORDER_ACCEPTED: ${orderId}`, ...prev].slice(0, 5));
    };

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

    // --- INTERACTIVE SUB-COMPONENTS ---

    const AnimatedCounter = ({ value, prefix = "" }) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            let start = 0;
            const end = parseInt(value.toString().replace(/[^0-9]/g, "")) || 0;
            const duration = 1500;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }, [value]);
        return <span>{prefix}{count.toLocaleString()}</span>;
    };

    const LiveChart = () => {
        const [hoveredIndex, setHoveredIndex] = useState(null);
        const dataPoints = [
            { x: 0, y: 80, val: '₹12k' }, 
            { x: 80, y: 40, val: '₹28k' }, 
            { x: 160, y: 65, val: '₹22k' }, 
            { x: 240, y: 25, val: '₹45k' }, 
            { x: 320, y: 55, val: '₹31k' }, 
            { x: 400, y: 15, val: '₹58k' }
        ];

        return (
            <div className="relative h-64 w-full mt-10 p-8 bg-black/[0.02] rounded-[2.5rem] border border-black/5 overflow-hidden group">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none opacity-30">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-black/5" />)}
                </div>
                
                <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d relative z-10 overflow-visible">
                    {/* Shadow Area */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        d="M0,80 L80,40 L160,65 L240,25 L320,55 L400,15 V100 H0 Z"
                        fill="#D11919"
                    />
                    
                    {/* Main Line */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        d="M0,80 L80,40 L160,65 L240,25 L320,55 L400,15"
                        fill="none"
                        stroke="#D11919"
                        strokeWidth="3"
                        className="drop-shadow-[0_8px_15px_rgba(209,25,25,0.2)]"
                    />

                    {/* Interactive Points */}
                    {dataPoints.map((pt, i) => (
                        <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                            <motion.circle
                                cx={pt.x}
                                cy={pt.y}
                                r={hoveredIndex === i ? 7 : 4}
                                fill={hoveredIndex === i ? "#D11919" : "#D11919"}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="cursor-pointer transition-all duration-300"
                            />
                            <AnimatePresence>
                                {hoveredIndex === i && (
                                    <motion.g
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <rect x={pt.x - 25} y={pt.y - 40} width="50" height="25" rx="6" fill="#000" />
                                        <text x={pt.x} y={pt.y - 24} textAnchor="middle" fill="#FFF" className="text-[10px] font-black">{pt.val}</text>
                                    </motion.g>
                                )}
                            </AnimatePresence>
                        </g>
                    ))}
                </svg>

                {/* Axis Labels */}
                <div className="absolute bottom-6 left-12 right-12 flex justify-between text-[11px] font-black text-black/40 uppercase tracking-[0.4em]">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                </div>
            </div>
        );
    };

    const StatCard = ({ stat }) => (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative bg-white p-8 rounded-[2rem] border border-black/5 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:border-[#D11919]/30"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D11919]/5 blur-3xl rounded-full group-hover:bg-[#D11919]/10 transition-colors" />
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#D11919]/5 rounded-2xl border border-[#D11919]/10 group-hover:border-[#D11919]/30 transition-colors">
                    <stat.icon size={20} className="text-[#D11919]" />
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border-2 ${stat.isPositive ? 'border-green-500/20 text-green-600 bg-green-50' : 'border-red-500/20 text-red-600 bg-red-50'}`}>
                            {stat.change}
                        </span>
                    </div>
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black tracking-tighter text-black">
                        <AnimatedCounter value={stat.value} prefix={stat.label === 'Net Revenue' ? '₹' : ''} />
                    </h3>
                </div>
            </div>
            <div className="mt-8 h-12 w-full flex items-end gap-2 opacity-20 group-hover:opacity-100 transition-all duration-700">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`flex-1 rounded-full ${stat.isPositive ? 'bg-green-500' : 'bg-[#D11919]'}`} 
                        style={{ height: `${20 + (Math.sin(i * 0.5) * 30 + 50)}%` }}
                    />
                ))}
            </div>
        </motion.div>
    );

    const OverviewView = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
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
                                <span className="text-[10px] font-black text-[#D11919] tracking-widest">{order.id}</span>
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{order.time}</span>
                            </div>
                            <p className="font-black text-[13px] uppercase mb-1 tracking-tight">{order.customer}</p>
                            <p className="font-black text-xl mb-4 text-white/90">₹{order.amount}</p>
                            <div className="inline-block px-5 py-2.5 bg-white/5 text-white/60 group-hover:bg-[#D11919] group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all">
                                {order.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const ProductsView = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
                    <button className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl">New Item</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                    <motion.div 
                        layout
                        key={product.id}
                        className="bg-white border border-black/5 rounded-[2.5rem] p-8 hover:border-[#D11919]/50 transition-all group relative overflow-hidden shadow-lg shadow-black/[0.02]"
                    >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-black/5 rounded-lg hover:text-[#D11919]"><Edit3 size={14}/></button>
                            <button onClick={() => setProducts(products.filter(item => item.id !== product.id))} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                        </div>
                        <div className="aspect-square bg-black/[0.02] rounded-2xl mb-6 p-4 overflow-hidden relative">
                            <img src={product.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            {product.isNew && (
                                <span className="absolute top-4 left-4 px-4 py-2 bg-[#D11919] text-white text-[9px] font-black uppercase rounded-lg shadow-lg">New Release</span>
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
                        {activeTab === 'Overview' && <OverviewView key="overview" />}
                        {activeTab === 'Products' && <ProductsView key="products" />}
                        {activeTab === 'Orders' && (
                            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="grid gap-4">
                                    {recentOrders.map((order, i) => (
                                        <div key={i} className="bg-white border border-black/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group hover:border-[#D11919]/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center font-black text-[#D11919]">#{order.id.split('-')[1]}</div>
                                                <div>
                                                    <h4 className="font-black text-lg uppercase tracking-tight text-black">{order.customer}</h4>
                                                    <p className="text-[11px] font-bold text-black/30 uppercase tracking-widest">{order.time} // TRNS_GATEWAY_01</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-16 mt-8 md:mt-0">
                                                <div className="text-right">
                                                    <p className="text-[12px] font-black text-black/20 uppercase tracking-[0.2em]">Total Amount</p>
                                                    <p className="font-black text-2xl text-black">₹{order.amount}</p>
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
                                                        onClick={() => handleAcceptOrder(order.id)}
                                                        className="px-10 py-5 bg-black text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#D11919] transition-all shadow-xl"
                                                    >
                                                        Review & Accept
                                                    </button>
                                                )}
                                                <button className="p-4 bg-black/5 rounded-xl hover:text-[#D11919] transition-colors"><ChevronRight size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'Customers' && (
                            <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { name: 'Rahul Sharma', email: 'rahul@stepup.com', orders: 12, spent: '₹45,200', tier: 'V.I.P' },
                                    { name: 'Priya Singh', email: 'priya@icloud.com', orders: 5, spent: '₹18,900', tier: 'PRO' },
                                    { name: 'Amit Patel', email: 'amit.p@gmail.com', orders: 2, spent: '₹5,400', tier: 'BASE' },
                                    { name: 'Neha Gupta', email: 'neha@stepup.com', orders: 8, spent: '₹22,100', tier: 'PRO' },
                                ].map((user, i) => (
                                    <div key={i} className="bg-white border border-black/5 p-8 rounded-[2.5rem] group hover:border-[#D11919]/30 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center font-black text-2xl text-black/20 group-hover:bg-[#D11919] group-hover:text-white transition-all">
                                                {user.name.split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <span className={`text-[9px] font-black px-4 py-2 rounded-lg border-2 ${
                                                user.tier === 'V.I.P' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-black/5 text-black/40'
                                            }`}>{user.tier}</span>
                                        </div>
                                        <h4 className="font-black text-2xl uppercase tracking-tighter mb-2 text-black">{user.name}</h4>
                                        <p className="text-[13px] font-bold text-black/40 uppercase tracking-[0.2em] mb-12">{user.email}</p>
                                        <div className="pt-10 border-t border-black/5 flex justify-between items-center">
                                            <div>
                                                <p className="text-[11px] font-black text-black/20 uppercase tracking-widest">Total Investment</p>
                                                <p className="font-black text-xl text-black">{user.spent}</p>
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
        </div>
    );
};

export default AdminDashboard;

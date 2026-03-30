import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    
    // Shipping goal calculation
    const shippingThreshold = 2500;
    const shippingProgress = Math.min((cartTotal / shippingThreshold) * 100, 100);
    const remainingForFreeShipping = Math.max(shippingThreshold - cartTotal, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-background/40 backdrop-blur-md z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-background/80 backdrop-blur-2xl z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-foreground/5"
                    >
                        {/* Header */}
                        <div className="p-8 pb-6 flex items-center justify-between border-b border-foreground/5">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center">
                                        <ShoppingBag size={24} className="text-accent" strokeWidth={2.5} />
                                    </div>
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-background"
                                    >
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </motion.span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Your Bag</h2>
                                    <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Review your selections</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsCartOpen(false)}
                                className="p-3 bg-secondary/50 hover:bg-secondary rounded-2xl transition-all"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Shipping Progress */}
                        {cart.length > 0 && (
                            <div className="px-8 py-4 bg-accent/5 border-b border-accent/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Truck size={14} className={shippingProgress === 100 ? "text-green-500" : "text-accent"} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {shippingProgress === 100 ? "Free Shipping Unlocked!" : "Shipping Progress"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground/40">
                                        {shippingProgress < 100 ? `₹${remainingForFreeShipping.toLocaleString('en-IN')} more to go` : "LIFTOFF 🚀"}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${shippingProgress}%` }}
                                        className={`h-full ${shippingProgress === 100 ? "bg-green-500" : "bg-accent"} transition-all duration-1000`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar space-y-8">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <motion.div 
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-32 h-32 bg-secondary rounded-[3rem] flex items-center justify-center"
                                    >
                                        <ShoppingBag size={48} strokeWidth={1} className="text-foreground/20" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black uppercase tracking-widest">The bag is empty</h3>
                                        <p className="text-sm text-foreground/40 font-medium max-w-[200px] mx-auto">
                                            It seems you haven't added anything to your collection yet.
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-foreground text-background px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase"
                                    >
                                        DISCOVER PRODUCTS
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={`${item.id}-${item.size}`}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative flex gap-6 p-4 rounded-3xl bg-secondary/30 hover:bg-secondary/50 transition-colors group border border-transparent hover:border-foreground/5 shadow-sm hover:shadow-md"
                                        >
                                            <div className="w-28 h-28 bg-white rounded-2xl p-2 flex items-center justify-center shadow-inner overflow-hidden relative">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                                                />
                                                <div className="absolute top-2 left-2 bg-foreground/5 backdrop-blur-md px-2 py-0.5 rounded-lg border border-black/5">
                                                    <span className="text-[8px] font-black uppercase text-foreground/60">{item.brand || 'Premium'}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-grow flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-black text-xs uppercase tracking-wider line-clamp-1 leading-tight mb-1">{item.name}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-foreground/5 rounded-lg">
                                                                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">Size</span>
                                                                <span className="text-[9px] font-black text-foreground uppercase">{item.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1, color: '#ef4444' }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeFromCart(item.id, item.size)}
                                                        className="text-foreground/20 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                </div>
                                                
                                                <div className="flex-grow flex items-end justify-between mt-4">
                                                    <div className="inline-flex items-center bg-background rounded-xl p-1 shadow-sm border border-foreground/5">
                                                        <motion.button
                                                            whileHover={{ bg: '#f4f4f4' }}
                                                            whileTap={{ scale: 0.8 }}
                                                            onClick={() => updateQuantity(item.id, item.size, -1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                                                        >
                                                            <Minus size={12} strokeWidth={3} />
                                                        </motion.button>
                                                        <span className="text-xs font-black min-w-[30px] text-center">{item.quantity}</span>
                                                        <motion.button
                                                            whileHover={{ bg: '#f4f4f4' }}
                                                            whileTap={{ scale: 0.8 }}
                                                            onClick={() => updateQuantity(item.id, item.size, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                                                        >
                                                            <Plus size={12} strokeWidth={3} />
                                                        </motion.button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest mb-0.5 line-through decoration-red-500/20 decoration-2">₹{(item.price * item.quantity * 1.2).toFixed(0)}</p>
                                                        <p className="text-base font-black tracking-tighter leading-none italic">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-8 bg-background border-t border-foreground/5 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] text-foreground/30 font-black uppercase tracking-[0.2em]">Estimated Total</span>
                                            <p className="text-xs text-foreground/40 font-bold italic">Inc. all taxes and smart-levy fees</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-black tracking-tighter leading-none italic block">₹{cartTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 p-3 bg-secondary/40 rounded-2xl border border-dotted border-foreground/10 items-center">
                                        <div className="p-2 bg-background rounded-xl">
                                            <ShieldCheck size={14} className="text-green-500" />
                                        </div>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/50 leading-tight">
                                            Authenticated original <br /> with <span className="text-accent underline">Digital Passport</span>
                                        </p>
                                    </div>
                                </div>

                                <motion.div className="space-y-4">
                                    <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: 'var(--accent)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-foreground text-background py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-4 transition-all group relative overflow-hidden shadow-2xl shadow-foreground/20"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-sm tracking-[0.2em] uppercase relative z-10">Proceed to Checkout</span>
                                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                        </motion.button>
                                    </Link>
                                    
                                    <div className="flex justify-center gap-8 items-center pt-2">
                                        <div className="flex items-center gap-1.5 opacity-25 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help">
                                            <Zap size={14} fill="currentColor" className="text-accent" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Express</span>
                                        </div>
                                        <div className="w-1 h-1 bg-foreground/10 rounded-full" />
                                        <div className="flex items-center gap-1.5 opacity-25 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help">
                                            <ShieldCheck size={14} className="text-accent" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Secure</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;

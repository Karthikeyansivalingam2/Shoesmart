import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ProductCard from '../components/common/ProductCard';
// import { products } from '../data/products';
import { ArrowRight, Zap, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/products');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data.filter(p => p && (p.isTrending || p.isNew)).slice(0, 4));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
        >
            <Hero />

            {/* Premium Features Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
                
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { 
                                icon: Zap, 
                                title: 'Instant Response', 
                                desc: 'Our smart-lace system adapts to your movement in real-time.',
                                accent: 'text-yellow-500' 
                            },
                            { 
                                icon: Shield, 
                                title: 'Kinetic Security', 
                                desc: 'Biometric locking ensures your pair is uniquely yours.',
                                accent: 'text-blue-500' 
                            },
                            { 
                                icon: RotateCcw, 
                                title: 'Infinite Growth', 
                                desc: '30-day exchange for any size, even if you’ve worn them.',
                                accent: 'text-accent' 
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                className="group relative p-10 rounded-[3rem] glass hover:bg-white/5 transition-all duration-500 border-white/5 overflow-hidden"
                            >
                                {/* Ambient Glow */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div className="relative z-10 space-y-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.accent.replace('text', 'bg-opacity-10 text')}`}>
                                        <feature.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-black tracking-widest uppercase italic">{feature.title}</h3>
                                        <p className="text-foreground/40 text-sm font-medium leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                    
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '40px' }}
                                        className="h-1 bg-accent/20 rounded-full group-hover:bg-accent group-hover:w-full transition-all duration-500"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-accent font-black uppercase tracking-[0.2em] text-xs">Featured</span>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mt-2">Trending Now</h2>
                        </div>
                        <Link to="/products">
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2 font-bold hover:text-accent transition-colors underline underline-offset-8"
                            >
                                VIEW ALL PRODUCTS <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-accent" />
                            </div>
                        ) : products.map((product, i) => (
                            <ProductCard key={product.id || product._id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -z-10 animate-pulse" />
                
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="relative h-[600px] rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-foreground/5 shadow-2xl"
                    >
                        {/* Immersive Background */}
                        <motion.img
                            initial={{ scale: 1.1 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2 }}
                            src="/images/premium_cta_background.png"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]"
                            alt="ShoeSmart Design Studio"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay opacity-50" />
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-10 z-20">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10"
                            >
                                <Zap size={14} className="text-accent fill-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Membership Only</span>
                            </motion.div>

                            <div className="space-y-4 max-w-4xl">
                                <motion.h2
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-white italic"
                                >
                                    Join the <br /> 
                                    <span className="text-mask bg-gradient-to-r from-accent via-white to-accent animate-gradient">Revolution</span>
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="max-w-xl text-lg md:text-xl text-white/60 font-medium mx-auto leading-relaxed"
                                >
                                    Smarter technology, better comfort, and the style you deserve. Subscribe to the digital footwear evolution.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex flex-col md:flex-row gap-6 w-full max-w-md"
                            >
                                <div className="flex-grow relative group/input">
                                    <input 
                                        type="email" 
                                        placeholder="your@email.smart"
                                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 outline-none focus:border-accent/50 transition-colors"
                                    />
                                    <div className="absolute inset-0 -z-10 bg-accent/5 rounded-2xl blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-accent text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-accent/20 transition-all border border-accent"
                                >
                                    SUBSCRIBE
                                </motion.button>
                            </motion.div>
                            
                            {/* Scroll Indicator */}
                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20"
                            >
                                <ArrowRight size={24} className="rotate-90" strokeWidth={1} />
                            </motion.div>
                        </div>
                        
                        {/* Decorative Glass Elements */}
                        <div className="absolute top-1/2 -left-20 w-80 h-80 glass rounded-[4rem] -rotate-12 opacity-10 blur-xl -z-10 group-hover:rotate-0 transition-transform duration-1000" />
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 glass rounded-full opacity-10 blur-2xl -z-10 group-hover:scale-110 transition-transform duration-1000" />
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;

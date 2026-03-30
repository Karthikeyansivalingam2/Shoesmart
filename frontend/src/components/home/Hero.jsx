import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Play, ShoppingBag, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Hero = () => {
    const { isDarkMode } = useTheme();
    const { scrollY } = useScroll();
    const containerRef = useRef(null);

    // Parallax & Scroll effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

    // Mouse tilt effect for the sneaker
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const xPct = mouseX / width - 0.5;
            const yPct = mouseY / height - 0.5;
            x.set(xPct);
            y.set(yPct);
        }
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen w-full flex items-center overflow-hidden pt-24 pb-12 transition-colors duration-500 bg-background"
        >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
                
                {/* Dynamic Grid Background Overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', 
                        backgroundSize: '40px 40px' 
                    }} 
                />
            </div>

            {/* Background Narrative Text */}
            <motion.div
                style={{ y: y1, opacity }}
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            >
                <h1 className="text-[25vw] font-black text-foreground/[0.03] tracking-tighter uppercase leading-none italic pointer-events-none">
                    SMART
                </h1>
            </motion.div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
                    {/* Left Content Column */}
                    <div className="space-y-12 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-foreground/5 backdrop-blur-md px-4 py-2 rounded-full border border-foreground/10 mb-8"
                            >
                                <Zap size={14} className="text-accent fill-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/80">
                                    Next-Gen Smart Footwear
                                </span>
                            </motion.div>
                            
                            <h2 className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                                <span className="block overflow-hidden pb-2">
                                    <motion.span 
                                        initial={{ y: "100%" }} 
                                        animate={{ y: 0 }} 
                                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                        className="block"
                                    >
                                        Future
                                    </motion.span>
                                </span>
                                <span className="block overflow-hidden pb-4">
                                    <motion.span 
                                        initial={{ y: "100%" }} 
                                        animate={{ y: 0 }} 
                                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                        className="text-accent italic relative inline-block group"
                                    >
                                        Awaits.
                                        <motion.span 
                                            initial={{ scaleX: 0 }} 
                                            animate={{ scaleX: 1 }} 
                                            transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
                                            className="absolute -bottom-2 left-0 w-full h-3 bg-accent/20 origin-left"
                                        />
                                    </motion.span>
                                </span>
                            </h2>
                            
                            <p className="max-w-md text-foreground/50 text-xl font-medium leading-relaxed mt-8 ml-1">
                                Integrating motion-sense technology with bespoke artisanal craftsmanship. Personalize your comfort, track your performance.
                            </p>
                        </motion.div>

                        {/* CTA Cluster */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            <Link to="/products">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(var(--accent-color), 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-foreground text-background px-10 py-5 rounded-2xl font-black flex items-center gap-4 transition-all hover:bg-accent group relative overflow-hidden"
                                >
                                    <span className="relative z-10 tracking-widest uppercase text-sm">Pre-Order Now</span>
                                    <ShoppingBag size={20} className="relative z-10 group-hover:translate-y-[-2px] transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            </Link>

                            <button className="flex items-center gap-4 py-5 px-6 font-black text-xs tracking-widest uppercase hover:text-accent transition-all group">
                                <span className="w-12 h-12 rounded-full border-2 border-foreground/5 flex items-center justify-center transition-all group-hover:border-accent/40 group-hover:bg-accent/5 backdrop-blur-sm">
                                    <Play size={18} fill="currentColor" className="ml-1" />
                                </span>
                                Tech Specs
                            </button>
                        </motion.div>

                        {/* Stats & Trust */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="flex items-center gap-16 pt-12 border-t border-foreground/5"
                        >
                            <div className="relative">
                                <p className="text-4xl font-black tracking-tighter">0.3s</p>
                                <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.2em] mt-1">Lace Response</p>
                                <div className="absolute -left-6 top-1 w-1 h-8 bg-accent/20 rounded-full" />
                            </div>
                            <div className="relative">
                                <div className="flex items-center gap-1">
                                    <p className="text-4xl font-black tracking-tighter">4.9</p>
                                    <Star size={16} fill="currentColor" className="text-yellow-500 mb-1" />
                                </div>
                                <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.2em] mt-1">Expert Rating</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual Column */}
                    <div className="relative h-full flex items-center justify-center">
                        {/* Sneaker Visualizer */}
                        <motion.div
                            style={{ 
                                y: y2,
                                rotateX,
                                rotateY,
                                scale,
                                perspective: 1000 
                            }}
                            initial={{ opacity: 0, scale: 0.5, rotate: -25, x: 200 }}
                            animate={{ opacity: 1, scale: 1, rotate: -15, x: 0 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 w-full cursor-grab active:cursor-grabbing preserve-3d"
                        >
                            {/* Halo behind shoe */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.4, 0.6, 0.4] 
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[50%] bg-accent/10 rounded-full blur-[80px] -z-10" 
                            />
                            
                            <img
                                src={isDarkMode ? "/images/premium_floating_sneaker_hero_dark.png" : "/images/premium_floating_sneaker_hero.png"}
                                alt="ShoeSmart Smart Sneaker"
                                className="w-full h-auto drop-shadow-[0_50px_60px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                            />
                            
                            {/* Glassmorphic Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute top-0 -right-4 md:right-0 ${isDarkMode ? 'glass-dark bg-black/40 border-white/10' : 'glass'} px-6 py-6 rounded-3xl z-20 flex flex-col items-center gap-2 shadow-2xl backdrop-blur-xl group cursor-help`}
                            >
                                <div className="p-3 bg-accent rounded-2xl text-white shadow-lg shadow-accent/40 group-hover:scale-110 transition-transform">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground mt-2">Voted Best</span>
                                <span className={`text-[8px] font-bold ${isDarkMode ? 'text-white/40' : 'text-foreground/40'} uppercase tracking-widest leading-none`}>2026 Tech Awards</span>
                            </motion.div>
                            
                            {/* Interaction Hint */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ delay: 2 }}
                                className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 italic whitespace-nowrap"
                            >
                                [ Hover to Inspect ]
                            </motion.div>
                        </motion.div>

                        {/* Interactive UI Nodes */}
                        {[
                            { pos: "top-[20%] left-0", label: "Smart Sensors" },
                            { pos: "bottom-[20%] right-1/4", label: "Auto-Lace Tech" },
                        ].map((node, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + i * 0.2 }}
                                className={`absolute ${node.pos} z-20 flex items-center gap-3 hidden md:flex`}
                            >
                                <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(var(--accent-color),0.5)]" />
                                <div className="h-px w-12 bg-foreground/10" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">
                                    {node.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

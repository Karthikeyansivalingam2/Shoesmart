import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const from = location.state?.from?.pathname || '/profile';

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            const target = user.role === 'admin' ? '/admin' : '/profile';
            navigate(target, { replace: true });
        }
    }, [user, navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Determine role for redirection
        let nextRole = 'customer';
        if (formData.email === 'admin' && formData.password === 'admin123') nextRole = 'admin';
        else if (formData.email.includes('admin')) nextRole = 'admin';
        
        login({
            email: formData.email,
            password: formData.password,
            name: formData.email.split('@')[0]
        });

        const target = nextRole === 'admin' ? '/admin' : from;
        navigate(target, { replace: true });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden"
        >
            {/* Background Decorative Circles */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="container max-w-lg">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="glass p-10 md:p-12 rounded-[3rem] border border-foreground/10"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Welcome Back</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Login to your StepUp account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 ml-1">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
                                placeholder="Email or Username"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                    <Lock size={12} /> Password
                                </label>
                                <button type="button" className="text-[10px] font-black underline uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                                    Forgot?
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent transition-colors shadow-xl"
                        >
                            SIGN IN <ArrowRight size={20} />
                        </motion.button>
                    </form>

                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute w-full h-px bg-foreground/10" />
                            <span className="relative px-4 bg-background text-[10px] font-black uppercase tracking-widest text-foreground/20">or continue with</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 py-4 bg-secondary/50 rounded-2xl hover:bg-foreground/5 transition-colors font-bold text-xs uppercase tracking-widest"
                            >
                                <Chrome size={18} /> Google
                            </button>
                        </div>

                        {/* Quick Login Section */}
                        <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-6">Quick Access Roles</p>
                            <div className="flex flex-wrap justify-center gap-3">

                                <button
                                    type="button"
                                    onClick={() => setFormData({ email: 'customer@test.com', password: 'password' })}
                                    className="px-4 py-2 rounded-xl bg-secondary text-foreground text-[9px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                                >
                                    Customer (Fill)
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-xs font-bold text-foreground/40 uppercase tracking-widest">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent underline underline-offset-4 hover:text-foreground transition-colors">
                            Create one
                        </Link>
                    </p>

                    <div className="mt-12 pt-8 border-t border-foreground/5 flex flex-col gap-6 items-center">
                        <Link to="/admin/login" className="flex items-center justify-center gap-3 text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] hover:text-accent transition-all group">
                            <Shield size={14} className="group-hover:rotate-12 transition-transform text-accent" /> Administrative Terminal
                        </Link>
                        <div className="h-px w-20 bg-foreground/5" />
                        <Link to="/" className="text-[9px] font-black text-foreground/10 uppercase tracking-[0.6em] hover:text-foreground transition-all flex items-center gap-2 group">
                            <Globe size={12} className="group-hover:scale-110 transition-transform" /> Back to Storefront
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Login;

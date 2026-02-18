'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Chrome, Globe, CheckCircle2 } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [ageConfirm, setAgeConfirm] = useState(false);
    const [country, setCountry] = useState('LK');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (username.length < 3 || username.length > 20) errs.username = 'Username must be 3-20 characters';
        if (!/^[a-zA-Z0-9]+$/.test(username)) errs.username = 'Letters and numbers only';
        if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email';
        if (password.length < 8) errs.password = 'Minimum 8 characters';
        if (!/\d/.test(password)) errs.password = 'Must contain at least one number';
        if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        if (!ageConfirm) errs.ageConfirm = 'You must confirm your age';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username, country },
                },
            });

            if (error) {
                setErrors({ form: error.message });
                setLoading(false);
                return;
            }

            // Create profile
            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    username,
                    country,
                    language: 'en',
                });
            }

            setStep('success');
        } catch (err) {
            setErrors({ form: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        const supabase = getSupabaseClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/` },
        });
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong rounded-3xl p-8 text-center max-w-md w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h2 className="font-heading text-xl font-bold mb-2">Account Created!</h2>
                    <p className="text-sm text-white/50 mb-6">Check your email to verify your account before logging in.</p>
                    <Link href="/login" className="inline-flex px-6 py-3 bg-primary rounded-xl text-sm font-medium hover:bg-primary-600 transition-all">
                        Go to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
            <div className="blob w-72 h-72 bg-purple/20 -top-20 right-0 animate-blob" />
            <div className="blob w-64 h-64 bg-primary/20 bottom-20 -left-10 animate-blob" style={{ animationDelay: '3s' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="glass-strong rounded-3xl p-8">
                    <div className="text-center mb-6">
                        <Link href="/" className="font-heading text-3xl font-bold text-gradient inline-block mb-2">AnimeX</Link>
                        <h1 className="font-heading text-xl font-semibold">Create Account</h1>
                        <p className="text-sm text-white/50 mt-1">Join AnimeX and start watching</p>
                    </div>

                    {errors.form && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="coolkid123" required
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                            </div>
                            {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                            </div>
                            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars, 1 number" required
                                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Country</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <select value={country} onChange={(e) => setCountry(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                                    <option value="LK">🇱🇰 Sri Lanka</option>
                                    <option value="IN">🇮🇳 India</option>
                                    <option value="US">🇺🇸 United States</option>
                                    <option value="UK">🇬🇧 United Kingdom</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={ageConfirm} onChange={(e) => setAgeConfirm(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                            <span className="text-xs text-white/50">I confirm I am allowed to use this site</span>
                        </label>
                        {errors.ageConfirm && <p className="text-xs text-red-400">{errors.ageConfirm}</p>}

                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-600 rounded-xl font-medium text-sm transition-all hover:shadow-glow-pink disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                                <><UserPlus className="w-4 h-4" /> Create Account</>}
                        </button>
                    </form>

                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center"><span className="px-3 text-xs text-white/30 bg-dark-50">Or</span></div>
                    </div>

                    <button onClick={handleGoogleSignup}
                        className="w-full py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3">
                        <Chrome className="w-4 h-4" /> Sign up with Google
                    </button>

                    <p className="text-center text-sm text-white/40 mt-5">
                        Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

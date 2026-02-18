'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Youtube, Facebook, Instagram, Music2, MessageCircle } from 'lucide-react';

export function Footer() {
    const [email, setEmail] = useState('');

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative mt-20 border-t border-white/5">
            {/* Gradient decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-heading text-2xl font-bold text-gradient glow-text">
                                AnimeX
                            </span>
                        </Link>
                        <p className="text-sm text-white/50 mb-6 leading-relaxed">
                            Sri Lanka&apos;s home for kids anime and cartoons. Watch free episodes in Sinhala, Tamil, and English.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Youtube, href: '#', label: 'YouTube' },
                                { icon: Facebook, href: '#', label: 'Facebook' },
                                { icon: Instagram, href: '#', label: 'Instagram' },
                                { icon: Music2, href: '#', label: 'TikTok' },
                                { icon: MessageCircle, href: '#', label: 'Discord' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all hover:-translate-y-1"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider mb-4">Explore</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Browse All Anime', href: '/browse' },
                                { label: 'Trending Now', href: '/browse?sort=trending' },
                                { label: 'New Releases', href: '/browse?sort=newest' },
                                { label: 'By Genre', href: '/browse' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider mb-4">Account</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Login', href: '/login' },
                                { label: 'Sign Up', href: '/signup' },
                                { label: 'My Watchlist', href: '/profile/watchlist' },
                                { label: 'My Downloads', href: '/profile/downloads' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support + Newsletter */}
                    <div>
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-3 mb-6">
                            {[
                                { label: 'Give Feedback', href: '/feedback' },
                                { label: 'Privacy Policy', href: '#' },
                                { label: 'Terms of Service', href: '#' },
                                { label: 'Contact Us', href: '#' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Newsletter */}
                        <div>
                            <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Newsletter</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
                                />
                                <button className="px-3 py-2 bg-primary/20 text-primary text-xs font-medium rounded-lg hover:bg-primary/30 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[
                        { code: 'en', label: 'English' },
                        { code: 'si', label: 'සිංහල' },
                        { code: 'ta', label: 'தமிழ்' },
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            className="px-4 py-1.5 text-xs rounded-full border border-white/10 text-white/50 hover:text-white hover:border-primary/30 transition-all"
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30">
                        © 2026 AnimeX. All rights reserved.
                    </p>
                    <p className="text-xs text-white/30">
                        Made with love in Sri Lanka 🇱🇰
                    </p>
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ y: -3 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 hover:text-primary hover:border-primary/30 group transition-all"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-3.5 h-3.5 group-hover:animate-rocket" />
                        Back to Top
                    </motion.button>
                </div>
            </div>
        </footer>
    );
}

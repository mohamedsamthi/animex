'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Menu, X, Bell, User, LogOut, Settings,
    Heart, Download, History, BookmarkPlus, Shield, ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { getSupabaseClient } from '@/lib/supabase/client';

export function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
    const { isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen } = useUIStore();
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Ctrl+K shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
                setTimeout(() => searchRef.current?.focus(), 100);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setSearchOpen, setMobileMenuOpen]);

    const handleLogout = async () => {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
        logout();
        setProfileOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-dark-400/80 backdrop-blur-xl border-b border-white/5'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <span className="font-heading text-2xl font-bold text-gradient">
                                AnimeX
                            </span>
                            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/browse" className="text-sm text-white/70 hover:text-white transition-colors">
                            Browse
                        </Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search anime... (Ctrl+K)"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Mobile search toggle */}
                        <button
                            onClick={() => setSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 text-white/70 hover:text-white"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {isAuthenticated ? (
                            <>
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setNotifOpen(!notifOpen)}
                                        className="relative p-2 text-white/70 hover:text-white transition-colors"
                                        aria-label="Notifications"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                                            3
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {notifOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl p-4 shadow-2xl"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-heading text-sm font-semibold">Notifications</h3>
                                                    <button className="text-xs text-primary hover:underline">Mark all read</button>
                                                </div>
                                                <div className="text-sm text-white/50 text-center py-6">
                                                    No new notifications
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-sm font-bold">
                                            {user?.username?.[0]?.toUpperCase() || 'A'}
                                        </div>
                                        <ChevronDown className="w-3.5 h-3.5 text-white/50 hidden sm:block" />
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl p-2 shadow-2xl"
                                            >
                                                <div className="px-3 py-2 border-b border-white/5 mb-1">
                                                    <p className="font-medium text-sm">{user?.username || 'User'}</p>
                                                    <p className="text-xs text-white/40">Member</p>
                                                </div>
                                                <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                                    <User className="w-4 h-4" /> Profile
                                                </Link>
                                                <Link href="/profile/watchlist" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                                    <BookmarkPlus className="w-4 h-4" /> Watchlist
                                                </Link>
                                                <Link href="/profile/history" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                                    <History className="w-4 h-4" /> History
                                                </Link>
                                                <Link href="/profile/downloads" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                                    <Download className="w-4 h-4" /> Downloads
                                                </Link>
                                                <Link href="/profile/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                                    <Settings className="w-4 h-4" /> Settings
                                                </Link>
                                                {isAdmin && (
                                                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary hover:bg-primary/10 transition-colors">
                                                        <Shield className="w-4 h-4" /> Admin Panel
                                                    </Link>
                                                )}
                                                <div className="border-t border-white/5 mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" /> Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="hidden sm:inline-flex px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-600 rounded-full transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white/70 hover:text-white"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 right-0 p-4 bg-dark-400/95 backdrop-blur-xl border-b border-white/5"
                    >
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search anime..."
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
                                    autoFocus
                                />
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-dark-400/95 backdrop-blur-xl border-b border-white/5"
                    >
                        <div className="px-4 py-4 space-y-1">
                            <Link href="/" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            <Link href="/browse" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
                            <Link href="/feedback" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>Feedback</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

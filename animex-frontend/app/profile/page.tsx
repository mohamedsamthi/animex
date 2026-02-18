'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Settings, BookmarkPlus, History, Download, Heart, Edit3, Camera, Globe, Lock } from 'lucide-react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('overview');
    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'watchlist', label: 'Watchlist', icon: BookmarkPlus },
        { id: 'history', label: 'History', icon: History },
        { id: 'downloads', label: 'Downloads', icon: Download },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 md:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-3xl font-heading font-bold">
                                A
                            </div>
                            <button className="absolute inset-0 rounded-full bg-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="font-heading text-2xl font-bold">AnimeX User</h1>
                            <p className="text-sm text-white/50">Joined Jan 2026 • 🇱🇰 Sri Lanka</p>
                            <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start">
                                <span className="text-xs text-white/40"><strong className="text-white">0</strong> Watchlist</span>
                                <span className="text-xs text-white/40"><strong className="text-white">0</strong> Liked</span>
                                <span className="text-xs text-white/40"><strong className="text-white">0</strong> Downloads</span>
                            </div>
                        </div>
                        <Link href="/profile/settings" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:border-primary/30 transition-all flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </Link>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar mb-8">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2"><History className="w-4 h-4 text-primary" /> Recently Watched</h3>
                                <p className="text-sm text-white/30 text-center py-8">No watch history yet</p>
                            </div>
                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> Liked Anime</h3>
                                <p className="text-sm text-white/30 text-center py-8">No liked anime yet</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'watchlist' && (
                        <div className="glass rounded-2xl p-6 text-center py-16">
                            <BookmarkPlus className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <h3 className="font-heading text-lg">Your watchlist is empty</h3>
                            <p className="text-sm text-white/40 mt-1 mb-6">Start adding anime to keep track of what you want to watch</p>
                            <Link href="/browse" className="inline-flex px-6 py-3 bg-primary rounded-xl text-sm font-medium hover:bg-primary-600 transition-all">Browse Anime</Link>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="glass rounded-2xl p-6 text-center py-16">
                            <History className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <h3 className="font-heading text-lg">No watch history</h3>
                            <p className="text-sm text-white/40 mt-1">Start watching to build your history</p>
                        </div>
                    )}

                    {activeTab === 'downloads' && (
                        <div className="glass rounded-2xl p-6 text-center py-16">
                            <Download className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <h3 className="font-heading text-lg">No downloads</h3>
                            <p className="text-sm text-white/40 mt-1">Download episodes for offline viewing</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-heading text-sm font-semibold mb-4">Profile Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Username</label>
                                        <input type="text" defaultValue="AnimeX User" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Bio</label>
                                        <textarea defaultValue="" placeholder="Tell us about yourself..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none h-20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-white/40 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Language</label>
                                            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                                                <option value="en">English</option><option value="si">සිංහල</option><option value="ta">தமிழ்</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/40 mb-1 block">Country</label>
                                            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                                                <option value="LK">🇱🇰 Sri Lanka</option><option value="IN">🇮🇳 India</option><option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2.5 bg-primary hover:bg-primary-600 rounded-xl text-sm font-medium transition-all">Save Changes</button>
                                </div>
                            </div>

                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2"><Lock className="w-4 h-4" /> Security</h3>
                                <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm hover:border-primary/30 transition-all">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

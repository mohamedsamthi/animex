'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Film, Upload, MessageSquare, BarChart3,
    TrendingUp, Eye, Heart, UserPlus, AlertCircle, Plus,
} from 'lucide-react';

const statCards = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'from-primary to-pink-600' },
    { label: 'Total Anime', value: '54', change: '+3', icon: Film, color: 'from-purple to-violet-600' },
    { label: 'Total Views', value: '1.2M', change: '+18%', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'New Signups (7d)', value: '156', change: '+24%', icon: UserPlus, color: 'from-green-500 to-emerald-500' },
];

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'anime', label: 'Manage Anime', icon: Film },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'feedback', label: 'Feedback', icon: AlertCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState('dashboard');

    return (
        <div className="min-h-screen pt-20">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 border-r border-white/5 min-h-screen p-4 hidden lg:block">
                    <div className="sticky top-24 space-y-1">
                        <h2 className="font-heading text-lg font-bold px-3 mb-4 text-gradient">Admin Panel</h2>
                        {sidebarItems.map(item => (
                            <button key={item.id} onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === item.id ? 'bg-primary/20 text-primary font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                                <item.icon className="w-4 h-4" /> {item.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 p-6 md:p-8">
                    {/* Dashboard */}
                    {activeSection === 'dashboard' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {statCards.map((stat, i) => (
                                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="glass rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                                <stat.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{stat.change}</span>
                                        </div>
                                        <p className="font-heading text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="glass rounded-2xl p-6">
                                    <h3 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Top Anime (This Week)</h3>
                                    <div className="space-y-3">
                                        {['Dragon Quest', 'Naruto', 'One Piece', 'Demon Slayer', 'My Hero Academia'].map((name, i) => (
                                            <div key={name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                                <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-xs font-heading font-bold text-white/40">{i + 1}</span>
                                                <span className="flex-1 text-sm">{name}</span>
                                                <span className="text-xs text-white/30">{Math.floor(Math.random() * 50000)} views</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-6">
                                    <h3 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-yellow-400" /> Pending Feedback</h3>
                                    <div className="space-y-3">
                                        {['Feature request: dark mode toggle', 'Bug: video not loading', 'Compliment: love the design'].map((fb, i) => (
                                            <div key={i} className="p-3 bg-white/5 rounded-lg text-sm text-white/60">{fb}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Manage Anime */}
                    {activeSection === 'anime' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="font-heading text-2xl font-bold">Manage Anime</h1>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-600 rounded-xl text-sm font-medium transition-all">
                                    <Plus className="w-4 h-4" /> Add Anime
                                </button>
                            </div>
                            <div className="glass rounded-2xl overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left text-xs text-white/40 p-4">Title</th>
                                            <th className="text-left text-xs text-white/40 p-4">Genre</th>
                                            <th className="text-left text-xs text-white/40 p-4">Episodes</th>
                                            <th className="text-left text-xs text-white/40 p-4">Status</th>
                                            <th className="text-left text-xs text-white/40 p-4">Views</th>
                                            <th className="text-left text-xs text-white/40 p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['Dragon Quest', 'Naruto', 'One Piece'].map((title, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="p-4 text-sm font-medium">{title}</td>
                                                <td className="p-4 text-xs text-white/50">Action, Fantasy</td>
                                                <td className="p-4 text-xs text-white/50">{12 + i * 8}</td>
                                                <td className="p-4"><span className="badge bg-green-500/20 text-green-400 text-[10px]">Ongoing</span></td>
                                                <td className="p-4 text-xs text-white/50">{(50000 + i * 20000).toLocaleString()}</td>
                                                <td className="p-4"><button className="text-xs text-primary hover:underline">Edit</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Upload */}
                    {activeSection === 'upload' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="font-heading text-2xl font-bold mb-6">Upload Content</h1>
                            <div className="glass rounded-2xl p-6 space-y-6">
                                <div>
                                    <label className="text-sm text-white/60 mb-1.5 block">Select Anime</label>
                                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                                        <option>Dragon Quest</option><option>Naruto</option><option>One Piece</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-1.5 block">Episode Title</label>
                                    <input type="text" placeholder="Episode title" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1.5 block">Episode Number</label>
                                        <input type="number" placeholder="1" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1.5 block">Season</label>
                                        <input type="number" placeholder="1" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-1.5 block">Video URL</label>
                                    <input type="url" placeholder="https://..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                                </div>
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
                                    <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-sm text-white/40">Drop thumbnail here or click to upload</p>
                                    <p className="text-xs text-white/20 mt-1">PNG, JPG up to 2MB</p>
                                </div>
                                <button className="w-full py-3 bg-primary hover:bg-primary-600 rounded-xl text-sm font-medium transition-all hover:shadow-glow-pink">
                                    Upload Episode
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Users */}
                    {activeSection === 'users' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="font-heading text-2xl font-bold mb-6">User Management</h1>
                            <div className="glass rounded-2xl overflow-hidden">
                                <div className="p-4 border-b border-white/5">
                                    <input type="text" placeholder="Search users..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                                </div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left text-xs text-white/40 p-4">User</th>
                                            <th className="text-left text-xs text-white/40 p-4">Joined</th>
                                            <th className="text-left text-xs text-white/40 p-4">Role</th>
                                            <th className="text-left text-xs text-white/40 p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['CoolKid123', 'AnimeGirl', 'TestUser99'].map((u, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="p-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-xs font-bold">{u[0]}</div>
                                                    <span className="text-sm">{u}</span>
                                                </td>
                                                <td className="p-4 text-xs text-white/50">Jan 2026</td>
                                                <td className="p-4"><span className="badge bg-blue-500/20 text-blue-400 text-[10px]">{i === 0 ? 'Admin' : 'User'}</span></td>
                                                <td className="p-4 flex gap-2">
                                                    <button className="text-xs text-primary hover:underline">Toggle Admin</button>
                                                    <button className="text-xs text-red-400 hover:underline">Ban</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Comments Moderation */}
                    {activeSection === 'comments' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="font-heading text-2xl font-bold mb-6">Comments Moderation</h1>
                            <div className="glass rounded-2xl p-6 text-center py-16">
                                <MessageSquare className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                <p className="text-sm text-white/40">No flagged comments</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Feedback */}
                    {activeSection === 'feedback' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="font-heading text-2xl font-bold mb-6">Feedback Management</h1>
                            <div className="space-y-3">
                                {['Feature request: dark mode toggle', 'Bug: video buffering on mobile', 'Compliment: amazing design!'].map((fb, i) => (
                                    <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm">{fb}</p>
                                            <p className="text-xs text-white/30 mt-1">2 hours ago • user@email.com</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-xs text-primary hover:underline">Reply</button>
                                            <button className="text-xs text-green-400 hover:underline">Resolve</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Analytics */}
                    {activeSection === 'analytics' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="font-heading text-2xl font-bold mb-6">Analytics</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass rounded-2xl p-6">
                                    <h3 className="font-heading text-sm font-semibold mb-4">Views Over Time</h3>
                                    <div className="h-48 flex items-end gap-1">
                                        {Array.from({ length: 14 }).map((_, i) => (
                                            <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${30 + Math.random() * 70}%` }}>
                                                <div className="w-full bg-primary rounded-t" style={{ height: `${50 + Math.random() * 50}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-white/30">
                                        <span>14 days ago</span><span>Today</span>
                                    </div>
                                </div>
                                <div className="glass rounded-2xl p-6">
                                    <h3 className="font-heading text-sm font-semibold mb-4">Genre Distribution</h3>
                                    <div className="space-y-3">
                                        {[['Action', 35], ['Fantasy', 25], ['Comedy', 20], ['Adventure', 15], ['Drama', 5]].map(([genre, pct]) => (
                                            <div key={genre as string}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-white/60">{genre}</span>
                                                    <span className="text-white/30">{pct}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary to-purple rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}

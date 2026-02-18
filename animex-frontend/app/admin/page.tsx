'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Film, Upload, MessageSquare, BarChart3,
    TrendingUp, Eye, Heart, UserPlus, AlertCircle, Plus, Search,
    ChevronRight, Shield, Clock, Star, ArrowUpRight, ArrowDownRight,
    Trash2, Flag, CheckCircle, XCircle, Edit3, MoreHorizontal,
    Activity, Zap, Globe, Settings, Bell, Filter, Download,
} from 'lucide-react';

// ─── STAT CARDS ─────────────────────────────
const statCards = [
    { label: 'Total Users', value: '2,847', change: '+12.5%', trend: 'up', icon: Users, color: 'from-[#FF2D78] to-[#FF6B9D]', bg: 'rgba(255,45,120,0.08)' },
    { label: 'Total Anime', value: '54', change: '+3', trend: 'up', icon: Film, color: 'from-[#7B2FFF] to-[#A855F7]', bg: 'rgba(123,47,255,0.08)' },
    { label: 'Total Views', value: '1.2M', change: '+18.3%', trend: 'up', icon: Eye, color: 'from-[#00F5FF] to-[#06B6D4]', bg: 'rgba(0,245,255,0.08)' },
    { label: 'New Signups', value: '156', change: '+24%', trend: 'up', icon: UserPlus, color: 'from-[#10B981] to-[#34D399]', bg: 'rgba(16,185,129,0.08)' },
];

// ─── SIDEBAR ─────────────────────────────
const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'anime', label: 'Manage Anime', icon: Film },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'feedback', label: 'Feedback', icon: AlertCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── DEMO DATA ─────────────────────────────
const topAnime = [
    { name: 'Dragon Quest', views: 45200, likes: 12300, eps: 24, trend: '+8%', poster: '🐉' },
    { name: 'Naruto Shippuden', views: 38100, likes: 9800, eps: 500, trend: '+5%', poster: '🍥' },
    { name: 'One Piece', views: 32400, likes: 15200, eps: 1100, trend: '+12%', poster: '🏴‍☠️' },
    { name: 'Demon Slayer', views: 28700, likes: 8900, eps: 44, trend: '+3%', poster: '⚔️' },
    { name: 'My Hero Academia', views: 19500, likes: 7200, eps: 138, trend: '+6%', poster: '💪' },
];

const recentActivity = [
    { action: 'New user registered', user: 'AnimeFan99', time: '2 min ago', type: 'user' },
    { action: 'Episode uploaded', user: 'Admin', time: '15 min ago', type: 'upload' },
    { action: 'Comment flagged', user: 'System', time: '1 hr ago', type: 'flag' },
    { action: 'Feedback submitted', user: 'CoolKid', time: '2 hrs ago', type: 'feedback' },
    { action: 'New anime added', user: 'Admin', time: '3 hrs ago', type: 'content' },
];

const feedbackItems = [
    { id: 1, type: 'feature', msg: 'Add offline download feature', user: 'AnimeLover', email: 'anime@mail.com', rating: 4, time: '2 hrs ago', status: 'new' },
    { id: 2, type: 'bug', msg: 'Video buffering on mobile networks', user: 'MobileUser', email: 'mobile@mail.com', rating: 2, time: '4 hrs ago', status: 'in_progress' },
    { id: 3, type: 'compliment', msg: 'Best anime streaming site ever!', user: 'HappyFan', email: 'happy@mail.com', rating: 5, time: '6 hrs ago', status: 'resolved' },
    { id: 4, type: 'content', msg: 'Please add Hunter x Hunter', user: 'RequestGuy', email: 'req@mail.com', rating: 4, time: '1 day ago', status: 'new' },
];

const chartData = [65, 48, 72, 55, 80, 62, 90, 75, 85, 68, 95, 78, 88, 82];

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [mobileNav, setMobileNav] = useState(false);

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard': return <DashboardSection />;
            case 'anime': return <AnimeSection />;
            case 'upload': return <UploadSection />;
            case 'users': return <UsersSection />;
            case 'comments': return <CommentsSection />;
            case 'feedback': return <FeedbackSection />;
            case 'analytics': return <AnalyticsSection />;
            case 'settings': return <SettingsSection />;
            default: return <DashboardSection />;
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-dark via-dark-100 to-dark">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple/3 rounded-full blur-[100px]" />
            </div>

            <div className="relative flex">
                {/* ─── SIDEBAR ─── */}
                <aside className="w-72 shrink-0 min-h-[calc(100vh-5rem)] hidden lg:block">
                    <div className="sticky top-24 p-5">
                        {/* Logo area */}
                        <div className="flex items-center gap-3 mb-8 px-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-heading text-sm font-bold">Admin Panel</h2>
                                <p className="text-[10px] text-white/30">AnimeX Management</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-3">Navigation</p>
                            {sidebarItems.slice(0, 4).map(item => (
                                <button key={item.id} onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium shadow-lg shadow-primary/5 border border-primary/10'
                                            : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                                        }`}>
                                    <item.icon className={`w-4 h-4 transition-colors ${activeSection === item.id ? 'text-primary' : 'text-white/30 group-hover:text-white/60'}`} />
                                    {item.label}
                                    {activeSection === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-1 mt-6">
                            <p className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-3">Management</p>
                            {sidebarItems.slice(4).map(item => (
                                <button key={item.id} onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium shadow-lg shadow-primary/5 border border-primary/10'
                                            : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                                        }`}>
                                    <item.icon className={`w-4 h-4 transition-colors ${activeSection === item.id ? 'text-primary' : 'text-white/30 group-hover:text-white/60'}`} />
                                    {item.label}
                                    {item.id === 'feedback' && <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">4</span>}
                                    {activeSection === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                </button>
                            ))}
                        </div>

                        {/* Quick stats card */}
                        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple/10 border border-primary/10">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium">Server Status</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-green-400">All systems operational</span>
                            </div>
                            <div className="text-[10px] text-white/30">Response: 42ms • Uptime: 99.9%</div>
                        </div>
                    </div>
                </aside>

                {/* ─── MOBILE NAV ─── */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-400/95 backdrop-blur-xl border-t border-white/5 px-2 py-2">
                    <div className="flex justify-around">
                        {sidebarItems.slice(0, 5).map(item => (
                            <button key={item.id} onClick={() => setActiveSection(item.id)}
                                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] transition-all ${activeSection === item.id ? 'text-primary' : 'text-white/30'
                                    }`}>
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── MAIN CONTENT ─── */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 overflow-hidden">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-heading text-xl md:text-2xl font-bold capitalize">{activeSection}</h1>
                            <p className="text-xs text-white/30 mt-1">Welcome back, Admin</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                                <Bell className="w-4 h-4 text-white/40" />
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full text-[8px] flex items-center justify-center">3</span>
                            </button>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center text-xs font-bold">
                                A
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// DASHBOARD SECTION
// ═══════════════════════════════════════════
function DashboardSection() {
    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 group hover:border-white/10 transition-all"
                        style={{ background: stat.bg }}>
                        {/* Decorative gradient blob */}
                        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            </div>
                            <p className="font-heading text-2xl font-bold tracking-tight">{stat.value}</p>
                            <p className="text-xs text-white/35 mt-1">{stat.label}</p>

                            {/* Mini sparkline */}
                            <div className="flex items-end gap-0.5 mt-3 h-6">
                                {[40, 65, 45, 70, 55, 80, 60, 85].map((h, j) => (
                                    <div key={j} className={`flex-1 rounded-sm bg-gradient-to-t ${stat.color} opacity-30`} style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Top Anime */}
                <div className="xl:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Top Anime This Week
                        </h3>
                        <button className="text-[11px] text-primary hover:text-primary-300 flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
                    </div>
                    <div className="space-y-2">
                        {topAnime.map((anime, i) => (
                            <motion.div key={anime.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-heading font-bold ${i === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white' :
                                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-dark' :
                                            i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                                'bg-white/5 text-white/30'
                                    }`}>{i + 1}</span>
                                <span className="text-xl">{anime.poster}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{anime.name}</p>
                                    <p className="text-[11px] text-white/30">{anime.eps} episodes</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-white/50">{anime.views.toLocaleString()} views</p>
                                    <p className="text-[10px] text-green-400">{anime.trend}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary/50 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <h3 className="font-heading text-sm font-semibold flex items-center gap-2 mb-5">
                        <Activity className="w-4 h-4 text-secondary" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((act, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}
                                className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                                        act.type === 'upload' ? 'bg-green-500/10 text-green-400' :
                                            act.type === 'flag' ? 'bg-red-500/10 text-red-400' :
                                                act.type === 'feedback' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-purple/10 text-purple'
                                    }`}>
                                    {act.type === 'user' ? <UserPlus className="w-3.5 h-3.5" /> :
                                        act.type === 'upload' ? <Upload className="w-3.5 h-3.5" /> :
                                            act.type === 'flag' ? <Flag className="w-3.5 h-3.5" /> :
                                                act.type === 'feedback' ? <MessageSquare className="w-3.5 h-3.5" /> :
                                                    <Film className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white/70">{act.action}</p>
                                    <p className="text-[10px] text-white/25 mt-0.5">{act.user} • {act.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Chart + Pending Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <h3 className="font-heading text-sm font-semibold mb-4">Views (Last 14 Days)</h3>
                    <div className="h-40 flex items-end gap-1.5">
                        {chartData.map((val, i) => (
                            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${val}%` }} transition={{ delay: 0.5 + i * 0.03, duration: 0.4 }}
                                className="flex-1 rounded-t-md bg-gradient-to-t from-primary/60 to-primary/20 hover:from-primary hover:to-primary/40 transition-colors cursor-pointer relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-dark-100 px-1.5 py-0.5 rounded text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {val}K
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] text-white/20">
                        <span>Feb 4</span><span>Feb 11</span><span>Feb 18</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400" /> Pending Feedback
                        </h3>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">4 new</span>
                    </div>
                    <div className="space-y-3">
                        {feedbackItems.slice(0, 3).map(fb => (
                            <div key={fb.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-medium ${fb.type === 'bug' ? 'bg-red-500/10 text-red-400' :
                                                    fb.type === 'feature' ? 'bg-blue-500/10 text-blue-400' :
                                                        fb.type === 'compliment' ? 'bg-green-500/10 text-green-400' :
                                                            'bg-purple/10 text-purple'
                                                }`}>{fb.type}</span>
                                            <span className="text-[10px] text-white/20">{fb.time}</span>
                                        </div>
                                        <p className="text-xs text-white/60">{fb.msg}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <Star key={s} className={`w-2.5 h-2.5 ${s < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// MANAGE ANIME SECTION
// ═══════════════════════════════════════════
function AnimeSection() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" placeholder="Search anime..." className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/30 transition-colors" />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2.5 border border-white/[0.06] rounded-xl text-xs text-white/40 hover:text-white/60 hover:border-white/10 transition-colors">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-600 rounded-xl text-xs font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Anime
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.04]">
                            {['Anime', 'Genre', 'Episodes', 'Status', 'Views', 'Rating', 'Actions'].map(h => (
                                <th key={h} className="text-left text-[10px] uppercase tracking-wider text-white/25 p-4 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {topAnime.map((anime, i) => (
                            <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{anime.poster}</span>
                                        <div>
                                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{anime.name}</p>
                                            <p className="text-[10px] text-white/25">ID: anime-{i}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4"><span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary/70">Action, Fantasy</span></td>
                                <td className="p-4 text-xs text-white/40">{anime.eps}</td>
                                <td className="p-4"><span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400">Ongoing</span></td>
                                <td className="p-4 text-xs text-white/40">{anime.views.toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`w-2.5 h-2.5 ${s < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />)}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-primary transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// UPLOAD SECTION
// ═══════════════════════════════════════════
function UploadSection() {
    return (
        <div className="max-w-2xl">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Select Anime</label>
                        <select className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/30 appearance-none cursor-pointer">
                            <option>Dragon Quest</option><option>Naruto</option><option>One Piece</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Episode Title</label>
                        <input type="text" placeholder="Episode title" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/30" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Episode #</label>
                        <input type="number" placeholder="1" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/30" />
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Season</label>
                        <input type="number" placeholder="1" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/30" />
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Duration (s)</label>
                        <input type="number" placeholder="1200" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/30" />
                    </div>
                </div>
                <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Video URL</label>
                    <input type="url" placeholder="https://..." className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/30" />
                </div>
                <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Subtitle URLs</label>
                    <div className="grid grid-cols-3 gap-3">
                        <input type="url" placeholder="English .vtt" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary/30" />
                        <input type="url" placeholder="Sinhala .vtt" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary/30" />
                        <input type="url" placeholder="Tamil .vtt" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary/30" />
                    </div>
                </div>
                <div className="border-2 border-dashed border-white/[0.06] rounded-2xl p-8 text-center cursor-pointer hover:border-primary/20 transition-colors group">
                    <Upload className="w-10 h-10 text-white/10 mx-auto mb-3 group-hover:text-primary/30 transition-colors" />
                    <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors">Drop thumbnail here or click to upload</p>
                    <p className="text-[10px] text-white/15 mt-1">PNG, JPG, WebP • Max 2MB</p>
                </div>
                <button className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-600 rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <Upload className="w-4 h-4 inline mr-2" /> Upload Episode
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// USERS SECTION
// ═══════════════════════════════════════════
function UsersSection() {
    const users = [
        { name: 'MohamedSamthi', role: 'Admin', joined: 'Jan 2026', anime: 12, avatar: '👑' },
        { name: 'CoolKid123', role: 'User', joined: 'Jan 2026', anime: 34, avatar: '😎' },
        { name: 'AnimeGirl', role: 'User', joined: 'Feb 2026', anime: 8, avatar: '🌸' },
        { name: 'OtakuMaster', role: 'Mod', joined: 'Feb 2026', anime: 56, avatar: '⚡' },
        { name: 'TestUser99', role: 'User', joined: 'Feb 2026', anime: 2, avatar: '🎮' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/30 transition-colors" />
                </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.04]">
                            {['User', 'Role', 'Joined', 'Watched', 'Actions'].map(h => (
                                <th key={h} className="text-left text-[10px] uppercase tracking-wider text-white/25 p-4 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{u.avatar}</span>
                                        <span className="text-sm font-medium">{u.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] px-2 py-1 rounded-full ${u.role === 'Admin' ? 'bg-primary/10 text-primary' :
                                            u.role === 'Mod' ? 'bg-purple/10 text-purple' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>{u.role}</span>
                                </td>
                                <td className="p-4 text-xs text-white/30">{u.joined}</td>
                                <td className="p-4 text-xs text-white/30">{u.anime} anime</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[10px] text-primary hover:underline">Edit Role</button>
                                        <button className="text-[10px] text-red-400 hover:underline">Ban</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// COMMENTS SECTION
// ═══════════════════════════════════════════
function CommentsSection() {
    const comments = [
        { user: 'AnimeFan', text: 'This anime is trash!', anime: 'Dragon Quest', flagged: true, time: '1 hr ago' },
        { user: 'CoolKid', text: 'Love this episode! 🔥', anime: 'Naruto', flagged: false, time: '2 hrs ago' },
        { user: 'Troll99', text: 'Inappropriate content here...', anime: 'One Piece', flagged: true, time: '3 hrs ago' },
    ];
    return (
        <div className="space-y-4">
            <div className="flex gap-2 mb-2">
                <button className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/10">Flagged (2)</button>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.03] text-white/30 border border-white/[0.04]">All</button>
            </div>
            {comments.map((c, i) => (
                <div key={i} className={`rounded-xl border p-4 ${c.flagged ? 'border-red-500/10 bg-red-500/[0.02]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">{c.user}</span>
                                <span className="text-[10px] text-white/20">on {c.anime}</span>
                                {c.flagged && <Flag className="w-3 h-3 text-red-400" />}
                            </div>
                            <p className="text-sm text-white/50">{c.text}</p>
                            <span className="text-[10px] text-white/20 mt-1 block">{c.time}</span>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                            <button className="p-1.5 rounded-lg hover:bg-green-500/10 text-white/20 hover:text-green-400 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════
// FEEDBACK SECTION
// ═══════════════════════════════════════════
function FeedbackSection() {
    return (
        <div className="space-y-4">
            <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
                {['All', 'New', 'In Progress', 'Resolved'].map((tab, i) => (
                    <button key={tab} className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap border ${i === 0 ? 'bg-primary/10 text-primary border-primary/10' : 'bg-white/[0.03] text-white/30 border-white/[0.04]'
                        }`}>{tab}</button>
                ))}
            </div>
            {feedbackItems.map(fb => (
                <motion.div key={fb.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fb.id * 0.05 }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-medium ${fb.type === 'bug' ? 'bg-red-500/10 text-red-400' :
                                        fb.type === 'feature' ? 'bg-blue-500/10 text-blue-400' :
                                            fb.type === 'compliment' ? 'bg-green-500/10 text-green-400' :
                                                'bg-purple/10 text-purple'
                                    }`}>{fb.type}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full ${fb.status === 'new' ? 'bg-yellow-500/10 text-yellow-400' :
                                        fb.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-green-500/10 text-green-400'
                                    }`}>{fb.status.replace('_', ' ')}</span>
                                <div className="flex gap-0.5 ml-1">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`w-2.5 h-2.5 ${s < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />)}</div>
                            </div>
                            <p className="text-sm mb-1">{fb.msg}</p>
                            <p className="text-[10px] text-white/25">{fb.user} • {fb.email} • {fb.time}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                            <button className="px-3 py-1.5 text-[10px] rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Reply</button>
                            <button className="px-3 py-1.5 text-[10px] rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">Resolve</button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════
// ANALYTICS SECTION
// ═══════════════════════════════════════════
function AnalyticsSection() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <h3 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-secondary" /> Views Trend</h3>
                    <div className="h-48 flex items-end gap-1.5">
                        {chartData.map((val, i) => (
                            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${val}%` }} transition={{ delay: i * 0.04, duration: 0.5 }}
                                className="flex-1 rounded-t-md bg-gradient-to-t from-secondary/60 to-secondary/10 hover:from-secondary hover:to-secondary/30 transition-colors cursor-pointer" />
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] text-white/20"><span>Feb 4</span><span>Feb 18</span></div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <h3 className="font-heading text-sm font-semibold mb-5">Genre Distribution</h3>
                    <div className="space-y-4">
                        {[['Action', 35, 'from-primary to-pink-500'], ['Fantasy', 25, 'from-purple to-violet-500'], ['Comedy', 20, 'from-yellow-500 to-amber-500'], ['Adventure', 15, 'from-green-500 to-emerald-500'], ['Drama', 5, 'from-blue-500 to-cyan-500']].map(([genre, pct, grad]) => (
                            <div key={genre as string}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-white/50">{genre}</span>
                                    <span className="text-white/25 font-heading">{pct}%</span>
                                </div>
                                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 0.6 }}
                                        className={`h-full bg-gradient-to-r ${grad} rounded-full`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg. Watch Time', value: '23 min', icon: Clock },
                    { label: 'Bounce Rate', value: '12%', icon: ArrowDownRight },
                    { label: 'Peak Users', value: '342', icon: TrendingUp },
                    { label: 'Countries', value: '5', icon: Globe },
                ].map((m, i) => (
                    <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
                        <m.icon className="w-5 h-5 text-white/20 mx-auto mb-2" />
                        <p className="font-heading text-lg font-bold">{m.value}</p>
                        <p className="text-[10px] text-white/25 mt-1">{m.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// SETTINGS SECTION
// ═══════════════════════════════════════════
function SettingsSection() {
    return (
        <div className="max-w-2xl space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="font-heading text-sm font-semibold mb-4">Site Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Site Name</label>
                        <input type="text" defaultValue="AnimeX" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/30" />
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-wider text-white/30 mb-2 block">Site URL</label>
                        <input type="url" defaultValue="https://animex.lk" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/30" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div>
                            <p className="text-sm font-medium">Maintenance Mode</p>
                            <p className="text-[10px] text-white/30 mt-0.5">When enabled, only admins can access the site</p>
                        </div>
                        <div className="w-10 h-5 rounded-full bg-white/10 relative cursor-pointer">
                            <div className="w-4 h-4 rounded-full bg-white/30 absolute left-0.5 top-0.5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div>
                            <p className="text-sm font-medium">Allow Registrations</p>
                            <p className="text-[10px] text-white/30 mt-0.5">New users can create accounts</p>
                        </div>
                        <div className="w-10 h-5 rounded-full bg-primary/30 relative cursor-pointer">
                            <div className="w-4 h-4 rounded-full bg-primary absolute right-0.5 top-0.5" />
                        </div>
                    </div>
                </div>
                <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 rounded-xl text-sm font-medium shadow-lg shadow-primary/20">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

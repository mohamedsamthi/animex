'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, BookmarkPlus, Share2, Eye, Heart, Clock, Calendar, Tag, Shield, ChevronRight } from 'lucide-react';
import { Anime, Episode } from '@/types';
import { formatNumber, formatDuration } from '@/lib/utils';

// Demo data
const demoAnime: Anime & { episodes: Episode[] } = {
    id: 'demo-1', title_en: 'Dragon Quest: Adventure of Dai', title_si: 'ඩ්‍රැගන් ක්වෙස්ට්', title_ta: 'டிராகன் குவெஸ்ட்',
    slug: 'dragon-quest', description: 'A young boy named Dai discovers he has the power to become a hero. With his friends by his side, he must defeat the Dark Lord and save the world from destruction. An epic adventure filled with courage, friendship, and powerful battles.',
    poster_url: '', banner_url: '', trailer_url: '',
    genre: ['Action', 'Fantasy', 'Adventure'], tags: ['shonen', 'hero'],
    age_rating: 'PG', release_year: 2024, total_episodes: 24,
    status: 'ongoing', is_featured: true, is_trending: true,
    view_count: 250000, like_count: 18500,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    episodes: Array.from({ length: 24 }, (_, i) => ({
        id: `ep-${i}`, anime_id: 'demo-1', episode_number: i + 1, season_number: 1,
        title: `Episode ${i + 1}: ${['The Beginning', 'First Battle', 'New Ally', 'Dark Forest', 'The Challenge'][i % 5]}`,
        description: 'An exciting episode in the adventure.', video_url: '', thumbnail_url: '',
        duration_seconds: 1200 + (i * 37 % 300),
        subtitle_en_url: '', subtitle_si_url: '', subtitle_ta_url: '',
        view_count: (i + 1) * 4500, like_count: (i + 1) * 450,
        is_free: true, created_at: '2024-01-01T00:00:00Z',
    })),
};

export default function AnimeDetailPage({ params }: { params: { slug: string } }) {
    const [anime] = useState(demoAnime);
    const [activeTab, setActiveTab] = useState<'episodes' | 'about' | 'comments'>('episodes');
    const [selectedSeason, setSelectedSeason] = useState(1);

    return (
        <div className="min-h-screen">
            {/* Banner */}
            <div className="relative h-[40vh] md:h-[50vh]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative -mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
                        <div className="w-48 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden glass-strong relative">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center">
                                <span className="font-heading text-xl text-white/20">AnimeX</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
                        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{anime.title_en}</h1>
                        <div className="flex flex-wrap gap-1 text-sm text-white/50 mb-3">
                            {anime.title_si && <span className="font-sinhala">{anime.title_si}</span>}
                            {anime.title_si && anime.title_ta && <span>•</span>}
                            {anime.title_ta && <span className="font-tamil">{anime.title_ta}</span>}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {anime.genre.map(g => (
                                <span key={g} className="badge badge-primary">{g}</span>
                            ))}
                            <span className="badge bg-yellow-500/20 text-yellow-400">{anime.age_rating}</span>
                            <span className={`badge ${anime.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {anime.status === 'completed' ? 'Completed' : 'Ongoing'}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-5 text-sm text-white/50 mb-5">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {anime.release_year}</span>
                            <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {anime.total_episodes} Episodes</span>
                            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {formatNumber(anime.view_count)} views</span>
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {formatNumber(anime.like_count)} likes</span>
                        </div>

                        <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-2xl">{anime.description}</p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Link href={`/watch/${anime.slug}/1`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 rounded-xl font-medium text-sm transition-all hover:shadow-glow-pink">
                                <Play className="w-4 h-4 fill-white" /> Play First Episode
                            </Link>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-primary/30 rounded-xl text-sm transition-all">
                                <BookmarkPlus className="w-4 h-4" /> Add to Watchlist
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm transition-all hover:border-white/20">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mt-12">
                    <div className="flex gap-1 border-b border-white/5 mb-8">
                        {(['episodes', 'about', 'comments'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-primary' : 'text-white/40 hover:text-white/60'
                                    }`}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Episodes Tab */}
                    {activeTab === 'episodes' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {anime.episodes.map((ep, i) => (
                                <Link key={ep.id} href={`/watch/${anime.slug}/${ep.episode_number}`}
                                    className="flex items-center gap-4 p-4 glass rounded-xl hover:border-primary/20 transition-all group">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-heading font-bold text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                                        {ep.episode_number}
                                    </div>
                                    <div className="w-32 h-20 rounded-lg bg-white/5 shrink-0 flex items-center justify-center overflow-hidden">
                                        <Play className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{ep.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(ep.duration_seconds)}</span>
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(ep.view_count)}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary shrink-0" />
                                </Link>
                            ))}
                        </motion.div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-heading text-lg mb-4">About This Anime</h3>
                                <p className="text-sm text-white/60 leading-relaxed">{anime.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-white/40">Status</p>
                                        <p className="text-sm font-medium mt-1 capitalize">{anime.status}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-white/40">Episodes</p>
                                        <p className="text-sm font-medium mt-1">{anime.total_episodes}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-white/40">Year</p>
                                        <p className="text-sm font-medium mt-1">{anime.release_year}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-white/40">Age Rating</p>
                                        <p className="text-sm font-medium mt-1">{anime.age_rating}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="glass rounded-2xl p-6 mb-6">
                                <textarea placeholder="Write a comment..."
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none h-24" />
                                <div className="flex justify-end mt-3">
                                    <button className="px-4 py-2 bg-primary hover:bg-primary-600 rounded-lg text-sm font-medium transition-all">
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                            <div className="text-center py-8 text-white/30 text-sm">No comments yet. Be the first!</div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

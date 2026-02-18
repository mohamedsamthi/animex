'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3X3, X } from 'lucide-react';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Anime, AnimeFilters } from '@/types';
import { GENRES, AGE_RATINGS } from '@/lib/utils';

const demoAnime: Anime[] = Array.from({ length: 20 }, (_, i) => ({
    id: `browse-${i}`, title_en: `Anime Title ${i + 1}`, title_si: '', title_ta: '',
    slug: `anime-${i}`, description: 'A great anime series.', poster_url: '',
    banner_url: '', trailer_url: '', genre: [GENRES[i % GENRES.length]],
    tags: [], age_rating: AGE_RATINGS[i % 3], release_year: 2024 - (i % 5),
    total_episodes: 12 + i * 2, status: i % 3 === 0 ? 'completed' : 'ongoing',
    is_featured: false, is_trending: i < 5, view_count: Math.floor(Math.random() * 100000),
    like_count: Math.floor(Math.random() * 10000), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}));

export default function BrowsePage() {
    const [anime, setAnime] = useState<Anime[]>(demoAnime);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);

    const toggleGenre = (g: string) => {
        setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
    };

    const filtered = anime.filter(a => {
        if (selectedGenres.length && !a.genre.some(g => selectedGenres.includes(g))) return false;
        if (selectedRatings.length && !selectedRatings.includes(a.age_rating)) return false;
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;
        return true;
    }).sort((a, b) => {
        switch (sort) {
            case 'trending': return b.view_count - a.view_count;
            case 'most_viewed': return b.view_count - a.view_count;
            case 'most_liked': return b.like_count - a.like_count;
            case 'a_to_z': return a.title_en.localeCompare(b.title_en);
            case 'z_to_a': return b.title_en.localeCompare(a.title_en);
            default: return 0;
        }
    });

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Browse Anime</h1>
                        <p className="text-sm text-white/40 mt-1">{filtered.length} anime found</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select value={sort} onChange={(e) => setSort(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
                            <option value="newest">Newest</option>
                            <option value="trending">Trending</option>
                            <option value="most_viewed">Most Viewed</option>
                            <option value="most_liked">Most Liked</option>
                            <option value="a_to_z">A to Z</option>
                            <option value="z_to_a">Z to A</option>
                        </select>
                        <button onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:border-primary/30 transition-colors lg:hidden">
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filter Sidebar */}
                    <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="glass rounded-2xl p-5 sticky top-24 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </h3>
                                <button onClick={() => { setSelectedGenres([]); setSelectedRatings([]); setStatusFilter('all'); }}
                                    className="text-xs text-primary hover:underline">Clear</button>
                            </div>

                            {/* Genre */}
                            <div>
                                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Genre</h4>
                                <div className="space-y-2">
                                    {GENRES.map(g => (
                                        <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-white/60 hover:text-white">
                                            <input type="checkbox" checked={selectedGenres.includes(g)} onChange={() => toggleGenre(g)}
                                                className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                                            {g}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Age Rating */}
                            <div>
                                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Age Rating</h4>
                                <div className="space-y-2">
                                    {AGE_RATINGS.map(r => (
                                        <label key={r} className="flex items-center gap-2 cursor-pointer text-sm text-white/60 hover:text-white">
                                            <input type="checkbox" checked={selectedRatings.includes(r)}
                                                onChange={() => setSelectedRatings(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                                                className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                                            {r}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Status</h4>
                                <div className="space-y-2">
                                    {['all', 'ongoing', 'completed'].map(s => (
                                        <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-white/60 hover:text-white">
                                            <input type="radio" name="status" value={s} checked={statusFilter === s} onChange={() => setStatusFilter(s)}
                                                className="w-3.5 h-3.5 border-white/20 bg-white/5 text-primary focus:ring-primary" />
                                            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {filtered.map((a, i) => (
                                <AnimeCard key={a.id} anime={a} index={i} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-20">
                                <Grid3X3 className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                <h3 className="font-heading text-lg">No anime found</h3>
                                <p className="text-sm text-white/40 mt-1">Try adjusting your filters</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-12">
                            {[1, 2, 3].map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-primary text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

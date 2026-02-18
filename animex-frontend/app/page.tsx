'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ChevronRight, Eye, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Anime, Episode } from '@/types';
import { formatNumber, GENRES } from '@/lib/utils';

// Demo data for display purposes when no backend connected
const demoAnime: Anime[] = Array.from({ length: 10 }, (_, i) => ({
    id: `demo-${i}`,
    title_en: ['Dragon Quest', 'Naruto Shippuden', 'One Piece', 'Demon Slayer', 'Attack on Titan',
        'My Hero Academia', 'Jujutsu Kaisen', 'Spy x Family', 'Chainsaw Man', 'Bleach'][i],
    title_si: '', title_ta: '',
    slug: `anime-${i}`,
    description: 'An amazing anime series that will keep you hooked from episode one.',
    poster_url: '',
    banner_url: '', trailer_url: '',
    genre: [['Action', 'Fantasy'], ['Action', 'Adventure'], ['Adventure', 'Comedy'], ['Action', 'Fantasy'], ['Action', 'Drama'],
    ['Action', 'School'], ['Action', 'Fantasy'], ['Comedy', 'Slice of Life'], ['Action', 'Horror'], ['Action', 'Adventure']][i],
    tags: [], age_rating: 'PG',
    release_year: 2024 - i,
    total_episodes: [24, 500, 1100, 44, 87, 138, 47, 37, 12, 366][i],
    status: i > 6 ? 'completed' : 'ongoing',
    is_featured: i < 3,
    is_trending: i < 5,
    view_count: [291600, 450200, 820100, 175300, 362400, 128900, 543700, 97800, 210500, 385100][i],
    like_count: [34500, 48200, 51000, 22100, 39800, 15600, 42300, 8900, 19700, 31200][i],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
}));

export default function HomePage() {
    const [anime, setAnime] = useState<Anime[]>(demoAnime);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    return (
        <div className="min-h-screen">
            {/* ===== HERO SECTION ===== */}
            <motion.section style={{ opacity: heroOpacity }} className="relative min-h-screen flex items-center overflow-hidden">
                {/* Starfield background */}
                <div className="absolute inset-0 bg-hero-gradient">
                    {/* CSS Stars */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(2px 2px at 20px 30px, #fff, transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, #fff, transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
              radial-gradient(2px 2px at 160px 30px, #fff, transparent)`,
                        backgroundSize: '200px 100px',
                        animation: 'float 20s linear infinite',
                    }} />
                </div>

                {/* Morphing blobs */}
                <div className="blob w-96 h-96 bg-primary/30 top-20 -left-20 animate-blob" />
                <div className="blob w-80 h-80 bg-purple/30 bottom-20 right-10 animate-blob" style={{ animationDelay: '2s' }} />
                <div className="blob w-64 h-64 bg-secondary/20 top-1/2 left-1/3 animate-blob" style={{ animationDelay: '4s' }} />

                {/* Glowing orbs */}
                <div className="glowing-orb w-32 h-32 bg-primary/40 top-32 right-1/4" />
                <div className="glowing-orb w-24 h-24 bg-secondary/30 bottom-32 left-1/4" style={{ animationDelay: '1.5s' }} />

                {/* Floating silhouettes */}
                <div className="absolute left-8 bottom-1/4 w-32 h-48 opacity-10 animate-float">
                    <svg viewBox="0 0 100 150" className="w-full h-full fill-primary">
                        <ellipse cx="50" cy="30" rx="20" ry="25" />
                        <rect x="35" y="55" width="30" height="50" rx="10" />
                        <rect x="25" y="70" width="15" height="40" rx="5" />
                        <rect x="60" y="65" width="15" height="45" rx="5" />
                    </svg>
                </div>
                <div className="absolute right-16 top-1/3 w-28 h-44 opacity-10 animate-float-delayed">
                    <svg viewBox="0 0 100 150" className="w-full h-full fill-secondary">
                        <ellipse cx="50" cy="30" rx="22" ry="27" />
                        <rect x="32" y="55" width="36" height="55" rx="12" />
                        <rect x="20" y="68" width="16" height="42" rx="6" />
                        <rect x="64" y="62" width="16" height="48" rx="6" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side — text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className="glass inline-flex items-center gap-2 px-4 py-2 mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Now Streaming</span>
                            </div>

                            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Watch Anime.{' '}
                                <span className="text-gradient">Love Every</span>{' '}
                                <span className="text-gradient">Episode.</span>
                            </h1>

                            <p className="text-lg text-white/50 mb-8 max-w-lg leading-relaxed">
                                Free cartoons and anime for kids in Sri Lanka. Stream in Sinhala, Tamil, and English.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/browse"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 rounded-full font-medium transition-all hover:shadow-glow-pink hover:scale-105"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    Start Watching
                                </Link>
                                <Link
                                    href="/browse"
                                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 rounded-full font-medium text-white/80 hover:text-white transition-all hover:bg-white/5"
                                >
                                    See All Anime
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 mt-12">
                                {[
                                    { value: '500+', label: 'Episodes' },
                                    { value: '50+', label: 'Anime Series' },
                                    { value: '3', label: 'Languages' },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="font-heading text-2xl font-bold text-gradient">{stat.value}</div>
                                        <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right side — featured card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple/20 to-secondary/20 rounded-3xl blur-2xl" />
                                <div className="relative glass-strong rounded-3xl overflow-hidden p-1">
                                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-purple/10 rounded-2xl flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                                                <Play className="w-10 h-10 text-primary fill-primary" />
                                            </div>
                                            <p className="font-heading text-sm text-white/60">Featured Anime</p>
                                            <p className="text-xs text-white/30 mt-1">Trailer autoplay</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
            </motion.section>

            {/* ===== TRENDING NOW ===== */}
            <section className="relative py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="section-heading">
                                <TrendingUp className="inline w-6 h-6 mr-2 text-primary" />
                                Trending Now
                            </h2>
                        </div>
                        <Link href="/browse?sort=trending" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {anime.filter(a => a.is_trending).map((a, i) => (
                            <AnimeCard key={a.id} anime={a} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEW EPISODES ===== */}
            <section className="relative py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="section-heading">
                            <Sparkles className="inline w-6 h-6 mr-2 text-accent" />
                            New Episodes
                        </h2>
                        <Link href="/browse?sort=newest" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {anime.slice(0, 5).map((a, i) => (
                            <AnimeCard key={a.id} anime={a} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BROWSE BY GENRE ===== */}
            <section className="relative py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-heading mb-8">Browse by Genre</h2>
                    <div className="flex flex-wrap gap-3">
                        {GENRES.map((genre, i) => (
                            <motion.div
                                key={genre}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link href={`/browse?genre=${genre}`} className="genre-pill">
                                    {genre}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED ANIME BANNER ===== */}
            <section className="relative py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple/10" />
                        <div className="relative z-20 p-8 md:p-12 lg:p-16">
                            <div className="max-w-lg">
                                <span className="badge badge-primary mb-4">⭐ Featured</span>
                                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3">
                                    {anime[0]?.title_en || 'Featured Anime'}
                                </h3>
                                <p className="text-sm text-white/50 mb-4 line-clamp-2">
                                    {anime[0]?.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-white/40 mb-6">
                                    <span>{anime[0]?.total_episodes} Episodes</span>
                                    <span>•</span>
                                    <span>{anime[0]?.status}</span>
                                    <span>•</span>
                                    <span>{anime[0]?.age_rating}</span>
                                </div>
                                <Link
                                    href={`/anime/${anime[0]?.slug}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 rounded-full text-sm font-medium transition-all hover:shadow-glow-pink"
                                >
                                    <Play className="w-4 h-4 fill-white" />
                                    Watch Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MOST LIKED ===== */}
            <section className="relative py-16 mb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="section-heading">
                            <Heart className="inline w-6 h-6 mr-2 text-primary" />
                            Most Liked
                        </h2>
                        <Link href="/browse?sort=most_liked" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {[...anime].sort((a, b) => b.like_count - a.like_count).slice(0, 5).map((a, i) => (
                            <AnimeCard key={a.id} anime={a} index={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Eye, Heart, BookmarkPlus, Star } from 'lucide-react';
import { Anime } from '@/types';
import { formatNumber } from '@/lib/utils';

interface AnimeCardProps {
    anime: Anime;
    index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link href={`/anime/${anime.slug}`} className="block group">
                <div className="anime-card relative overflow-hidden rounded-2xl">
                    {/* Poster Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                        {anime.poster_url ? (
                            <Image
                                src={anime.poster_url}
                                alt={anime.title_en}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center">
                                <span className="font-heading text-lg text-white/30">AnimeX</span>
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />

                        {/* Play button on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-glow-pink">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                        </div>

                        {/* Top badges */}
                        <div className="absolute top-2 left-2 flex gap-1.5">
                            {anime.is_trending && (
                                <span className="badge badge-primary text-[10px]">🔥 Trending</span>
                            )}
                            {anime.status === 'completed' && (
                                <span className="badge bg-green-500/20 text-green-400 text-[10px]">Completed</span>
                            )}
                        </div>

                        {/* Episode count overlay (slides up) */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center justify-between text-xs">
                                <span className="bg-dark/80 backdrop-blur-sm px-2 py-1 rounded-md">
                                    {anime.total_episodes} eps
                                </span>
                                <span className="bg-dark/80 backdrop-blur-sm px-2 py-1 rounded-md">
                                    {anime.age_rating}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info section */}
                    <div className="p-3">
                        <h3 className="font-medium text-sm text-white truncate group-hover:text-primary transition-colors">
                            {anime.title_en}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <Eye className="w-3 h-3" />
                                {formatNumber(anime.view_count)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <Heart className="w-3 h-3" />
                                {formatNumber(anime.like_count)}
                            </span>
                            {anime.release_year && (
                                <span className="text-xs text-white/30">{anime.release_year}</span>
                            )}
                        </div>
                        {anime.genre?.length > 0 && (
                            <div className="flex gap-1 mt-2 overflow-hidden">
                                {anime.genre.slice(0, 2).map((g) => (
                                    <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

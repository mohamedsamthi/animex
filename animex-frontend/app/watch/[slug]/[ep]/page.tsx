'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Share2, Download, SkipForward, ChevronRight, Maximize, Monitor, Volume2, Clock, ThumbsUp, MessageSquare } from 'lucide-react';
import { formatDuration, formatNumber } from '@/lib/utils';
import { Episode, Anime } from '@/types';

export default function WatchPage({ params }: { params: { slug: string; ep: string } }) {
    const [theaterMode, setTheaterMode] = useState(false);
    const [showSkipIntro, setShowSkipIntro] = useState(true);
    const [showAutoplay, setShowAutoplay] = useState(false);
    const [autoplayCountdown, setAutoplayCountdown] = useState(10);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(42500);
    const videoRef = useRef<HTMLDivElement>(null);
    const epNumber = parseInt(params.ep) || 1;

    // Demo episode data
    const demoEpisodes: Episode[] = Array.from({ length: 24 }, (_, i) => ({
        id: `ep-${i}`, anime_id: 'demo', episode_number: i + 1, season_number: 1,
        title: `Episode ${i + 1}: ${['The Awakening', 'Into Battle', 'New Power', 'Dark Secret', 'Final Stand'][i % 5]}`,
        description: 'An exciting episode.', video_url: '', thumbnail_url: '',
        duration_seconds: 1200 + Math.floor(Math.random() * 300),
        subtitle_en_url: '', subtitle_si_url: '', subtitle_ta_url: '',
        view_count: Math.floor(Math.random() * 50000), like_count: Math.floor(Math.random() * 5000),
        is_free: true, created_at: new Date().toISOString(),
    }));

    const currentEp = demoEpisodes[epNumber - 1] || demoEpisodes[0];

    useEffect(() => {
        const timer = setTimeout(() => setShowSkipIntro(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    return (
        <div className={`min-h-screen pt-20 pb-16 ${theaterMode ? 'bg-black' : ''}`}>
            <div className={`mx-auto px-4 ${theaterMode ? 'max-w-full' : 'max-w-7xl sm:px-6 lg:px-8'}`}>
                <div className={`flex ${theaterMode ? 'flex-col' : 'flex-col lg:flex-row'} gap-6`}>
                    {/* Player Area */}
                    <div className="flex-1">
                        {/* Video Player Container */}
                        <div ref={videoRef} className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                            {/* Placeholder player */}
                            <div className="absolute inset-0 bg-gradient-to-br from-dark-300 to-dark flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors">
                                        <Play className="w-10 h-10 text-primary fill-primary ml-1" />
                                    </div>
                                    <p className="text-sm text-white/40">{currentEp.title}</p>
                                    <p className="text-xs text-white/20 mt-1">Click to play</p>
                                </div>
                            </div>

                            {/* Skip Intro Button */}
                            <AnimatePresence>
                                {showSkipIntro && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onClick={() => setShowSkipIntro(false)}
                                        className="absolute bottom-20 right-4 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <SkipForward className="w-4 h-4" /> Skip Intro
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Autoplay Countdown Overlay */}
                            <AnimatePresence>
                                {showAutoplay && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-dark/90 backdrop-blur-xl flex items-center justify-center"
                                    >
                                        <div className="text-center">
                                            <p className="text-sm text-white/50 mb-2">Next episode in</p>
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-primary flex items-center justify-center">
                                                <span className="font-heading text-2xl font-bold">{autoplayCountdown}</span>
                                            </div>
                                            <p className="font-medium mb-4">Episode {epNumber + 1}</p>
                                            <div className="flex gap-3 justify-center">
                                                <button onClick={() => setShowAutoplay(false)} className="px-4 py-2 bg-white/10 rounded-lg text-sm">Cancel</button>
                                                <Link href={`/watch/${params.slug}/${epNumber + 1}`} className="px-4 py-2 bg-primary rounded-lg text-sm font-medium">Watch Now</Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Custom Controls Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="progress-bar mb-3 cursor-pointer">
                                    <div className="progress-bar-fill" style={{ width: '35%' }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button className="p-1.5 hover:text-primary transition-colors"><Play className="w-5 h-5 fill-white" /></button>
                                        <button className="p-1.5 hover:text-primary transition-colors"><Volume2 className="w-5 h-5" /></button>
                                        <span className="text-xs text-white/60">7:12 / 20:00</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select className="bg-transparent text-xs text-white/60 focus:outline-none cursor-pointer">
                                            <option>1x</option><option>0.5x</option><option>0.75x</option><option>1.25x</option><option>1.5x</option><option>2x</option>
                                        </select>
                                        <button onClick={() => setTheaterMode(!theaterMode)} className="p-1.5 hover:text-primary transition-colors" title="Theater Mode">
                                            <Monitor className="w-5 h-5" />
                                        </button>
                                        <button className="p-1.5 hover:text-primary transition-colors" title="Fullscreen">
                                            <Maximize className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Below Player */}
                        <div className="mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-heading text-lg md:text-xl font-bold">{currentEp.title}</h1>
                                    <Link href={`/anime/${params.slug}`} className="text-sm text-primary hover:underline mt-1 inline-block">
                                        {params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Link>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Like Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${liked ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/60 hover:text-white'}`}
                                    >
                                        <Heart className={`w-4 h-4 ${liked ? 'fill-primary text-primary' : ''}`} />
                                        {formatNumber(likeCount)}
                                    </motion.button>
                                    {/* Share */}
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm text-white/60 hover:text-white transition-all">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                    {/* Download */}
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm text-white/60 hover:text-white transition-all">
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-white/40 mt-4">{currentEp.description}</p>
                        </div>

                        {/* Comments */}
                        <div className="mt-8">
                            <h3 className="font-heading text-lg mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" /> Comments
                            </h3>
                            <div className="glass rounded-2xl p-4 mb-4">
                                <textarea placeholder="Write a comment..." className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 resize-none h-20 focus:outline-none focus:border-primary/50" />
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-primary rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">Post</button>
                                </div>
                            </div>
                            <p className="text-center text-sm text-white/30 py-4">No comments yet</p>
                        </div>
                    </div>

                    {/* Episode Sidebar */}
                    {!theaterMode && (
                        <aside className="lg:w-80 shrink-0">
                            <div className="glass rounded-2xl p-4 sticky top-24">
                                <h3 className="font-heading text-sm font-semibold mb-4">Episodes</h3>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                                    {demoEpisodes.map((ep) => (
                                        <Link key={ep.id} href={`/watch/${params.slug}/${ep.episode_number}`}
                                            className={`flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all ${ep.episode_number === epNumber ? 'bg-primary/10 border border-primary/20 text-primary' : 'hover:bg-white/5 text-white/60'}`}>
                                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-heading font-bold shrink-0">
                                                {ep.episode_number}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-xs font-medium">{ep.title}</p>
                                                <p className="text-[10px] text-white/30 mt-0.5">{formatDuration(ep.duration_seconds)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}

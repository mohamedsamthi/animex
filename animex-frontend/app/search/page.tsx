'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X } from 'lucide-react';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Anime } from '@/types';
import { GENRES } from '@/lib/utils';

const demoResults: Anime[] = Array.from({ length: 8 }, (_, i) => ({
    id: `s-${i}`, title_en: `Search Result ${i + 1}`, title_si: '', title_ta: '',
    slug: `result-${i}`, description: 'A matching anime.', poster_url: '',
    banner_url: '', trailer_url: '', genre: [GENRES[i % GENRES.length]],
    tags: [], age_rating: 'PG', release_year: 2024,
    total_episodes: 12 + i, status: 'ongoing', is_featured: false, is_trending: false,
    view_count: (i + 1) * 15000, like_count: (i + 1) * 2200,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
}));

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Anime[]>(initialQuery ? demoResults : []);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setTimeout(() => { setResults(demoResults); setLoading(false); }, 500);
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Search Anime</h1>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative max-w-2xl">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by title, genre, or keyword..."
                            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                            autoFocus />
                        {query && (
                            <button type="button" onClick={() => { setQuery(''); setResults([]); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Genre filter chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button onClick={() => setSelectedGenre('')}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${!selectedGenre ? 'bg-primary text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}>
                        All
                    </button>
                    {GENRES.slice(0, 10).map(g => (
                        <button key={g} onClick={() => setSelectedGenre(g)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${selectedGenre === g ? 'bg-primary text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}>
                            {g}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-3" />
                                <div className="h-3 bg-white/5 rounded w-3/4 mb-2" />
                                <div className="h-2 bg-white/5 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <p className="text-sm text-white/40 mb-6">{results.length} results for &ldquo;{query}&rdquo;</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {results.map((a, i) => <AnimeCard key={a.id} anime={a} index={i} />)}
                        </div>
                    </>
                ) : query ? (
                    <div className="text-center py-20">
                        <SearchIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <h3 className="font-heading text-lg">No results found</h3>
                        <p className="text-sm text-white/40 mt-1">Try different keywords</p>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <SearchIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <h3 className="font-heading text-lg text-white/50">Start typing to search</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

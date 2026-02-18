// ===============================
// AnimeX TypeScript Type Definitions
// ===============================

export interface Profile {
    id: string;
    username: string;
    avatar_url: string | null;
    bio: string;
    country: string;
    language: string;
    is_admin: boolean;
    total_watch_seconds: number;
    created_at: string;
    updated_at: string;
}

export interface Anime {
    id: string;
    title_en: string;
    title_si: string;
    title_ta: string;
    slug: string;
    description: string;
    poster_url: string;
    banner_url: string;
    trailer_url: string;
    genre: string[];
    tags: string[];
    age_rating: string;
    release_year: number | null;
    total_episodes: number;
    status: 'ongoing' | 'completed' | 'upcoming';
    is_featured: boolean;
    is_trending: boolean;
    view_count: number;
    like_count: number;
    created_at: string;
    updated_at: string;
}

export interface Episode {
    id: string;
    anime_id: string;
    episode_number: number;
    season_number: number;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    duration_seconds: number;
    subtitle_en_url: string;
    subtitle_si_url: string;
    subtitle_ta_url: string;
    view_count: number;
    like_count: number;
    is_free: boolean;
    created_at: string;
    // Joined fields
    anime?: Anime;
}

export interface Like {
    id: string;
    user_id: string;
    episode_id: string;
    created_at: string;
}

export interface Comment {
    id: string;
    user_id: string;
    episode_id: string;
    content: string;
    is_approved: boolean;
    is_flagged: boolean;
    created_at: string;
    // Joined
    profile?: Profile;
}

export interface WatchHistory {
    id: string;
    user_id: string;
    episode_id: string;
    anime_id: string;
    progress_seconds: number;
    duration_seconds: number;
    completed: boolean;
    updated_at: string;
    // Joined
    episode?: Episode;
    anime?: Anime;
}

export interface WatchlistItem {
    id: string;
    user_id: string;
    anime_id: string;
    sort_order: number;
    created_at: string;
    // Joined
    anime?: Anime;
}

export interface Download {
    id: string;
    user_id: string;
    episode_id: string;
    quality: string;
    file_size_mb: number;
    created_at: string;
    // Joined
    episode?: Episode;
}

export interface Feedback {
    id: string;
    user_id: string | null;
    name: string;
    email: string;
    subject: string;
    message: string;
    rating: number;
    type: 'general' | 'bug' | 'feature' | 'compliment' | 'content' | 'other';
    screenshot_url: string;
    status: 'new' | 'read' | 'resolved';
    admin_reply: string;
    created_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'new_episode' | 'comment_reply' | 'system';
    is_read: boolean;
    link: string;
    created_at: string;
}

export interface Announcement {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    is_active: boolean;
    created_at: string;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message: string;
    error: string | null;
}

// Admin stats
export interface AdminStats {
    totalUsers: number;
    totalAnime: number;
    totalEpisodes: number;
    totalViewsToday: number;
    newSignupsThisWeek: number;
    activeFeedbackCount: number;
}

// Pagination
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Search filters
export interface AnimeFilters {
    genre?: string[];
    year?: { min?: number; max?: number };
    age_rating?: string[];
    status?: 'all' | 'ongoing' | 'completed';
    language?: string;
    sort?: 'trending' | 'newest' | 'most_viewed' | 'most_liked' | 'a_to_z' | 'z_to_a';
    page?: number;
    limit?: number;
    search?: string;
}

// Theme
export type ThemeMode = 'dark-cosmic' | 'light-cloud' | 'anime-pink';

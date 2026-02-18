import { Anime, Episode, ApiResponse, PaginatedResponse, AnimeFilters, Feedback, Profile, WatchHistory, WatchlistItem, Download, Comment, Notification, AdminStats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    let resolvedToken: string | null = null;
    if (typeof window !== 'undefined') {
        try {
            const { getSupabaseClient } = await import('./supabase/client');
            const { data } = await getSupabaseClient().auth.getSession();
            resolvedToken = data.session?.access_token || null;
        } catch {
            resolvedToken = null;
        }
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// ============ ANIME ============
export async function getAnimeList(filters?: AnimeFilters) {
    const params = new URLSearchParams();
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.genre?.length) params.set('genre', filters.genre.join(','));
    if (filters?.sort) params.set('sort', filters.sort);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.age_rating?.length) params.set('age_rating', filters.age_rating.join(','));

    return fetchApi<PaginatedResponse<Anime>>(`/api/anime?${params}`);
}

export async function getTrendingAnime() {
    return fetchApi<Anime[]>('/api/anime/trending');
}

export async function getFeaturedAnime() {
    return fetchApi<Anime[]>('/api/anime/featured');
}

export async function getAnimeBySlug(slug: string) {
    return fetchApi<Anime & { episodes: Episode[] }>(`/api/anime/${slug}`);
}

export async function createAnime(data: Partial<Anime>) {
    return fetchApi<Anime>('/api/anime', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateAnime(id: string, data: Partial<Anime>) {
    return fetchApi<Anime>(`/api/anime/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAnime(id: string) {
    return fetchApi<null>(`/api/anime/${id}`, { method: 'DELETE' });
}

// ============ EPISODES ============
export async function getEpisode(id: string) {
    return fetchApi<Episode>(`/api/episodes/${id}`);
}

export async function createEpisode(data: Partial<Episode>) {
    return fetchApi<Episode>('/api/episodes', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateEpisode(id: string, data: Partial<Episode>) {
    return fetchApi<Episode>(`/api/episodes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteEpisode(id: string) {
    return fetchApi<null>(`/api/episodes/${id}`, { method: 'DELETE' });
}

export async function incrementViews(id: string) {
    return fetchApi<null>(`/api/episodes/${id}/views`, { method: 'PATCH' });
}

// ============ SEARCH ============
export async function searchAnime(query: string, filters?: AnimeFilters) {
    const params = new URLSearchParams({ q: query });
    if (filters?.genre?.length) params.set('genre', filters.genre.join(','));
    if (filters?.sort) params.set('sort', filters.sort);
    return fetchApi<PaginatedResponse<Anime>>(`/api/search?${params}`);
}

// ============ LIKES ============
export async function toggleLike(episodeId: string) {
    return fetchApi<{ liked: boolean; count: number }>(`/api/likes/${episodeId}`, { method: 'POST' });
}

export async function getLikeStatus(episodeId: string) {
    return fetchApi<{ liked: boolean; count: number }>(`/api/likes/${episodeId}`);
}

// ============ COMMENTS ============
export async function getComments(episodeId: string, page = 1) {
    return fetchApi<PaginatedResponse<Comment>>(`/api/comments/${episodeId}?page=${page}`);
}

export async function postComment(data: { episode_id: string; content: string }) {
    return fetchApi<Comment>('/api/comments', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteComment(id: string) {
    return fetchApi<null>(`/api/comments/${id}`, { method: 'DELETE' });
}

export async function flagComment(id: string) {
    return fetchApi<null>(`/api/comments/${id}/flag`, { method: 'POST' });
}

// ============ USER ============
export async function getProfile() {
    return fetchApi<Profile>('/api/user/profile');
}

export async function updateProfile(data: Partial<Profile>) {
    return fetchApi<Profile>('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) });
}

export async function getWatchlist() {
    return fetchApi<WatchlistItem[]>('/api/user/watchlist');
}

export async function addToWatchlist(animeId: string) {
    return fetchApi<WatchlistItem>('/api/user/watchlist', { method: 'POST', body: JSON.stringify({ anime_id: animeId }) });
}

export async function removeFromWatchlist(animeId: string) {
    return fetchApi<null>(`/api/user/watchlist/${animeId}`, { method: 'DELETE' });
}

export async function reorderWatchlist(items: { id: string; sort_order: number }[]) {
    return fetchApi<null>('/api/user/watchlist/reorder', { method: 'PUT', body: JSON.stringify({ items }) });
}

export async function getWatchHistory() {
    return fetchApi<WatchHistory[]>('/api/user/history');
}

export async function saveWatchProgress(data: { episode_id: string; anime_id: string; progress_seconds: number; duration_seconds: number; completed?: boolean }) {
    return fetchApi<WatchHistory>('/api/user/history', { method: 'POST', body: JSON.stringify(data) });
}

export async function getDownloads() {
    return fetchApi<Download[]>('/api/user/downloads');
}

export async function saveDownload(data: { episode_id: string; quality: string; file_size_mb: number }) {
    return fetchApi<Download>('/api/user/downloads', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteDownload(id: string) {
    return fetchApi<null>(`/api/user/downloads/${id}`, { method: 'DELETE' });
}

// ============ FEEDBACK ============
export async function submitFeedback(data: Partial<Feedback>) {
    return fetchApi<Feedback>('/api/feedback', { method: 'POST', body: JSON.stringify(data) });
}

export async function getAllFeedback(page = 1, filters?: { status?: string; rating?: number; type?: string }) {
    const params = new URLSearchParams({ page: String(page) });
    if (filters?.status) params.set('status', filters.status);
    if (filters?.rating) params.set('rating', String(filters.rating));
    if (filters?.type) params.set('type', filters.type);
    return fetchApi<PaginatedResponse<Feedback>>(`/api/feedback?${params}`);
}

export async function updateFeedback(id: string, data: Partial<Feedback>) {
    return fetchApi<Feedback>(`/api/feedback/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function replyToFeedback(id: string, reply: string) {
    return fetchApi<null>(`/api/feedback/${id}/reply`, { method: 'POST', body: JSON.stringify({ reply }) });
}

// ============ NOTIFICATIONS ============
export async function getNotifications() {
    return fetchApi<Notification[]>('/api/notifications');
}

export async function markNotificationRead(id: string) {
    return fetchApi<null>(`/api/notifications/${id}/read`, { method: 'PUT' });
}

export async function markAllNotificationsRead() {
    return fetchApi<null>('/api/notifications/read-all', { method: 'PUT' });
}

// ============ ADMIN ============
export async function getAdminStats() {
    return fetchApi<AdminStats>('/api/admin/stats');
}

export async function getAdminUsers(page = 1, search?: string) {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);
    return fetchApi<PaginatedResponse<Profile>>(`/api/admin/users?${params}`);
}

export async function banUser(userId: string) {
    return fetchApi<null>(`/api/admin/users/${userId}/ban`, { method: 'PUT' });
}

export async function toggleAdmin(userId: string) {
    return fetchApi<null>(`/api/admin/users/${userId}/admin`, { method: 'PUT' });
}

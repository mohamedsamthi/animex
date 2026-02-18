import { getSupabaseClient } from './supabase/client';

const supabase = getSupabaseClient();

// ─── ANIME CRUD ───────────────────────
export async function fetchAllAnime() {
    const { data, error } = await supabase
        .from('anime')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function addAnime(anime: {
    title_en: string; slug: string; description: string;
    genre: string[]; age_rating: string; release_year: number;
    total_episodes: number; status: string; poster_url?: string;
    banner_url?: string; trailer_url?: string;
}) {
    const { data, error } = await supabase.from('anime').insert([anime]).select().single();
    if (error) throw error;
    return data;
}

export async function updateAnime(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase.from('anime').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteAnime(id: string) {
    const { error } = await supabase.from('anime').delete().eq('id', id);
    if (error) throw error;
}

// ─── EPISODES CRUD ───────────────────────
export async function fetchEpisodes(animeId: string) {
    const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('anime_id', animeId)
        .order('episode_number', { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function addEpisode(episode: {
    anime_id: string; episode_number: number; season_number: number;
    title: string; description?: string; video_url: string;
    thumbnail_url?: string; duration_seconds?: number;
    subtitle_en_url?: string; subtitle_si_url?: string; subtitle_ta_url?: string;
}) {
    const { data, error } = await supabase.from('episodes').insert([episode]).select().single();
    if (error) throw error;
    return data;
}

export async function deleteEpisode(id: string) {
    const { error } = await supabase.from('episodes').delete().eq('id', id);
    if (error) throw error;
}

// ─── STATS ───────────────────────
export async function fetchAdminStats() {
    const [animeRes, episodesRes, feedbackRes] = await Promise.all([
        supabase.from('anime').select('id', { count: 'exact', head: true }),
        supabase.from('episodes').select('id', { count: 'exact', head: true }),
        supabase.from('feedback').select('id', { count: 'exact', head: true }),
    ]);
    return {
        totalAnime: animeRes.count || 0,
        totalEpisodes: episodesRes.count || 0,
        totalFeedback: feedbackRes.count || 0,
    };
}

// ─── GENERATE SLUG ───────────────────────
export function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

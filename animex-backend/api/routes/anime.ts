import { Router } from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, optionalAuth, requireAdmin } from '../../middleware/auth';

const router = Router();

// GET /api/anime — list anime with filters
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;
        const genre = req.query.genre as string;
        const sort = req.query.sort as string || 'newest';
        const search = req.query.search as string;
        const status = req.query.status as string;
        const ageRating = req.query.age_rating as string;

        let query = supabase.from('anime').select('*', { count: 'exact' });

        if (genre) {
            const genres = genre.split(',');
            query = query.overlaps('genre', genres);
        }
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }
        if (ageRating) {
            query = query.in('age_rating', ageRating.split(','));
        }
        if (search) {
            query = query.or(`title_en.ilike.%${search}%,title_si.ilike.%${search}%,description.ilike.%${search}%`);
        }

        switch (sort) {
            case 'trending': query = query.order('view_count', { ascending: false }); break;
            case 'most_viewed': query = query.order('view_count', { ascending: false }); break;
            case 'most_liked': query = query.order('like_count', { ascending: false }); break;
            case 'a_to_z': query = query.order('title_en', { ascending: true }); break;
            case 'z_to_a': query = query.order('title_en', { ascending: false }); break;
            default: query = query.order('created_at', { ascending: false });
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;

        res.json({
            success: true,
            data: {
                items: data || [],
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            },
            message: 'Anime list fetched',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// GET /api/anime/trending
router.get('/trending', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('anime')
            .select('*')
            .eq('is_trending', true)
            .order('view_count', { ascending: false })
            .limit(10);
        if (error) throw error;
        res.json({ success: true, data: data || [], message: 'Trending anime', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// GET /api/anime/featured
router.get('/featured', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('anime')
            .select('*')
            .eq('is_featured', true)
            .limit(5);
        if (error) throw error;
        res.json({ success: true, data: data || [], message: 'Featured anime', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// GET /api/anime/:slug — single anime with episodes
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        // Handle UUID-based routes for admin operations
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

        let animeQuery;
        if (isUUID) {
            animeQuery = supabase.from('anime').select('*').eq('id', slug).single();
        } else {
            animeQuery = supabase.from('anime').select('*').eq('slug', slug).single();
        }

        const { data: anime, error } = await animeQuery;
        if (error || !anime) {
            return res.status(404).json({ success: false, data: null, message: 'Anime not found', error: 'NOT_FOUND' });
        }

        const { data: episodes } = await supabase
            .from('episodes')
            .select('*')
            .eq('anime_id', anime.id)
            .order('season_number', { ascending: true })
            .order('episode_number', { ascending: true });

        // Increment view count
        await supabaseAdmin.from('anime').update({ view_count: (anime.view_count || 0) + 1 }).eq('id', anime.id);

        res.json({ success: true, data: { ...anime, episodes: episodes || [] }, message: 'Anime details', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// POST /api/anime — create (admin)
const createAnimeSchema = z.object({
    title_en: z.string().min(1),
    title_si: z.string().optional().default(''),
    title_ta: z.string().optional().default(''),
    slug: z.string().min(1),
    description: z.string().optional().default(''),
    poster_url: z.string().optional().default(''),
    banner_url: z.string().optional().default(''),
    trailer_url: z.string().optional().default(''),
    genre: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    age_rating: z.string().optional().default('G'),
    release_year: z.number().optional(),
    total_episodes: z.number().optional().default(0),
    status: z.enum(['ongoing', 'completed']).optional().default('ongoing'),
    is_featured: z.boolean().optional().default(false),
    is_trending: z.boolean().optional().default(false),
});

router.post('/', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const parsed = createAnimeSchema.parse(req.body);
        const { data, error } = await supabaseAdmin.from('anime').insert(parsed).select().single();
        if (error) throw error;
        res.status(201).json({ success: true, data, message: 'Anime created', error: null });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ success: false, data: null, message: 'Validation error', error: err.errors });
        }
        res.status(500).json({ success: false, data: null, message: err.message, error: 'CREATE_ERROR' });
    }
});

// PUT /api/anime/:id — update (admin)
router.put('/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseAdmin.from('anime').update(req.body).eq('id', id).select().single();
        if (error) throw error;
        res.json({ success: true, data, message: 'Anime updated', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// DELETE /api/anime/:id — delete (admin)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseAdmin.from('anime').delete().eq('id', id);
        if (error) throw error;
        res.json({ success: true, data: null, message: 'Anime deleted', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'DELETE_ERROR' });
    }
});

export default router;

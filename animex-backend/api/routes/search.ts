import { Router } from 'express';
import { supabase } from '../../lib/supabase';

const router = Router();

// GET /api/search?q=&genre=&year=&sort=
router.get('/', async (req, res) => {
    try {
        const q = (req.query.q as string) || '';
        const genre = req.query.genre as string;
        const sort = (req.query.sort as string) || 'newest';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        let query = supabase.from('anime').select('*', { count: 'exact' });

        if (q) {
            query = query.or(`title_en.ilike.%${q}%,title_si.ilike.%${q}%,title_ta.ilike.%${q}%,description.ilike.%${q}%`);
        }

        if (genre) {
            query = query.overlaps('genre', genre.split(','));
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
            message: q ? `Search results for "${q}"` : 'Browse results',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'SEARCH_ERROR' });
    }
});

export default router;

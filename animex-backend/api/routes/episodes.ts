import { Router } from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, requireAdmin } from '../../middleware/auth';

const router = Router();

// GET /api/episodes/:id
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('episodes')
            .select('*, anime(*)')
            .eq('id', req.params.id)
            .single();
        if (error || !data) {
            return res.status(404).json({ success: false, data: null, message: 'Episode not found', error: 'NOT_FOUND' });
        }
        res.json({ success: true, data, message: 'Episode details', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// POST /api/episodes — create (admin)
const createEpisodeSchema = z.object({
    anime_id: z.string().uuid(),
    episode_number: z.number().int().min(1),
    season_number: z.number().int().min(1).optional().default(1),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    video_url: z.string().min(1),
    thumbnail_url: z.string().optional().default(''),
    duration_seconds: z.number().int().optional().default(0),
    subtitle_en_url: z.string().optional().default(''),
    subtitle_si_url: z.string().optional().default(''),
    subtitle_ta_url: z.string().optional().default(''),
    is_free: z.boolean().optional().default(true),
});

router.post('/', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const parsed = createEpisodeSchema.parse(req.body);
        const { data, error } = await supabaseAdmin.from('episodes').insert(parsed).select().single();
        if (error) throw error;

        // Update total_episodes count on anime
        const { count } = await supabase.from('episodes').select('*', { count: 'exact', head: true }).eq('anime_id', parsed.anime_id);
        await supabaseAdmin.from('anime').update({ total_episodes: count || 0 }).eq('id', parsed.anime_id);

        // Create notifications for users who have this anime in their watchlist
        const { data: watchlistUsers } = await supabaseAdmin
            .from('watchlist')
            .select('user_id')
            .eq('anime_id', parsed.anime_id);

        if (watchlistUsers?.length) {
            const { data: anime } = await supabase.from('anime').select('title_en, slug').eq('id', parsed.anime_id).single();
            const notifications = watchlistUsers.map((w) => ({
                user_id: w.user_id,
                title: 'New Episode Available',
                message: `New episode of ${anime?.title_en || 'an anime'} is available!`,
                type: 'new_episode',
                link: `/watch/${anime?.slug}/${parsed.episode_number}`,
            }));
            await supabaseAdmin.from('notifications').insert(notifications);
        }

        res.status(201).json({ success: true, data, message: 'Episode created', error: null });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ success: false, data: null, message: 'Validation error', error: err.errors });
        }
        res.status(500).json({ success: false, data: null, message: err.message, error: 'CREATE_ERROR' });
    }
});

// PUT /api/episodes/:id — update (admin)
router.put('/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin.from('episodes').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ success: true, data, message: 'Episode updated', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// DELETE /api/episodes/:id — delete (admin)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { error } = await supabaseAdmin.from('episodes').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true, data: null, message: 'Episode deleted', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'DELETE_ERROR' });
    }
});

// PATCH /api/episodes/:id/views — increment view count
router.patch('/:id/views', async (req, res) => {
    try {
        const { data: episode } = await supabase.from('episodes').select('view_count, anime_id').eq('id', req.params.id).single();
        if (!episode) return res.status(404).json({ success: false, data: null, message: 'Episode not found', error: 'NOT_FOUND' });

        await supabaseAdmin.from('episodes').update({ view_count: (episode.view_count || 0) + 1 }).eq('id', req.params.id);
        await supabaseAdmin.rpc('increment_anime_views', { anime_id: episode.anime_id }).catch(() => {
            // RPC may not exist, silently fail
        });

        res.json({ success: true, data: null, message: 'View count incremented', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

export default router;

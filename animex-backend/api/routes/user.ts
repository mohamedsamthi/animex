import { Router } from 'express';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, requireAuth } from '../../middleware/auth';

const router = Router();

// GET /api/user/profile
router.get('/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.userId!).single();
        if (error || !data) return res.status(404).json({ success: false, data: null, message: 'Profile not found', error: 'NOT_FOUND' });
        res.json({ success: true, data, message: 'Profile fetched', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// PUT /api/user/profile
router.put('/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
        const allowed = ['username', 'avatar_url', 'bio', 'country', 'language'];
        const updates: Record<string, any> = {};
        allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

        const { data, error } = await supabaseAdmin.from('profiles').update(updates).eq('id', req.userId!).select().single();
        if (error) throw error;
        res.json({ success: true, data, message: 'Profile updated', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// GET /api/user/watchlist
router.get('/watchlist', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('watchlist')
            .select('*, anime(*)')
            .eq('user_id', req.userId!)
            .order('sort_order', { ascending: true });
        if (error) throw error;
        res.json({ success: true, data: data || [], message: 'Watchlist fetched', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// POST /api/user/watchlist
router.post('/watchlist', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { anime_id } = req.body;
        const { data, error } = await supabaseAdmin
            .from('watchlist')
            .insert({ user_id: req.userId!, anime_id })
            .select('*, anime(*)')
            .single();
        if (error) {
            if (error.code === '23505') return res.json({ success: true, data: null, message: 'Already in watchlist', error: null });
            throw error;
        }
        res.status(201).json({ success: true, data, message: 'Added to watchlist', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'CREATE_ERROR' });
    }
});

// DELETE /api/user/watchlist/:animeId
router.delete('/watchlist/:animeId', requireAuth, async (req: AuthRequest, res) => {
    try {
        await supabaseAdmin.from('watchlist').delete().eq('user_id', req.userId!).eq('anime_id', req.params.animeId);
        res.json({ success: true, data: null, message: 'Removed from watchlist', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'DELETE_ERROR' });
    }
});

// PUT /api/user/watchlist/reorder
router.put('/watchlist/reorder', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { items } = req.body;
        for (const item of items) {
            await supabaseAdmin.from('watchlist').update({ sort_order: item.sort_order }).eq('id', item.id).eq('user_id', req.userId!);
        }
        res.json({ success: true, data: null, message: 'Watchlist reordered', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// GET /api/user/history
router.get('/history', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('watch_history')
            .select('*, episode:episodes(*, anime:anime(*))')
            .eq('user_id', req.userId!)
            .order('updated_at', { ascending: false });
        if (error) throw error;
        res.json({ success: true, data: data || [], message: 'Watch history', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// POST /api/user/history — save progress
router.post('/history', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { episode_id, anime_id, progress_seconds, duration_seconds, completed } = req.body;

        const { data: existing } = await supabaseAdmin
            .from('watch_history')
            .select('id')
            .eq('user_id', req.userId!)
            .eq('episode_id', episode_id)
            .single();

        if (existing) {
            const { data, error } = await supabaseAdmin
                .from('watch_history')
                .update({ progress_seconds, duration_seconds, completed: completed || false, updated_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            res.json({ success: true, data, message: 'Progress updated', error: null });
        } else {
            const { data, error } = await supabaseAdmin
                .from('watch_history')
                .insert({ user_id: req.userId!, episode_id, anime_id, progress_seconds, duration_seconds, completed: completed || false })
                .select()
                .single();
            if (error) throw error;
            res.status(201).json({ success: true, data, message: 'Progress saved', error: null });
        }
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'SAVE_ERROR' });
    }
});

// GET /api/user/downloads
router.get('/downloads', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('downloads')
            .select('*, episode:episodes(*, anime:anime(title_en, slug, poster_url))')
            .eq('user_id', req.userId!)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ success: true, data: data || [], message: 'Downloads fetched', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// POST /api/user/downloads
router.post('/downloads', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { episode_id, quality, file_size_mb } = req.body;
        const { data, error } = await supabaseAdmin
            .from('downloads')
            .insert({ user_id: req.userId!, episode_id, quality, file_size_mb })
            .select()
            .single();
        if (error) throw error;
        res.status(201).json({ success: true, data, message: 'Download recorded', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'CREATE_ERROR' });
    }
});

// DELETE /api/user/downloads/:id
router.delete('/downloads/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
        await supabaseAdmin.from('downloads').delete().eq('id', req.params.id).eq('user_id', req.userId!);
        res.json({ success: true, data: null, message: 'Download deleted', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'DELETE_ERROR' });
    }
});

export default router;

import { Router } from 'express';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, requireAdmin } from '../../middleware/auth';

const router = Router();

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (_req: AuthRequest, res) => {
    try {
        const [usersRes, animeRes, episodesRes, feedbackRes] = await Promise.all([
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('anime').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('episodes').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        ]);

        // Weekly signups
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: weeklySignups } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', weekAgo);

        // Total views today (sum of anime view_count is cumulative, we show total)
        const { data: topAnime } = await supabaseAdmin
            .from('anime')
            .select('view_count')
            .order('view_count', { ascending: false })
            .limit(1);

        res.json({
            success: true,
            data: {
                totalUsers: usersRes.count || 0,
                totalAnime: animeRes.count || 0,
                totalEpisodes: episodesRes.count || 0,
                totalViewsToday: topAnime?.[0]?.view_count || 0,
                newSignupsThisWeek: weeklySignups || 0,
                activeFeedbackCount: feedbackRes.count || 0,
            },
            message: 'Dashboard stats',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'STATS_ERROR' });
    }
});

// GET /api/admin/users
router.get('/users', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        const search = req.query.search as string;

        let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' });
        if (search) {
            query = query.or(`username.ilike.%${search}%`);
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        res.json({
            success: true,
            data: { items: data || [], total: count || 0, page, limit, totalPages: Math.ceil((count || 0) / limit) },
            message: 'Users list',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// PUT /api/admin/users/:id/ban
router.put('/users/:id/ban', requireAdmin, async (req: AuthRequest, res) => {
    try {
        // Use Supabase Admin to ban user
        const { error } = await supabaseAdmin.auth.admin.updateUserById(req.params.id, { ban_duration: '876000h' }); // ~100 years
        if (error) throw error;
        res.json({ success: true, data: null, message: 'User banned', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'BAN_ERROR' });
    }
});

// PUT /api/admin/users/:id/admin
router.put('/users/:id/admin', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { data: profile } = await supabaseAdmin.from('profiles').select('is_admin').eq('id', req.params.id).single();
        if (!profile) return res.status(404).json({ success: false, data: null, message: 'User not found', error: 'NOT_FOUND' });

        await supabaseAdmin.from('profiles').update({ is_admin: !profile.is_admin }).eq('id', req.params.id);
        res.json({ success: true, data: null, message: `Admin toggled to ${!profile.is_admin}`, error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'ADMIN_TOGGLE_ERROR' });
    }
});

// GET /api/admin/comments — all comments for moderation
router.get('/comments', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const filter = req.query.filter as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        let query = supabaseAdmin.from('comments').select('*, profile:profiles(username, avatar_url)', { count: 'exact' });
        if (filter === 'flagged') query = query.eq('is_flagged', true);

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        res.json({
            success: true,
            data: { items: data || [], total: count || 0, page, limit, totalPages: Math.ceil((count || 0) / limit) },
            message: 'Comments list',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

export default router;

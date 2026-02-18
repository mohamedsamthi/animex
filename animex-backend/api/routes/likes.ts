import { Router } from 'express';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, requireAuth, optionalAuth } from '../../middleware/auth';

const router = Router();

// POST /api/likes/:episodeId — toggle like
router.post('/:episodeId', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { episodeId } = req.params;
        const userId = req.userId!;

        // Check if already liked
        const { data: existing } = await supabaseAdmin
            .from('likes')
            .select('id')
            .eq('user_id', userId)
            .eq('episode_id', episodeId)
            .single();

        let liked: boolean;

        if (existing) {
            // Unlike
            await supabaseAdmin.from('likes').delete().eq('id', existing.id);
            liked = false;
        } else {
            // Like
            await supabaseAdmin.from('likes').insert({ user_id: userId, episode_id: episodeId });
            liked = true;
        }

        // Get updated count
        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('episode_id', episodeId);

        // Update episode like_count
        await supabaseAdmin.from('episodes').update({ like_count: count || 0 }).eq('id', episodeId);

        res.json({
            success: true,
            data: { liked, count: count || 0 },
            message: liked ? 'Episode liked' : 'Episode unliked',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'LIKE_ERROR' });
    }
});

// GET /api/likes/:episodeId — get like status
router.get('/:episodeId', optionalAuth, async (req: AuthRequest, res) => {
    try {
        const { episodeId } = req.params;

        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('episode_id', episodeId);

        let liked = false;
        if (req.userId) {
            const { data } = await supabaseAdmin
                .from('likes')
                .select('id')
                .eq('user_id', req.userId)
                .eq('episode_id', episodeId)
                .single();
            liked = !!data;
        }

        res.json({
            success: true,
            data: { liked, count: count || 0 },
            message: 'Like status',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

export default router;

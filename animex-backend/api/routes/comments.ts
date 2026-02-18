import { Router } from 'express';
import { z } from 'zod';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, requireAuth, requireAdmin, optionalAuth } from '../../middleware/auth';

const router = Router();

// Simple profanity filter
const BAD_WORDS = ['fuck', 'shit', 'ass', 'damn', 'bitch', 'dick', 'crap', 'hell'];
function filterProfanity(text: string): string {
    let filtered = text;
    BAD_WORDS.forEach((word) => {
        const regex = new RegExp(word, 'gi');
        filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
}

// GET /api/comments/:episodeId — paginated comments
router.get('/:episodeId', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('comments')
            .select('*, profile:profiles(username, avatar_url)', { count: 'exact' })
            .eq('episode_id', req.params.episodeId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

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
            message: 'Comments fetched',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// POST /api/comments — post comment
const commentSchema = z.object({
    episode_id: z.string().uuid(),
    content: z.string().min(1).max(500),
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
    try {
        const parsed = commentSchema.parse(req.body);
        const filteredContent = filterProfanity(parsed.content);

        const { data, error } = await supabaseAdmin
            .from('comments')
            .insert({
                user_id: req.userId!,
                episode_id: parsed.episode_id,
                content: filteredContent,
            })
            .select('*, profile:profiles(username, avatar_url)')
            .single();

        if (error) throw error;
        res.status(201).json({ success: true, data, message: 'Comment posted', error: null });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ success: false, data: null, message: 'Validation error', error: err.errors });
        }
        res.status(500).json({ success: false, data: null, message: err.message, error: 'CREATE_ERROR' });
    }
});

// DELETE /api/comments/:id — delete own or admin
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { data: comment } = await supabaseAdmin.from('comments').select('user_id').eq('id', req.params.id).single();
        if (!comment) return res.status(404).json({ success: false, data: null, message: 'Comment not found', error: 'NOT_FOUND' });

        if (comment.user_id !== req.userId && !req.isAdmin) {
            return res.status(403).json({ success: false, data: null, message: 'Not authorized', error: 'FORBIDDEN' });
        }

        await supabaseAdmin.from('comments').delete().eq('id', req.params.id);
        res.json({ success: true, data: null, message: 'Comment deleted', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'DELETE_ERROR' });
    }
});

// POST /api/comments/:id/flag — flag comment
router.post('/:id/flag', requireAuth, async (_req: AuthRequest, res) => {
    try {
        await supabaseAdmin.from('comments').update({ is_flagged: true }).eq('id', _req.params.id);
        res.json({ success: true, data: null, message: 'Comment flagged', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FLAG_ERROR' });
    }
});

export default router;

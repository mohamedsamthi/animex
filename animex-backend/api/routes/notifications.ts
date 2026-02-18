import { Router } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, requireAuth, requireAdmin } from '../../middleware/auth';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', req.userId!)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) throw error;
        res.json({ success: true, data: data || [], message: 'Notifications', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', requireAuth, async (req: AuthRequest, res) => {
    try {
        await supabaseAdmin.from('notifications').update({ is_read: true }).eq('id', req.params.id).eq('user_id', req.userId!);
        res.json({ success: true, data: null, message: 'Marked as read', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// PUT /api/notifications/read-all
router.put('/read-all', requireAuth, async (req: AuthRequest, res) => {
    try {
        await supabaseAdmin.from('notifications').update({ is_read: true }).eq('user_id', req.userId!).eq('is_read', false);
        res.json({ success: true, data: null, message: 'All marked as read', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// POST /api/notifications/broadcast — admin sends to all users
router.post('/broadcast', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { title, message, type, link } = req.body;
        const { data: users } = await supabaseAdmin.from('profiles').select('id');

        if (users?.length) {
            const notifications = users.map((u) => ({
                user_id: u.id,
                title,
                message,
                type: type || 'system',
                link: link || '',
            }));
            await supabaseAdmin.from('notifications').insert(notifications);
        }

        res.json({ success: true, data: null, message: 'Broadcast sent', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'BROADCAST_ERROR' });
    }
});

export default router;

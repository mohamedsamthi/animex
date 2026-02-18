import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../lib/supabase';
import { AuthRequest, optionalAuth, requireAdmin } from '../../middleware/auth';
import { sendEmail, feedbackReplyTemplate } from '../../lib/email';

const router = Router();

// POST /api/feedback — submit
const feedbackSchema = z.object({
    subject: z.string().optional().default(''),
    message: z.string().min(20),
    rating: z.number().int().min(1).max(5).optional().default(5),
    type: z.enum(['general', 'bug', 'feature', 'compliment', 'content', 'other']).optional().default('general'),
    screenshot_url: z.string().optional().default(''),
    name: z.string().optional().default('Anonymous'),
    email: z.string().email().optional().default(''),
});

router.post('/', optionalAuth, async (req: AuthRequest, res) => {
    try {
        const parsed = feedbackSchema.parse(req.body);
        const { data, error } = await supabaseAdmin
            .from('feedback')
            .insert({
                ...parsed,
                user_id: req.userId || null,
            })
            .select()
            .single();
        if (error) throw error;
        res.status(201).json({ success: true, data, message: 'Feedback submitted', error: null });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ success: false, data: null, message: 'Validation error', error: err.errors });
        }
        res.status(500).json({ success: false, data: null, message: err.message, error: 'CREATE_ERROR' });
    }
});

// GET /api/feedback — admin list
router.get('/', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        const status = req.query.status as string;
        const type = req.query.type as string;

        let query = supabaseAdmin.from('feedback').select('*', { count: 'exact' });
        if (status) query = query.eq('status', status);
        if (type) query = query.eq('type', type);

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        res.json({
            success: true,
            data: { items: data || [], total: count || 0, page, limit, totalPages: Math.ceil((count || 0) / limit) },
            message: 'Feedback list',
            error: null,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'FETCH_ERROR' });
    }
});

// PUT /api/feedback/:id — update status
router.put('/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabaseAdmin.from('feedback').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ success: true, data, message: 'Feedback updated', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'UPDATE_ERROR' });
    }
});

// POST /api/feedback/:id/reply — send reply email
router.post('/:id/reply', requireAdmin, async (req: AuthRequest, res) => {
    try {
        const { reply } = req.body;
        const { data: feedback } = await supabaseAdmin.from('feedback').select('email, name').eq('id', req.params.id).single();
        if (!feedback?.email) {
            return res.status(400).json({ success: false, data: null, message: 'No email address for this feedback', error: 'NO_EMAIL' });
        }

        await sendEmail(feedback.email, 'AnimeX — Response to Your Feedback', feedbackReplyTemplate(feedback.name, reply));
        await supabaseAdmin.from('feedback').update({ admin_reply: reply, status: 'resolved' }).eq('id', req.params.id);

        res.json({ success: true, data: null, message: 'Reply sent', error: null });
    } catch (err: any) {
        res.status(500).json({ success: false, data: null, message: err.message, error: 'REPLY_ERROR' });
    }
});

export default router;

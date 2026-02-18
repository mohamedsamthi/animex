import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    isAdmin?: boolean;
}

// Extracts user from JWT — does NOT require auth (sets userId if present)
export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (user && !error) {
            req.userId = user.id;
            req.userEmail = user.email;

            // Check admin status
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();
            req.isAdmin = profile?.is_admin ?? false;
        }
    } catch (e) {
        // Token invalid, continue without auth
    }
    next();
}

// Requires valid JWT
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false, data: null, message: 'Authentication required', error: 'UNAUTHORIZED',
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (!user || error) {
            return res.status(401).json({
                success: false, data: null, message: 'Invalid or expired token', error: 'UNAUTHORIZED',
            });
        }

        req.userId = user.id;
        req.userEmail = user.email;

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
        req.isAdmin = profile?.is_admin ?? false;

        next();
    } catch (e) {
        return res.status(401).json({
            success: false, data: null, message: 'Authentication failed', error: 'AUTH_ERROR',
        });
    }
}

// Requires admin role
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    await requireAuth(req, res, () => {
        if (!req.isAdmin) {
            return res.status(403).json({
                success: false, data: null, message: 'Admin access required', error: 'FORBIDDEN',
            });
        }
        next();
    });
}

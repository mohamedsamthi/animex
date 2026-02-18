import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Route imports
import animeRoutes from './routes/anime';
import episodeRoutes from './routes/episodes';
import searchRoutes from './routes/search';
import likeRoutes from './routes/likes';
import commentRoutes from './routes/comments';
import userRoutes from './routes/user';
import feedbackRoutes from './routes/feedback';
import notificationRoutes from './routes/notifications';
import adminRoutes from './routes/admin';

const app = express();

// CORS
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { success: false, data: null, message: 'Too many requests, please try again later.', error: 'RATE_LIMIT' },
});
app.use(limiter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() }, message: 'AnimeX API is running', error: null });
});

// Routes
app.use('/api/anime', animeRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, data: null, message: 'Endpoint not found', error: 'NOT_FOUND' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, data: null, message: 'Internal server error', error: err.message });
});

// Start server (for local dev)
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`AnimeX API running on http://localhost:${PORT}`);
    });
}

export default app;

# AnimeX 🎬

> Free Anime & Cartoons Streaming Platform for Kids in Sri Lanka

## Tech Stack
- **Frontend:** Next.js 14 + Tailwind CSS + Framer Motion
- **Backend:** Express.js + Supabase
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Netlify (Frontend) + Vercel (Backend)

## Features
- 🔐 Authentication (Email/Password + Google OAuth)
- 🔍 Full-text search with genre filters
- ❤️ Like, Watchlist, Watch History
- 📥 Download tracking
- 💬 Comments with moderation
- 📢 Feedback system
- 🛡️ Admin panel (dashboard, user management, analytics)
- 🌍 Multi-language (English, Sinhala, Tamil)
- 📱 PWA-ready, mobile responsive

## Setup

```bash
# Frontend
cd animex-frontend
npm install
npm run dev

# Backend
cd animex-backend
npm install
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` in both directories and fill in your Supabase credentials.

## Database
Run `animex-backend/supabase/migration.sql` in your Supabase SQL editor.

## License
MIT

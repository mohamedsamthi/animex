import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'AnimeX | Free Anime & Cartoons for Kids in Sri Lanka',
        template: '%s | AnimeX',
    },
    description:
        "Watch hundreds of free anime and cartoon episodes in Sinhala, Tamil, and English. Sri Lanka's best kids anime streaming platform.",
    keywords: [
        'anime sri lanka', 'sinhala anime', 'free cartoons', 'kids anime',
        'watch anime online', 'animex', 'cartoon sri lanka',
    ],
    authors: [{ name: 'AnimeX Team' }],
    creator: 'AnimeX',
    openGraph: {
        type: 'website',
        locale: 'en_LK',
        siteName: 'AnimeX',
        images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'AnimeX Sri Lanka' }],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@animexlk',
    },
    robots: { index: true, follow: true },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <meta name="theme-color" content="#FF2D78" />
            </head>
            <body className="min-h-screen bg-dark text-white font-body antialiased">
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}

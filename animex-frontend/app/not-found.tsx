import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="font-heading text-8xl font-bold text-gradient mb-4">404</h1>
                <h2 className="font-heading text-2xl mb-2">Page Not Found</h2>
                <p className="text-sm text-white/50 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <Link href="/" className="inline-flex px-6 py-3 bg-primary hover:bg-primary-600 rounded-xl text-sm font-medium transition-all hover:shadow-glow-pink">
                    Go Home
                </Link>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Send, CheckCircle2, Bug, Lightbulb, Heart, HelpCircle } from 'lucide-react';

const feedbackTypes = [
    { value: 'general', label: 'General', icon: MessageSquare },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'compliment', label: 'Compliment', icon: Heart },
    { value: 'other', label: 'Other', icon: HelpCircle },
];

export default function FeedbackPage() {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [type, setType] = useState('general');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.length < 20) return;
        setLoading(true);
        // API call would go here
        setTimeout(() => { setStep('success'); setLoading(false); }, 1000);
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-24">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-3xl p-8 text-center max-w-md w-full">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h2 className="font-heading text-xl font-bold mb-2">Thank You!</h2>
                    <p className="text-sm text-white/50 mb-6">Your feedback has been submitted. We appreciate it!</p>
                    <button onClick={() => { setStep('form'); setMessage(''); setSubject(''); }} className="text-sm text-primary hover:underline">
                        Send Another
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h1 className="font-heading text-3xl font-bold text-center mb-2">Send Feedback</h1>
                <p className="text-sm text-white/50 text-center mb-10">Help us make AnimeX better for everyone</p>

                <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-6 md:p-8 space-y-6">
                    {/* Type selector */}
                    <div>
                        <label className="text-sm text-white/60 mb-3 block">Feedback Type</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {feedbackTypes.map(ft => (
                                <button key={ft.value} type="button" onClick={() => setType(ft.value)}
                                    className={`p-3 rounded-xl text-center transition-all ${type === ft.value ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                                    <ft.icon className="w-5 h-5 mx-auto mb-1" />
                                    <span className="text-[10px]">{ft.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/60 mb-1.5 block">Name (optional)</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-1.5 block">Email (optional)</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm text-white/60 mb-1.5 block">Subject</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-sm text-white/60 mb-1.5 block">Message *</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more (min 20 characters)..." rows={5}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none" />
                        <p className="text-xs text-white/30 mt-1">{message.length}/500</p>
                    </div>

                    {/* Star Rating */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">How would you rate AnimeX?</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button" onClick={() => setRating(s)}
                                    className={`p-2 transition-all hover:scale-110 ${s <= rating ? 'text-yellow-400' : 'text-white/20'}`}>
                                    <Star className={`w-7 h-7 ${s <= rating ? 'fill-yellow-400' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading || message.length < 20}
                        className="w-full py-3 bg-primary hover:bg-primary-600 rounded-xl font-medium text-sm transition-all hover:shadow-glow-pink disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit Feedback</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

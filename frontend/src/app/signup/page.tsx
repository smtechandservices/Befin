'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to sign up');
            }

            toast.success('Account created successfully!');
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-foreground bg-gradient-to-br from-[#1C7CFF] to-[#0055D4]">
            {/* Left Side: Branding and Illustration */}
            <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-16 relative overflow-hidden">
                <div className="absolute top-12 left-12 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#001D66] flex items-center justify-center shadow-lg">
                        <span className="text-cyan-400 text-2xl font-black">B</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-wide">BeFin</span>
                </div>

                <div className="max-w-xl z-10 mt-12">
                    <h1 className="text-5xl font-bold leading-tight text-white mb-6">
                        Learn. Play. Earn<br />with BeFin
                    </h1>
                    <p className="text-lg text-white/90 leading-relaxed mb-12">
                        Master games through games, virtual investing,<br />and secure payment -all in one app.
                    </p>
                </div>

                <div className="relative w-full h-[500px]">
                    <Image
                        src="/images/login-illustration.png"
                        alt="Finance Hero Illustration"
                        fill
                        className="object-contain object-left-bottom drop-shadow-2xl transition-opacity duration-300"
                        priority
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl text-gray-900 mx-auto">
                    <div className="mb-8">
                        <p className="text-gray-500 mb-1">Welcome to <span className="text-[#0084ff] font-bold">BEFIN</span></p>
                        <h2 className="text-[2.75rem] font-medium text-black tracking-tight mb-8">Sign up</h2>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <button className="flex-1 flex items-center justify-center gap-3 py-3 px-4 border border-transparent rounded-2xl bg-[#E8F0FE] text-[#1967D2] hover:bg-blue-100 transition-colors">
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium whitespace-nowrap">Sign in with Google</span>
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center shrink-0 rounded-2xl bg-[#F5F6F8] hover:bg-gray-200 transition-colors">
                            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center shrink-0 rounded-2xl bg-[#F5F6F8] hover:bg-gray-200 transition-colors">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16.365 21.49c-1.25.86-2.52 1.72-3.9 1.73-1.4.01-1.84-.85-3.32-.86-1.5-.01-2.02.82-3.29.87-1.3np.04-2.28-.96-3.44-2.65-2.08-3.03-4.21-6.84-1.74-8.8 1.15-1.99 2.91-2.02 4.04-2.02 1.57.03 2.05.82 3.52.83 2.08.01 3.58-1 4.79-1.98C14.71 3 15.65 1.5 15.65 1.5c-1.7 1.25-1.98 3.5-1.12 5.06.77 1.38 2.37 2.22 3.99 2.06.03.04.05.08.07.12-.52.54-1.12.98-1.78 1.3z" />
                                <path d="M12.48 5.76c-.53.53-1.39.87-2.18.84-.13-1.03.28-2.11.96-2.83.66-.69 1.63-1.1 2.54-1.06.12 1.05-.41 2.1-1.07 2.76.01.01-.12.15-.25.29z" />
                                <path d="M12.44 5.8s-.13-.14-.26-.28c.67-.67 1.2-1.74 1.06-2.78-.92-.05-1.9.36-2.56 1.06-.69.72-1.08 1.79-.93 2.82.78.02 1.64-.32 2.17-.86.13-.13.26-.27.4-.4.04-.03.08-.07.12-.1.02.5.02.04 0 .54" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">Username</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white border border-[#BDE0FF] rounded-xl px-4 py-3.5 outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">Email address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white border border-[#BDE0FF] rounded-xl px-4 py-3.5 outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white border border-[#BDE0FF] rounded-xl px-4 py-3.5 outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 mt-8 bg-[#0084ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-8 text-sm">
                        Already have an account? <Link href="/login" className="text-[#0084ff] font-medium hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

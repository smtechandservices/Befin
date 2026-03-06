'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({
                username: formData.username,
                password: formData.password
            });
            // On success, redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error', err);
            // Handle Django generic auth error or specific field error
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Invalid username or password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[100vh] flex flex-col lg:flex-row bg-[#0380f5] font-sans">
            {/* Left Section: Info & Illustration */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 text-white gap-6">
                <div className="flex items-center gap-3">
                    <Image src="/images/logo.png" alt="BeFin Logo" width={48} height={48} className="object-contain" />
                    <span className="text-[2rem] tracking-tight">BeFin</span>
                </div>

                <div className="max-w-[500px]">
                    <h1 className="text-[2.75rem] font-semibold leading-[1.15] mb-2">
                        Learn. Play. Earn<br />with BeFin
                    </h1>
                    <p className="text-base opacity-90 leading-relaxed font-medium">
                        Master games through games, virtual investing, and secure payment - all in one app.
                    </p>
                </div>

                <div className="relative w-full aspect-square max-w-[450px] md:ml-10 mt-2 flex items-center justify-center">
                    <div className="absolute w-100 bg-white/10 rounded-full blur-3xl"></div>
                    <Image src="/images/login.png" alt="BeFin Login Illustration" width={600} height={600} className="relative z-10 transform hover:-translate-y-2 transition-transform duration-500 object-contain" priority />
                </div>
            </div>

            {/* Right Section: Login Card */}
            <div className="flex-[1.2] flex items-center justify-center">
                <div className="w-full max-w-[550px] bg-white rounded-xl px-8 py-12 flex flex-col gap-8 shadow-2xl">
                    <div className="flex flex-col gap-1">
                        <p className="text-gray-600 text-[15px] font-medium">
                            Welcome to <span className="text-[#0380f5]">BEFIN</span>
                        </p>
                        <h2 className="text-[3rem] text-gray-900 tracking-tight leading-none mt-1">Sign in</h2>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 text-[13px] p-3 rounded-xl border border-red-100 font-medium">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-gray-700 ml-1">Enter your username or email address</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                className="w-full px-5 py-4 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                                placeholder="Username or email address"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[13px] font-semibold text-gray-700 ml-1">Enter your Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    className="w-full px-5 py-4 pr-10 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                                    placeholder="Password"
                                    required
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gray-700 transition-colors p-1"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link href="#" className="text-[#0380f5] text-[13px] font-medium hover:underline tracking-wide">Forgot Password</Link>
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-[#0380f5] hover:bg-[#026ed3] disabled:opacity-70 text-white py-4 rounded-[14px] text-[16px] font-semibold transition-colors mt-2 shadow-[0_8px_16px_-4px_rgba(3,128,245,0.4)]">
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="text-center text-[13px] font-medium text-gray-500 mt-2">
                        Don't have an account ?
                        <Link href="/signup" className="text-[#0380f5] font-semibold ml-1 hover:underline tracking-wide">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

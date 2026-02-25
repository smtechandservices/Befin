'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/api';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

                    {/* Social Logins */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <button type="button" className="flex-[2] flex items-center justify-center gap-3 bg-[#f2f7ff] hover:bg-[#e6efff] transition-colors rounded-lg py-3.5 px-4 h-14">
                            <span className="text-xl flex items-center">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24.3761 13.2526C24.3761 12.3174 24.2987 11.6349 24.1311 10.9271H13.2333V15.1484H19.63C19.5011 16.1975 18.8047 17.7774 17.2571 18.839L17.2354 18.9803L20.681 21.5962L20.9198 21.6196C23.1122 19.6353 24.3761 16.7157 24.3761 13.2526Z" fill="#4285F4" />
                                    <path d="M13.2326 24.375C16.3664 24.375 18.9973 23.3638 20.919 21.6197L17.2563 18.839C16.2762 19.5089 14.9607 19.9766 13.2326 19.9766C10.1631 19.9766 7.55802 17.9923 6.62936 15.2496L6.49324 15.261L2.91038 17.9784L2.86353 18.106C4.77223 21.8218 8.69286 24.375 13.2326 24.375Z" fill="#34A853" />
                                    <path d="M6.63007 15.2497C6.38504 14.5419 6.24323 13.7835 6.24323 13C6.24323 12.2163 6.38504 11.458 6.61718 10.7502L6.61069 10.5995L2.98292 7.83847L2.86422 7.8938C2.07755 9.43576 1.62616 11.1673 1.62616 13C1.62616 14.8326 2.07755 16.5641 2.86422 18.106L6.63007 15.2497Z" fill="#FBBC05" />
                                    <path d="M13.2326 6.0233C15.4122 6.0233 16.8824 6.94594 17.7207 7.71696L20.9965 4.5825C18.9846 2.74987 16.3665 1.625 13.2326 1.625C8.69289 1.625 4.77224 4.17804 2.86353 7.89384L6.61649 10.7503C7.55805 8.00763 10.1632 6.0233 13.2326 6.0233Z" fill="#EB4335" />
                                </svg>
                            </span>
                            <span className="text-[#0380f5] text-[15px] tracking-wide">Sign in with Google</span>
                        </button>
                        <div className="flex gap-4 flex-1">
                            <button type="button" className="flex-1 flex items-center justify-center bg-[#f7f9fa] hover:bg-[#eaf0f4] transition-colors rounded-lg h-14">
                                <span className="text-[#1877F2]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 12.07C24 5.4 18.63 0 12 0C5.37 0 0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24V15.56H7.08V12.07H10.13V9.4C10.13 6.39 11.95 4.73 14.65 4.73C15.96 4.73 17.33 4.96 17.33 4.96V7.9H15.82C14.33 7.9 13.88 8.82 13.88 9.77V12.07H17.2L16.66 15.56H13.88V24C19.61 23.1 24 18.1 24 12.07Z" />
                                    </svg>
                                </span>
                            </button>
                            <button type="button" className="flex-1 flex items-center justify-center bg-[#f7f9fa] hover:bg-[#eaf0f4] transition-colors rounded-lg h-14">
                                <span className="text-gray-900">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.365 14.156c-.015-2.73 2.227-4.043 2.33-4.103-1.272-1.85-3.235-2.102-3.95-2.138-1.685-.171-3.298.995-4.15.995-.86 0-2.185-.97-3.605-.945-1.86.02-3.57 1.085-4.52 2.74-1.92 3.32-.495 8.245 1.375 10.95 1.01 1.47 2.235 3.09 3.82 3.045 1.5-.05 2.065-.965 3.82-.965 1.74 0 2.26.965 3.85.935 1.63-.03 2.66-1.465 3.65-2.925 1.15-1.685 1.615-3.32 1.635-3.415-.035-.02-3.185-1.215-3.2-3.675zm-2.455-5.32c.86-1.045 1.435-2.5 1.28-3.955-1.245.05-2.775.83-3.655 1.88-.78.93-1.42 2.4-1.25 3.83 1.385.105 2.76-.71 3.625-1.755z" />
                                    </svg>
                                </span>
                            </button>
                        </div>
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
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                className="w-full px-5 py-4 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                                placeholder="Password"
                                required
                                onChange={handleChange}
                            />
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

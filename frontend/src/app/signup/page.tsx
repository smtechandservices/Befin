'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/api';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    dob: '',
    phone_number: '',
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
      await authService.register(formData);
      // Registration successful, redirect to login
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error', err);
      if (err.response && err.response.data) {
        // Find the first error string value from the object
        const errorData = err.response.data;
        const firstErrorKey = Object.keys(errorData)[0];
        const errorMessage = Array.isArray(errorData[firstErrorKey])
          ? errorData[firstErrorKey][0]
          : errorData[firstErrorKey];
        setError(typeof errorMessage === 'string' ? errorMessage : 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col lg:flex-row bg-[#0380f5] font-sans">
      {/* Left Section: Info & Illustration (Same as Login) */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 text-white gap-6 lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="BeFin Logo" width={48} height={48} className="object-contain" />
          <span className="text-[2rem] tracking-tight">BeFin</span>
        </div>

        <div className="max-w-[500px]">
          <h1 className="text-[2.75rem] font-semibold leading-[1.15] mb-2">
            Join BeFin & Master<br />Your Future
          </h1>
          <p className="text-base opacity-90 leading-relaxed font-medium">
            Start your journey to financial literacy with games,<br />simulations, and real-world tools.
          </p>
        </div>

        <div className="relative w-full aspect-square max-w-[450px] md:ml-10 mt-2 flex items-center justify-center">
          <div className="absolute w-100 bg-white/10 rounded-full blur-3xl"></div>
          <Image src="/images/login.png" alt="BeFin Signup Illustration" width={600} height={600} className="relative z-10 transform hover:-translate-y-2 transition-transform duration-500 object-contain" priority />
        </div>
      </div>

      {/* Right Section: Signup Form */}
      <div className="flex-[1.2] flex items-center justify-center overflow-y-auto w-full lg:w-auto">
        <div className="w-full max-w-[600px] bg-white rounded-xl px-8 py-10 flex flex-col gap-4 shadow-2xl my-auto">
          <div className="flex flex-col gap-1">
            <p className="text-gray-600 text-[15px] font-medium">
              Create an account with <span className="text-[#0380f5]">BEFIN</span>
            </p>
            <h2 className="text-[3rem] text-gray-900 tracking-tight leading-none mt-1">Sign up</h2>
          </div>

          <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 text-[13px] p-3 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-semibold text-gray-700 ml-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  className="w-full px-5 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                  placeholder="John"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-semibold text-gray-700 ml-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  className="w-full px-5 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                  placeholder="Doe"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                className="w-full px-5 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                placeholder="johndoe"
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full px-5 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                placeholder="john@example.com"
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-semibold text-gray-700 ml-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  className="w-full px-4 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow whitespace-nowrap"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-semibold text-gray-700 ml-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  className="w-full px-5 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                  placeholder="9876543210"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                className="w-full px-5 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-gray-900 text-[15px] focus:outline-none focus:border-[#0380f5] focus:ring-1 focus:ring-[#0380f5] placeholder:text-gray-400 transition-shadow"
                placeholder="••••••••"
                required
                onChange={handleChange}
              />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#0380f5] hover:bg-[#026ed3] disabled:opacity-70 text-white py-4 rounded-[14px] text-[16px] font-semibold transition-colors mt-2 shadow-[0_8px_16px_-4px_rgba(3,128,245,0.4)]">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-[13px] font-medium text-gray-500 mt-2">
            Already have an account ?
            <Link href="/login" className="text-[#0380f5] font-semibold ml-1 hover:underline tracking-wide">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

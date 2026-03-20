import { Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Gradient - Deeper gradient as seen in SS */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#2563EB] to-[#1D4ED8] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-fade-in">
                    <span className="text-sm font-semibold text-white">🎮 Gamified Financial Learning</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                    The Smartest Way to <br />
                    Learn and Manage Money.
                </h1>

                <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto mb-12">
                    BeFin helps you build smart money habits through fun challenges, real rewards, and secure digital payments - all in one app.
                </p>

                {/* Dashboard Mockup Container */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Floating Cards - Refined colors */}
                    <div className="absolute -left-20 top-20 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-10 hidden lg:block animate-bounce-slow">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-xs">✉️</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">New SEO Articles</span>
                        </div>
                    </div>

                    <div className="absolute -right-20 top-40 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-10 hidden lg:block animate-bounce-slow delay-75">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#FFF7ED] rounded-full flex items-center justify-center">
                                <span className="text-[#EA580C] text-xs">💰</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">Updated pricing tiers</span>
                        </div>
                    </div>

                    <div className="absolute -left-10 bottom-20 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-10 hidden lg:block animate-bounce-slow delay-150">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#F5F3FF] rounded-full flex items-center justify-center">
                                <span className="text-[#7C3AED] text-xs">💻</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">Website redesign</span>
                        </div>
                    </div>

                    {/* Main Dashboard Image Mockup */}
                    <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl border border-white/10">
                        <div className="bg-[#1a1a1a] rounded-xl aspect-[16/9] overflow-hidden flex">
                            {/* Sidebar */}
                            <div className="w-16 border-r border-white/5 p-4 flex flex-col gap-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5" />)}
                            </div>
                            {/* Content */}
                            <div className="flex-1 p-8 text-left">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-gray-400 text-sm mb-1">Wallet Balance</h3>
                                        <p className="text-white text-3xl font-bold">₹666.00</p>
                                    </div>
                                    <button className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full">Top-up</button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <h4 className="text-gray-400 text-xs mb-3">Recent Transactions</h4>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex justify-between items-center text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-blue-500/20 rounded" />
                                                        <span className="text-gray-300">Mobile Recharge</span>
                                                    </div>
                                                    <span className="text-red-400">-₹500.00</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <h4 className="text-gray-400 text-xs mb-3">Money Transfers</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/5 h-12 rounded-lg" />
                                            <div className="bg-white/5 h-12 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <p className="text-blue-100/60 text-sm font-semibold mb-8">Used & Trusted by</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale brightness-200 hover:opacity-100 hover:grayscale-0 hover:brightness-100 transition-all duration-500">
                        <span className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">T</span> Type Studio
                        </span>
                        <span className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-xs">O</span> OpenVC
                        </span>
                        <span className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-xs">L</span> Landscape
                        </span>
                        <span className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-xs">S</span> social heaven
                        </span>
                        <span className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-xs">S</span> Swapstack
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function NewsletterSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Track and review your competitors</h2>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">newsletter ✉️ all in one place 💻</h2>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    <div className="flex-1 bg-gray-50 rounded-3xl p-10 text-left border border-gray-100 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Newsletter Monitoring</p>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">One inbox for <br /> all newsletters</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Be the first one to read your competitor's newsletters without flooding your inbox. In your dashboard, you can review all newsletters and dive even deeper with our smart analytic insights.
                            </p>
                        </div>
                        <button className="bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-200 transition-colors w-fit">
                            💼 Get started <span>→</span>
                        </button>
                    </div>

                    <div className="flex-[1.5] bg-[#FFB0B0]/30 rounded-3xl overflow-hidden p-12 relative min-h-[400px]">
                        {/* Complex UI Mockup - Ditto same as SS */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-yellow-400 p-6 rounded-2xl w-64 shadow-2xl transform rotate-1 animate-float">
                                <div className="w-12 h-4 bg-black/10 rounded-full mb-6" />
                                <p className="text-[#2D2D2D] text-[10px] font-extrabold mb-1 tracking-tight">RITUAL</p>
                                <p className="text-[#2D2D2D] text-lg font-bold mb-3 leading-tight">Formulated <br /> <span className="text-[10px] font-semibold opacity-70">by Skeptics,</span></p>
                                <div className="h-2 w-full bg-black/5 rounded mb-1" />
                                <div className="h-2 w-2/3 bg-black/5 rounded" />
                                <div className="w-16 h-4 bg-blue-600 rounded mt-6" />
                            </div>

                            <div className="absolute top-0 right-0 space-y-4">
                                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl flex items-center gap-3 transform -translate-x-10 translate-y-20">
                                    <span className="text-red-500 text-sm">📊</span>
                                    <span className="text-[10px] font-bold text-gray-700 leading-tight">28% of the Newsletters <br /> were sent on Tuesday</span>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl flex items-center gap-3 transform translate-x-5 translate-y-24">
                                    <span className="text-blue-500 text-sm">✍️</span>
                                    <span className="text-[10px] font-bold text-gray-700 leading-tight">The average subject line <br /> is 47 characters long</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

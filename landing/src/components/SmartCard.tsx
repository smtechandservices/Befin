export function SmartCard() {
    return (
        <section className="py-24 bg-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">SMART CARD</h3>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Spend Smarter | <span className="text-blue-600">Stay in control</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-xl">
                            Make everyday payments easy, safe and fun with BeFin Smart Card, built for all ages
                        </p>
                        <p className="font-bold text-gray-900 mb-8">Track, Tap and Manage Effortlessly.</p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-blue-600 font-bold">
                            <span>• Secure</span>
                            <span>• Fast</span>
                            <span>• Prepaid</span>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="relative z-10 animate-float">
                            {/* Phone Mockup with Card */}
                            <div className="bg-gradient-to-tr from-purple-200 to-blue-200 rounded-[3rem] p-4 shadow-2xl max-w-sm mx-auto">
                                <div className="bg-white rounded-[2.5rem] p-8 aspect-[9/19] flex flex-col items-center justify-center">
                                    <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-white flex flex-col justify-between shadow-lg transform -rotate-12 mb-12">
                                        <span className="font-bold">BeFin</span>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs">•••• 4242</span>
                                            <div className="w-8 h-8 bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">Tap to Pay Anywhere</p>
                                </div>
                            </div>
                        </div>
                        {/* Background decorative elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-200/30 blur-3xl -z-10 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}

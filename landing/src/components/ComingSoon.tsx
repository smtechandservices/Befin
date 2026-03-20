export function ComingSoon() {
    const features = [
        { title: "Hiring Name", icon: "👨‍💻" },
        { title: "Discover new competitors", icon: "🥊" },
        { title: "Get News Alerts", icon: "🔦" },
        { title: "Monitor Social Mentions", icon: "📢" },
        { title: "Get Fund Updates", icon: "💸" },
        { title: "Tech Stack Check", icon: "👁️" },
        { title: "Job Opening Alert", icon: "💼" },
        { title: "Company Signals", icon: "⚡" },
        { title: "Patents Tracker", icon: "⚙️" }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-16">Coming soon...</h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {features.map((f, idx) => (
                        <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <span className="text-3xl">{f.icon}</span>
                            <span className="text-xs font-bold text-gray-700 leading-tight">{f.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

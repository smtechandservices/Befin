export function Testimonials() {
    const testimonials = [
        {
            quote: "We would go weeks without collecting data - now tona does all the work.",
            author: "Jo Witte",
            role: "Founder @ Social Heaven",
            color: "bg-orange-100"
        },
        {
            quote: "I love how easy it is to share competitor insights with my team in real-time.",
            author: "Jo Witte",
            role: "Founder @ Social Heaven",
            color: "bg-red-100"
        }
    ];

    return (
        <section className="py-24 bg-[#B4B1FF]/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Loved by people and businesses</h2>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">around the world</h2>
                <p className="text-white/80 mb-16 max-w-2xl mx-auto">
                    Companies use tona daily to know what their competitors are doing without spending endless hours on manual work or breaking the bank.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className={`${idx === 0 ? 'bg-[#FFCAB0]' : 'bg-[#FFB0B0]'} rounded-[2.5rem] p-12 text-left relative overflow-hidden group shadow-lg`}>
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8 leading-tight">{t.quote}</h3>
                                <p className="text-[#4A4A4A] font-semibold text-sm">
                                    {t.author} <span className="mx-2 font-normal opacity-50">|</span> {t.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                    <span className="text-white font-bold text-xl">G2</span>
                    <span className="text-white font-bold text-xl">P</span>
                    <span className="text-white font-bold text-xl flex items-center gap-2">⭐ Trustpilot</span>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    const links = {
        Product: ["Pricing", "Website Monitoring", "Newsletter Monitoring", "Blog"],
        Resources: ["Notion Competitor Monitoring Template", "Competitor Analysis Prompts", "Best Software Tools"],
        Company: ["About Us", "Contact", "FAQ", "Privacy Policy", "Terms and Conditions", "Imprint"]
    };

    return (
        <footer className="bg-white py-20 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">B</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">BeFin</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Always know what</p>
                        <p className="text-sm font-bold text-gray-900 mb-6">your competitors are doing - on autopilot.</p>
                        <p className="text-xs text-gray-400">Made with ❤️ by BeFin Team</p>
                    </div>

                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">{title}</h4>
                            <ul className="space-y-4">
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}

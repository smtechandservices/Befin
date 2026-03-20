import { GraduationCap, Users, Briefcase } from "lucide-react";

export function FinanceStages() {
    const stages = [
        {
            title: "Students",
            icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
            image: "🎓",
            bgColor: "bg-blue-50"
        },
        {
            title: "Parents",
            icon: <Users className="w-12 h-12 text-blue-500" />,
            image: "👨‍👩‍👧‍👦",
            bgColor: "bg-blue-50"
        },
        {
            title: "Professionals",
            icon: <Briefcase className="w-12 h-12 text-blue-500" />,
            image: "💼",
            bgColor: "bg-blue-50"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Finance for every age. Every Stage</h2>
                <p className="text-gray-500 mb-16">BeFin is your lifelong financial companion - helping you learn, save, spend and grow at every stage of life</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stages.map((stage, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 group">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">{stage.title}</h3>
                            <div className={`w-32 h-32 ${stage.bgColor} rounded-2xl mx-auto flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                {stage.image}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

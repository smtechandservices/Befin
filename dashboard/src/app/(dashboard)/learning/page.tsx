import Link from 'next/link';
import { Gamepad2, TrendingUp, BookOpen, ArrowUpRight, PlayCircle } from 'lucide-react';

export default function LearningPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-8 text-white pb-10">
            <h1 className="text-3xl font-bold mb-8">Learning Hub</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Game 1: Finance Hero A-Z */}
                <div className="bg-[#1C1F26] rounded-[24px] overflow-hidden flex flex-col items-center p-6 text-center hover:bg-[#20242D] transition-colors group">
                    <div className="w-full bg-[#E5F5E5] rounded-[20px] p-8 mb-6 relative overflow-hidden h-48 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-dashed border-[#4CAF50]/30 rounded-[12px]"></div>
                        <BookOpen className="w-20 h-20 text-[#4CAF50] drop-shadow-md z-10" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#4CAF50]/10 rounded-full blur-2xl"></div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Finance Hero A-Z</h2>
                    <p className="text-[#888888] text-sm mb-6 max-w-[250px]">
                        Test your financial vocabulary.
                    </p>
                    {/* Hardcoded to Vite default port 5173 per instructions */}
                    <a
                        href="http://localhost:5173"
                        target="_blank" rel="noopener noreferrer"
                        className="w-full py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-lg shadow-[#4CAF50]/20"
                    >
                        Play Now <PlayCircle className="w-5 h-5 fill-white/20" />
                    </a>
                </div>

                {/* Game 2: Paper Trading Simulator */}
                <div className="bg-[#1C1F26] rounded-[24px] overflow-hidden flex flex-col items-center p-6 text-center hover:bg-[#20242D] transition-colors group">
                    <div className="w-full bg-[#E3F2FD] rounded-[20px] p-8 mb-6 relative overflow-hidden h-48 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-dashed border-[#2196F3]/30 rounded-[12px]"></div>
                        <TrendingUp className="w-20 h-20 text-[#2196F3] drop-shadow-md z-10" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#2196F3]/10 rounded-full blur-2xl"></div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Virtual Trading</h2>
                    <p className="text-[#888888] text-sm mb-6 max-w-[250px]">
                        Experience the stock market risk-free.
                    </p>
                    {/* Hardcoded to React default port 3001 or standard per instructions */}
                    <a
                        href="http://localhost:3001/dashboard"
                        target="_blank" rel="noopener noreferrer"
                        className="w-full py-3 bg-[#2196F3] hover:bg-[#1E88E5] text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-lg shadow-[#2196F3]/20"
                    >
                        Play Now <PlayCircle className="w-5 h-5 fill-white/20" />
                    </a>
                </div>

                {/* Coming Soon Placeholder */}
                <div className="bg-[#1C1F26] rounded-[24px] overflow-hidden flex flex-col items-center p-6 text-center border-2 border-dashed border-[#333333] opacity-60">
                    <div className="w-full bg-[#2A2D35] rounded-[20px] p-8 mb-6 relative overflow-hidden h-48 flex items-center justify-center">
                        <Gamepad2 className="w-16 h-16 text-[#555555] z-10" />
                    </div>

                    <h2 className="text-xl font-bold mb-2 text-[#888888]">More Games</h2>
                    <p className="text-[#666666] text-sm mb-6 max-w-[250px]">
                        New educational games are coming soon to BeFin.
                    </p>
                    <button
                        disabled
                        className="w-full py-3 bg-[#2A2D35] text-[#888888] rounded-xl font-bold cursor-not-allowed"
                    >
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
}

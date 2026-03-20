import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">BeFin</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
                        <div className="flex items-center gap-1 cursor-pointer group">
                            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Use Cases</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer group">
                            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Resources</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                        <Link href="#" className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            Get started
                            <span className="text-lg">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

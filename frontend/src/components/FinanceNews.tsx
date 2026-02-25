'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsItem {
    title: string;
    source: string;
    time: string;
    image: string;
}

const fallbackNews: NewsItem[] = [
    {
        title: "Bitcoin hits new all-time high as institutional demand surges.",
        source: "Market Focus",
        time: "Just now",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Federal Reserve hints at potential rate cuts in the upcoming quarter.",
        source: "Economic Update",
        time: "15 min ago",
        image: "https://images.unsplash.com/photo-1611974715853-2b8ef959d0bb?auto=format&fit=crop&q=80&w=800"
    }
];

export default function FinanceNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const rotationRef = useRef<NodeJS.Timeout | null>(null);

    const startRotation = () => {
        if (rotationRef.current) clearInterval(rotationRef.current);
        rotationRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (news.length || fallbackNews.length));
        }, 8000);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % (news.length || fallbackNews.length));
        startRotation(); // Reset timer on manual click
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? (news.length || fallbackNews.length) - 1 : prev - 1));
        startRotation(); // Reset timer on manual click
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api.rss2json.com/v1/api.json?rss_url=https://finance.yahoo.com/news/rssindex`
                );
                const data = await response.json();
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    const formattedNews: NewsItem[] = data.items.slice(0, 10).map((item: any) => ({
                        title: item.title,
                        source: item.author || 'Yahoo Finance',
                        time: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        image: item.thumbnail || item.enclosure?.link || (item.description.match(/src="([^"]+)"/) ? item.description.match(/src="([^"]+)"/)[1] : null)
                    }));
                    setNews(formattedNews);
                }
            } catch (err) {
                console.error('Failed to fetch finance news:', err);
                setNews(fallbackNews);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        const refreshInterval = setInterval(fetchNews, 15 * 60 * 1000);
        return () => {
            clearInterval(refreshInterval);
            if (rotationRef.current) clearInterval(rotationRef.current);
        };
    }, []);

    useEffect(() => {
        if (news.length > 0 || !loading) {
            startRotation();
        }
        return () => {
            if (rotationRef.current) clearInterval(rotationRef.current);
        };
    }, [news, loading]);

    if (loading && news.length === 0) {
        return (
            <div className="flex-1 bg-[#18181c] rounded-3xl p-8 border border-white/5 flex items-center justify-center min-h-[180px]">
                <RefreshCw className="animate-spin text-[#0380f5] w-6 h-6" />
            </div>
        );
    }

    const currentNews = news[currentIndex] || fallbackNews[currentIndex % fallbackNews.length] || fallbackNews[0];

    return (
        <div className="flex-1 rounded-3xl border border-white/5 flex items-center relative overflow-hidden group min-h-[180px] transition-all duration-500 shadow-2xl">
            {/* Background Image Banner */}
            <div className="absolute inset-0 z-0">
                {currentNews.image && (
                    <img
                        key={currentNews.image}
                        src={currentNews.image}
                        alt="News Banner"
                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.3] group-hover:grayscale-0"
                    />
                )}
                {/* Sleek Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-[#111115]/90 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115] to-transparent opacity-60 z-10"></div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 p-8 flex flex-col justify-center gap-3 w-full lg:w-4/5">
                <div className="flex items-center gap-3">
                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live News</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                        <Clock size={12} />
                        {currentNews.time}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 key={currentIndex} className="font-bold text-[19px] lg:text-[21px] text-white leading-[1.3] animate-in fade-in slide-in-from-left-4 duration-700 tracking-tight">
                        {currentNews.title}
                    </h2>
                    <div className="w-12 h-1 bg-[#0380f5] rounded-full mt-1"></div>
                </div>
            </div>

            {/* Manual Navigation Controls */}
            <div className="absolute right-8 bottom-8 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}

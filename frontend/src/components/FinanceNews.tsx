'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, RefreshCw, ChevronLeft, ChevronRight, ExternalLink, Calendar } from 'lucide-react';

interface NewsItem {
    title: string;
    source: string;
    time: string;
    date?: string;
    image: string;
    url?: string;
}

export default function FinanceNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const rotationRef = useRef<NodeJS.Timeout | null>(null);

    const startRotation = () => {
        if (rotationRef.current) clearInterval(rotationRef.current);
        rotationRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (news.length));
        }, 8000);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % (news.length));
        startRotation(); // Reset timer on manual click
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? (news.length) - 1 : prev - 1));
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
                        date: new Date(item.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
                        image: item.thumbnail || item.enclosure?.link || (item.description.match(/src="([^"]+)"/) ? item.description.match(/src="([^"]+)"/)[1] : null),
                        url: item.link || null,
                    }));
                    setNews(formattedNews);
                }
            } catch (err) {
                console.error('Failed to fetch finance news:', err);
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

    if (news.length === 0) {
        if (loading) {
            return (
                <div className="flex-1 bg-[#18181c] rounded-3xl p-8 border border-white/5 flex items-center justify-center min-h-[180px]">
                    <RefreshCw className="animate-spin text-[#0380f5] w-6 h-6" />
                </div>
            );
        }
        return null;
    }

    const currentNews = news[currentIndex];

    return (
        <div className="flex-1 rounded-3xl border border-white/5 flex items-center relative overflow-hidden group min-h-[250px] transition-all duration-500 shadow-2xl">
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
            <div className="relative z-20 p-6 md:p-8 flex flex-col justify-center gap-2 md:gap-3 w-full lg:w-4/5">
                <div className="flex items-center gap-3">
                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live News</span>
                    </div>
                    {currentNews.date && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                            <Calendar size={12} />
                            {currentNews.date}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                        <Clock size={12} />
                        {currentNews.time}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {currentNews.url ? (
                        <a
                            href={currentNews.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/title"
                        >
                            <h2 key={currentIndex} className="font-bold text-[16px] sm:text-[19px] lg:text-[21px] text-white leading-[1.3] animate-in fade-in slide-in-from-left-4 duration-700 tracking-tight group-hover/title:text-blue-300 transition-colors flex items-start gap-2">
                                {currentNews.title}
                                <ExternalLink className="w-4 h-4 shrink-0 mt-1 opacity-0 group-hover/title:opacity-100 transition-opacity text-blue-400 hidden md:block" />
                            </h2>
                        </a>
                    ) : (
                        <h2 key={currentIndex} className="font-bold text-[16px] sm:text-[19px] lg:text-[21px] text-white leading-[1.3] animate-in fade-in slide-in-from-left-4 duration-700 tracking-tight">
                            {currentNews.title}
                        </h2>
                    )}
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

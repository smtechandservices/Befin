import React from 'react';
import { X, Gamepad2, Play } from 'lucide-react';
import Image from 'next/image';

interface GamePlayModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: any | null;
    balance: string | number | null;
}

export default function GamePlayModal({ isOpen, onClose, game, balance }: GamePlayModalProps) {
    if (!isOpen || !game) return null;

    const formattedBalance = balance !== null ? parseFloat(balance.toString()).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '---';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#111] rounded-[2rem] border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header Banner */}
                <div className="w-full h-40 relative overflow-hidden bg-[#18181c] shrink-0">
                    {game.game_banner ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${game.game_banner})` }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10 z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative p-8 pt-0 flex flex-col gap-6">
                    {/* Game Details */}
                    <div className="flex flex-col items-center text-center -mt-12 relative z-10">
                        <div className="w-24 h-24 bg-[#111] rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border border-white/10 shrink-0 mb-4">
                            {game.game_logo ? (
                                <Image src={game.game_logo} alt={game.name} width={96} height={96} className="w-full h-full object-cover relative z-10" />
                            ) : (
                                <Gamepad2 className="w-12 h-12 text-blue-400 relative z-10" />
                            )}
                        </div>

                        <div className="flex gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">{game.genre}</span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Age {game.age_req}+</span>
                        </div>

                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">{game.name}</h2>
                        <p className="text-sm text-slate-400 leading-relaxed px-4">{game.description || 'Interactive financial learning experience.'}</p>
                    </div>

                    <div className="w-full h-[1px] bg-white/5"></div>

                    {/* Wallet Section */}
                    <div className="flex justify-between items-center bg-[#181818] p-5 rounded-lg border border-white/5">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Balance</span>
                            <span className="text-white font-bold text-sm">BeFin Wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">{formattedBalance} <span className="text-xs text-slate-500 font-bold ml-1">BFC</span></span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                        <a
                            href={game.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="flex-1 py-4 font-black rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 group"
                        >
                            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                            Proceed to Play
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

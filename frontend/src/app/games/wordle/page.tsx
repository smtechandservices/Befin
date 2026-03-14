"use client";

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { authService, walletService, gamesService } from '@/lib/api';
import { FINANCE_WORDS } from './words';
import './index.css';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

type GameState = 'PLAYING' | 'WON' | 'LOST' | 'WELCOME';

interface LeaderboardEntry {
    username: string;
    score: number;
}

export default function WordleGame() {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState>('WELCOME');
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [username, setUsername] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [usedLetters, setUsedLetters] = useState<Record<string, string>>({});
    const [hint, setHint] = useState('');
    const [hintUsed, setHintUsed] = useState(false);

    const initData = useCallback(async () => {
        try {
            const profile = await authService.getProfile();
            setUsername(profile.username);

            const balanceData = await walletService.getBalance();
            setWalletBalance(balanceData.balance);

            const games = await gamesService.getGames();
            const wordleGame = games.find((g: any) => g.slug === 'wordle');
            if (wordleGame) {
                const lb = await gamesService.getLeaderboard('wordle');
                setLeaderboard(lb);
            }
        } catch (err) {
            console.error('Initialization error:', err);
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        initData();
    }, [initData]);

    const startNewGame = async () => {
        setErrorMsg('');
        setIsLoading(true);
        try {
            const checkPlay = await gamesService.checkPlayLimit('wordle');
            if (!checkPlay.can_play) {
                setErrorMsg(`Daily limit reached! You have played twice today. Please come back tomorrow!`);
                setIsLoading(false);
                return;
            }

            const randomWordObj = FINANCE_WORDS[Math.floor(Math.random() * FINANCE_WORDS.length)];
            setSolution(randomWordObj.term.toUpperCase());
            setGuesses([]);
            setCurrentGuess('');
            setUsedLetters({});
            setHint('');
            setHintUsed(false);
            setGameState('PLAYING');
        } catch (err) {
            console.error('Failed to start game', err);
            setErrorMsg('Error verifying play limit. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const onKeyup = useCallback((e: KeyboardEvent) => {
        if (gameState !== 'PLAYING') return;

        if (e.key === 'Enter') {
            submitGuess();
        } else if (e.key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
            setCurrentGuess(prev => prev + e.key.toUpperCase());
        }
    }, [currentGuess, gameState]);

    useEffect(() => {
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
    }, [onKeyup]);

    const submitGuess = async () => {
        if (currentGuess.length !== WORD_LENGTH) return;

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);

        // Update used letters
        const newUsedLetters = { ...usedLetters };
        currentGuess.split('').forEach((char, i) => {
            const state = char === solution[i] ? 'correct' : solution.includes(char) ? 'present' : 'absent';
            if (newUsedLetters[char] !== 'correct') {
                newUsedLetters[char] = state;
            }
        });
        setUsedLetters(newUsedLetters);

        if (currentGuess === solution) {
            handleWin(newGuesses.length);
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameState('LOST');
        }

        setCurrentGuess('');
    };

    const handleWin = async (attempts: number) => {
        setGameState('WON');
        triggerConfetti();
        setIsLoading(true);

        try {
            const gameScore = (7 - attempts) * 100; // Display score
            const response = await walletService.awardCoins('wordle', attempts, gameScore, hintUsed);
            if (response && response.success) {
                const balanceData = await walletService.getBalance();
                setWalletBalance(balanceData.balance);
                const lb = await gamesService.getLeaderboard('wordle');
                setLeaderboard(lb);
            }
        } catch (err) {
            console.error('Win sync error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00ff88', '#00ccff', '#fccb0b'],
        });
    };

    const showHint = () => {
        const wordObj = FINANCE_WORDS.find(w => w.term.toUpperCase() === solution);
        if (wordObj) {
            setHint(wordObj.hint);
            setHintUsed(true);
        }
    };

    const getTileState = (word: string, index: number) => {
        const char = word[index];
        if (char === solution[index]) return 'correct';
        if (solution.includes(char)) return 'present';
        return 'absent';
    };

    return (
        <div className="wordle-body">
            <button className="exit-btn" onClick={() => router.push('/dashboard')}>✕</button>

            <aside className="game-sidebar">
                <div className="sidebar-card profile-card">
                    <div className="avatar">{username[0]?.toUpperCase()}</div>
                    <div className="profile-info">
                        <div className="username">{username}</div>
                        <div className="rank-badge">Finance Pro</div>
                    </div>
                </div>

                <div className="sidebar-card wallet-card">
                    <div className="title">Befin Treasury</div>
                    <div className="value">{walletBalance} <small>BFC</small></div>
                </div>

                <div className="sidebar-card leaderboard-card">
                    <div className="title" style={{ marginBottom: '10px', display: 'block' }}>Global Ranking</div>
                    {leaderboard.map((entry, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span>#{i + 1} {entry.username}</span>
                            <span style={{ color: 'var(--wordle-correct)' }}>{entry.score}</span>
                        </div>
                    ))}
                </div>
            </aside>

            <div className="wordle-container fade-in">
                <header className="wordle-header">
                    <h1>BEFIN WORDLE</h1>
                    <button
                        className="hint-btn"
                        onClick={showHint}
                        disabled={gameState !== 'PLAYING' || hintUsed}
                    >
                        {hintUsed ? '💡 Hint Used' : '💡 Get Hint'}
                    </button>
                </header>

                {hint && (
                    <div className="hint-box fade-in">
                        <strong>Clue:</strong> {hint}
                        <p className="hint-penalty">(-50% Reward Penalty applied)</p>
                    </div>
                )}

                <main className="game-board">
                    <div className="grid">
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
                            const guess = guesses[i];
                            const isCurrent = i === guesses.length;

                            return (
                                <div key={i} className={`row ${isCurrent && currentGuess.length === WORD_LENGTH ? '' : ''}`}>
                                    {Array.from({ length: WORD_LENGTH }).map((_, j) => {
                                        const char = isCurrent ? currentGuess[j] : guess ? guess[j] : '';
                                        const state = guess ? getTileState(guess, j) : isCurrent && char ? 'active' : '';

                                        return (
                                            <div key={j} className="tile" data-state={state}>
                                                {char}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </main>

                <section className="keyboard">
                    {[['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']].map((row, i) => (
                        <div key={i} className="keyboard-row">
                            {row.map(key => (
                                <button
                                    key={key}
                                    className={`key ${key.length > 1 ? 'large' : ''}`}
                                    data-state={usedLetters[key] || ''}
                                    onClick={() => {
                                        if (key === 'ENTER') submitGuess();
                                        else if (key === 'BACK') setCurrentGuess(prev => prev.slice(0, -1));
                                        else if (currentGuess.length < WORD_LENGTH) setCurrentGuess(prev => prev + key);
                                    }}
                                >
                                    {key === 'BACK' ? '⌫' : key}
                                </button>
                            ))}
                        </div>
                    ))}
                </section>
            </div>

            {gameState === 'WELCOME' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Befin Wordle</h2>
                        <p>Guess the 5-letter finance word in 6 tries. Boost your treasury!</p>
                        {errorMsg && <p style={{ color: '#ff4d4f', fontSize: '14px' }}>{errorMsg}</p>}
                        <button className="primary-btn" onClick={startNewGame} disabled={isLoading}>
                            {isLoading ? 'PREPARING...' : 'START GAME'}
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'WON' && (
                <div className="modal-overlay">
                    <div className="modal-content bounce">
                        <h2>STUNNING!</h2>
                        <p>You cracked the code in {guesses.length} attempts.</p>
                        <div className="score">+{(7 - guesses.length) * 10} BFC</div>
                        <button className="primary-btn" onClick={() => window.location.reload()}>PLAY AGAIN</button>
                        <button className="secondary-btn" onClick={() => router.push('/dashboard')}>DASHBOARD</button>
                    </div>
                </div>
            )}

            {gameState === 'LOST' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>MISSION FAILED</h2>
                        <p>The word was <strong>{solution}</strong></p>
                        <button className="primary-btn" onClick={() => window.location.reload()}>TRY AGAIN</button>
                        <button className="secondary-btn" onClick={() => router.push('/dashboard')}>DASHBOARD</button>
                    </div>
                </div>
            )}
        </div>
    );
}

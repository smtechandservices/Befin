"use client";

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { authService, walletService, gamesService } from '@/lib/api';
import { FINANCE_WORDS } from './words';
import styles from './wordle.module.css';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

type GameState = 'PLAYING' | 'WON' | 'LOST' | 'WELCOME' | 'SKIPPED';

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

    const skipGame = () => {
        if (gameState !== 'PLAYING') return;
        setGameState('SKIPPED');
    };

    const getTileState = (word: string, index: number) => {
        const char = word[index];
        if (char === solution[index]) return 'correct';
        if (solution.includes(char)) return 'present';
        return 'absent';
    };

    return (
        <div className={styles.wordleBody}>
            <button className={styles['exit-btn']} onClick={() => router.push('/dashboard')}>✕</button>

            <aside className={styles['game-sidebar']}>
                <div className={`${styles['sidebar-card']} ${styles['profile-card']}`}>
                    <div className={styles.avatar}>{username[0]?.toUpperCase()}</div>
                    <div className={styles['profile-info']}>
                        <div className={styles.username}>{username}</div>
                        <div className={styles['rank-badge']}>Finance Pro</div>
                    </div>
                </div>

                <div className={`${styles['sidebar-card']} ${styles['wallet-card']}`}>
                    <div className={styles.title}>Befin Treasury</div>
                    <div className={styles.value}>{walletBalance} <small>BFC</small></div>
                </div>

                <div className={`${styles['sidebar-card']} ${styles['leaderboard-card']}`}>
                    <div className={styles.title} style={{ marginBottom: '10px', display: 'block' }}>Global Ranking</div>
                    {leaderboard.map((entry, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span>#{i + 1} {entry.username}</span>
                            <span style={{ color: 'var(--wordle-correct)' }}>{entry.score}</span>
                        </div>
                    ))}
                </div>
            </aside>

            <div className={`${styles['wordle-container']} ${styles['fade-in']}`}>
                <header className={styles['wordle-header']}>
                    <h1>BEFIN WORDLE</h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className={styles['hint-btn']}
                            onClick={showHint}
                            disabled={gameState !== 'PLAYING' || hintUsed}
                        >
                            {hintUsed ? '💡 Hint Used' : '💡 Get Hint'}
                        </button>
                        <button
                            className={styles['skip-btn']}
                            onClick={skipGame}
                            disabled={gameState !== 'PLAYING'}
                        >
                            ⏭️ Skip
                        </button>
                    </div>
                </header>

                {hint && (
                    <div className={`${styles['hint-box']} ${styles['fade-in']}`}>
                        <strong>Clue:</strong> {hint}
                        <p className={styles['hint-penalty']}>(-50% Reward Penalty applied)</p>
                    </div>
                )}

                <main className={styles['game-board']}>
                    <div className={styles.grid}>
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
                            const guess = guesses[i];
                            const isCurrent = i === guesses.length;

                            return (
                                <div key={i} className={styles.row}>
                                    {Array.from({ length: WORD_LENGTH }).map((_, j) => {
                                        const char = isCurrent ? currentGuess[j] : guess ? guess[j] : '';
                                        const state = guess ? getTileState(guess, j) : isCurrent && char ? 'active' : '';

                                        return (
                                            <div key={j} className={styles.tile} data-state={state}>
                                                {char}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </main>

                <section className={styles.keyboard}>
                    {[['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']].map((row, i) => (
                        <div key={i} className={styles['keyboard-row']}>
                            {row.map(key => (
                                <button
                                    key={key}
                                    className={`${styles.key} ${key.length > 1 ? styles.large : ''}`}
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
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <h2>Befin Wordle</h2>
                        <p>Guess the 5-letter finance word in 6 tries. Boost your treasury!</p>
                        {errorMsg && <p style={{ color: '#ff4d4f', fontSize: '14px' }}>{errorMsg}</p>}
                        <button className={styles['primary-btn']} onClick={startNewGame} disabled={isLoading}>
                            {isLoading ? 'PREPARING...' : 'START GAME'}
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'WON' && (
                <div className={styles['modal-overlay']}>
                    <div className={`${styles['modal-content']} ${styles.bounce}`}>
                        <h2>STUNNING!</h2>
                        <p>You cracked the code in {guesses.length} attempts.</p>
                        <div className={styles.score}>+{(7 - guesses.length) * 10} BFC</div>
                        <button className={styles['primary-btn']} onClick={() => window.location.reload()}>PLAY AGAIN</button>
                        <button className={styles['secondary-btn']} onClick={() => router.push('/dashboard')}>DASHBOARD</button>
                    </div>
                </div>
            )}

            {gameState === 'LOST' && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <h2>MISSION FAILED</h2>
                        <p>The word was <strong>{solution}</strong></p>
                        <button className={styles['primary-btn']} onClick={() => window.location.reload()}>TRY AGAIN</button>
                        <button className={styles['secondary-btn']} onClick={() => router.push('/dashboard')}>DASHBOARD</button>
                    </div>
                </div>
            )}

            {gameState === 'SKIPPED' && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <h2>MISSION SKIPPED</h2>
                        <p>The word was <strong>{solution}</strong></p>
                        <button className={styles['primary-btn']} onClick={() => window.location.reload()}>PLAY AGAIN</button>
                        <button className={styles['secondary-btn']} onClick={() => router.push('/dashboard')}>DASHBOARD</button>
                    </div>
                </div>
            )}
        </div>
    );
}

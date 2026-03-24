"use client";

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { authService, walletService, gamesService } from '@/lib/api';
import { FINANCE_KEYWORDS } from './keywords';
import { FINANCE_TERMS as FINANCE_TERMS_RAW } from './constants';
const FINANCE_TERMS = FINANCE_TERMS_RAW as Record<string, string[]>;
import styles from './azm.module.css';

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const QUESTIONS_COUNT = 10;

type AgePref = 'KID' | 'TEEN' | 'ADULT';

const AGE_CONFIG: Record<AgePref, { timer: number; label: string; desc: string }> = {
  KID: { timer: 40, label: "Beginner", desc: "For youngsters learning about money! (Hints available)" },
  TEEN: { timer: 20, label: "Intermediate", desc: "For those building wealth habits. (No hints)" },
  ADULT: { timer: 20, label: "Advanced", desc: "The ultimate challenge for experts! (No hints)" },
};

const SUCCESS_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/uyWTOgNGfWpG/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/67ThRZlYBvibLh4bAF/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/lptjRBx24DfcaatibC/giphy.gif",
];

const FAILURE_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/PyoyQRPuoZbeE/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/ZGH8VtTZMmnwzsYYMf/giphy.gif",
];

interface LeaderboardEntry {
  username: string;
  score: number;
}

interface Transaction {
  timestamp: string;
  description: string;
  amount: string | number;
}

interface Feedback {
  message: string;
  type: string;
  gif: string;
}

function App() {
  const router = useRouter();
  const [gameState, setGameState] = useState<string>('WELCOME');
  const [username, setUsername] = useState<string>('');
  const [agePref, setAgePref] = useState<AgePref>('TEEN');
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [feedback, setFeedback] = useState<Feedback>({ message: '', type: '', gif: '' });
  const [hint, setHint] = useState<string>('');
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLetter = shuffledLetters[currentLetterIndex] ?? '';

  useEffect(() => {
    const initData = async () => {
      try {
        const profile = await authService.getProfile();
        setUsername(profile.username);

        const balanceData = await walletService.getBalance();
        setWalletBalance(balanceData.balance);

        const games = await gamesService.getGames();
        const azmGame = games.find((g: { slug: string }) => g.slug === 'azm');
        if (azmGame) {
          const [lb, tx] = await Promise.all([
            gamesService.getLeaderboard('azm'),
            gamesService.getGameTransactions('azm'),
          ]);
          setLeaderboard(lb);
          setRecentTransactions(tx);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        router.push('/login');
      }
    };

    initData();

    const shuffled = [...ALL_LETTERS].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled.slice(0, QUESTIONS_COUNT));
  }, [router]);

  // Timer logic
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentLetterIndex]);

  const handleTimeOut = () => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    setScore(prev => prev - 10);
    setFeedback({
      message: 'TIME EXPIRED! Analysis Terminated. -10 Points ⏱️',
      type: 'error',
      gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)],
    });
    setTimeout(nextChallenge, 2000);
  };

  const nextChallenge = () => {
    if (currentLetterIndex < shuffledLetters.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
      setTimeLeft(AGE_CONFIG[agePref].timer);
      setInputValue('');
      setFeedback({ message: '', type: '', gif: '' });
      setHint('');
      setHintUsed(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setGameState('WIN');
    if (score >= 0) triggerCoins();
    setIsLoading(true);

    try {
      const response = await walletService.awardCoins(
        'azm',
        Math.min(Math.floor(score / 10), 100),
        score,
      );
      if (response && response.success) {
        const [lb, tx, balanceData] = await Promise.all([
          gamesService.getLeaderboard('azm'),
          gamesService.getGameTransactions('azm'),
          walletService.getBalance(),
        ]);
        setLeaderboard(lb);
        setRecentTransactions(tx);
        setWalletBalance(balanceData.balance);
      } else {
        console.error('Wallet sync failed:', response);
      }
    } catch (err) {
      console.error('Network error during BeCoin sync:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerCoins = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fccb0b', '#ffd700', '#00ff88'],
    });
  };

  const getHint = async () => {
    if (hint || isLoading) return;
    setIsLoading(true);

    const validKeywords = FINANCE_KEYWORDS.filter((k: { term: string; hint: string }) =>
      k.term.toUpperCase().startsWith(currentLetter.toUpperCase()),
    );
    const randomKeyword =
      validKeywords.length > 0
        ? validKeywords[Math.floor(Math.random() * validKeywords.length)]
        : null;

    if (randomKeyword) {
      setHint(`HINT: ${randomKeyword.hint}`);
      setHintUsed(true);
    } else {
      setHint(`HINT: Think of a financial term starting with ${currentLetter}... 🏦`);
    }

    setIsLoading(false);
  };

  const checkIsFinanceTerm = async (word: string): Promise<boolean> => {
    const term = word.toUpperCase();
    const firstLetter = term[0];

    if (
      FINANCE_TERMS[firstLetter] &&
      FINANCE_TERMS[firstLetter].some((t: string) => t.toUpperCase() === term)
    ) {
      return true;
    }

    if (FINANCE_KEYWORDS.some((k: { term: string }) => k.term.toUpperCase() === term)) {
      return true;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) return false;
      const data = await response.json();
      const fullText = JSON.stringify(data).toLowerCase();
      return FINANCE_KEYWORDS.some((k: { term: string }) => fullText.includes(k.term.toLowerCase()));
    } catch {
      return false;
    }
  };

  const startGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (username.trim()) {
      setIsLoading(true);
      try {
        const checkPlay = await gamesService.checkPlayLimit('azm');
        if (!checkPlay.can_play) {
          setErrorMsg(`Daily limit reached! You have played twice today. Please come back tomorrow!`);
          setIsLoading(false);
          return;
        }
        setTimeLeft(AGE_CONFIG[agePref].timer);
        setGameState('PLAYING');
      } catch (err) {
        console.error('Failed to check play limit', err);
        setErrorMsg('Error verifying play limit. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const term = inputValue.trim();
    setIsLoading(true);
    if (timerRef.current !== null) clearInterval(timerRef.current);

    if (!term) {
      setScore(prev => prev - 10);
      setFeedback({
        message: 'No input detected! Skipping... -10 Points ⏭️',
        type: 'error',
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)],
      });
      setTimeout(() => { setIsLoading(false); nextChallenge(); }, 2000);
      return;
    }

    if (term[0].toUpperCase() !== shuffledLetters[currentLetterIndex]) {
      setScore(prev => prev - 30);
      setFeedback({
        message: `Oops! Must start with ${shuffledLetters[currentLetterIndex]}! -30 Points ❌`,
        type: 'error',
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)],
      });
      setTimeout(() => { setIsLoading(false); nextChallenge(); }, 2000);
      return;
    }

    const isValid = await checkIsFinanceTerm(term);

    if (isValid) {
      let points = 100;
      if (agePref === 'KID') {
        points = hintUsed ? 20 : 50;
      }
      setScore(prev => prev + points);
      setFeedback({
        message: `${hintUsed ? 'GOOD!' : 'STUNNING!'} +${points} Points 💎`,
        type: 'success',
        gif: SUCCESS_GIFS[Math.floor(Math.random() * SUCCESS_GIFS.length)],
      });
    } else {
      setScore(prev => prev - 50);
      setFeedback({
        message: 'Invalid Finance Term! -50 Points ❌',
        type: 'error',
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)],
      });
    }

    setTimeout(() => { setIsLoading(false); nextChallenge(); }, 2000);
  };

  if (gameState === 'WELCOME') {
    return (
      <div className={styles.azmBody}>
        <div className={`${styles['game-container']} ${styles['welcome-state']} ${styles['fade-in']}`}>
          <aside className={styles['game-sidebar']}>
            <div className={`${styles['sidebar-card']} ${styles['profile-card']}`}>
              <div className={styles.avatar}>{username[0]?.toUpperCase()}</div>
              <div className={styles['profile-info']}>
                <div className={styles.username}>{username}</div>
                <div className={styles['rank-badge']}>Active Player</div>
              </div>
            </div>

            <div className={`${styles['sidebar-card']} ${styles['wallet-card']}`}>
              <div className={styles['card-header']}>
                <span className={styles.icon}>💳</span>
                <span className={styles.title}>Your Account</span>
              </div>
              <div className={styles['wallet-stats']}>
                <div className={styles.stat}>
                  <span className={styles.label}>Current Balance</span>
                  <span className={styles.value}>{walletBalance} <small>BFC</small></span>
                </div>
              </div>
            </div>

            <div className={`${styles['sidebar-card']} ${styles['leaderboard-card']}`}>
              <div className={styles['card-header']}>
                <span className={styles.icon}>🏆</span>
                <span className={styles.title}>Global Rankings</span>
              </div>
              <div className={styles['stats-list']}>
                {leaderboard.length > 0
                  ? leaderboard.map((entry, i) => (
                    <div key={i} className={styles['stats-item']}>
                      <span className={styles.rank}>#{i + 1}</span>
                      <span className={styles.name}>{entry.username}</span>
                      <span className={entry.score >= 0 ? styles['text-green-500'] : styles['text-red-500']}>
                        {entry.score > 0 ? `+${entry.score}` : entry.score}
                      </span>
                    </div>
                  ))
                  : <div className={styles['empty-msg']}>No entries yet</div>}
              </div>
            </div>
          </aside>

          <main className={styles['game-main']}>
            <div className={`${styles['main-content-card']} ${styles['welcome-hero']}`}>
              <div className={styles['hero-content']}>
                <h1 className={styles['slide-up']}>A-Z of Money</h1>
                <p className={`${styles.subtitle} ${styles['slide-up']}`}>Master the language of global finance and build your digital empire.</p>

                <div className={`${styles['age-selector']} ${styles['slide-up']}`}>
                  {(Object.keys(AGE_CONFIG) as AgePref[]).map((pref) => (
                    <div
                      key={pref}
                      className={`${styles['age-option']} ${agePref === pref ? styles.active : ''}`}
                      onClick={() => setAgePref(pref)}
                    >
                      <div className={styles['age-title']}>{AGE_CONFIG[pref].label}</div>
                      <div className={styles['age-desc']}>{AGE_CONFIG[pref].desc}</div>
                    </div>
                  ))}
                </div>

                <div className={`${styles['action-group']} ${styles['slide-up']}`}>
                  {errorMsg && (
                    <div style={{ color: '#ff4d4f', background: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', border: '1px solid #ff4d4f' }}>
                      {errorMsg}
                    </div>
                  )}
                  <form onSubmit={startGame}>
                    <button type="submit" className={styles['start-btn']} disabled={isLoading}>
                      {isLoading ? 'ANALYZING CLEARANCE...' : 'INITIALIZE CORE MISSION'}
                    </button>
                  </form>
                  <button className={styles['exit-btn']} onClick={() => router.push('/learning')} disabled={isLoading}>
                    BACK TO HUB
                  </button>
                </div>

                <div className={styles['how-to-play-guide']}>
                  <h3>🎮 Operational Manual</h3>
                  <div className={styles['guide-grid']}>
                    <div className={styles['guide-step']}>
                      <div className={styles['step-num']}>01</div>
                      <p>Enter a <strong>Finance Term</strong> starting with the assigned letter.</p>
                    </div>
                    <div className={styles['guide-step']}>
                      <div className={styles['step-num']}>02</div>
                      <p>Earn <strong>Elite Points</strong> for correct submissions.</p>
                    </div>
                    <div className={styles['guide-step']}>
                      <div className={styles['step-num']}>03</div>
                      <p>Use <strong>Insights</strong> if you&apos;re stuck on a complex term.</p>
                    </div>
                    <div className={styles['guide-step']}>
                      <div className={styles['step-num']}>04</div>
                      <p>Complete A-Z to sync <strong>BeCoins</strong> back to your treasury.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles['recent-activity']}>
                <h3>📜 Recent Performance</h3>
                <div className={styles['activity-list']}>
                  {recentTransactions.length > 0
                    ? recentTransactions.map((tx, i) => (
                      <div key={i} className={styles['activity-item']}>
                        <span className={styles.date}>{new Date(tx.timestamp).toLocaleDateString()}</span>
                        <span className={styles.desc}>{tx.description}</span>
                        <span className={styles.amount}>+{tx.amount} BFC</span>
                      </div>
                    ))
                    : <div className={styles['empty-msg']}>No recent missions recorded</div>}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (gameState === 'WIN') {
    return (
      <div className={styles.azmBody}>
        <div className={`${styles['game-container']} ${styles['win-state']} ${styles['fade-in']}`}>
          <main className={styles['win-content']}>
            <div className={`${styles['victory-card']} ${styles['slide-up']} ${score < 0 ? styles.failure : ''}`}>
              <div className={styles['victory-header']}>
                <div className={styles.trophy}>{score < 0 ? '🚫' : '🏆'}</div>
                <h1>{score < 0 ? 'MISSION FAILED' : 'MISSION SUCCESS'}</h1>
                <p className={styles.subtitle}>
                  {score < 0 ? 'Better luck next time' : 'Elite Financial Recognition Secured'}
                </p>
              </div>

              <div className={styles['victory-stats']}>
                <div className={styles['v-stat']}>
                  <span className={styles.label}>SCORE GENERATED</span>
                  <span className={styles.value}>{score}</span>
                </div>
                <div className={`${styles['v-stat']} ${styles.highlight}`}>
                  <span className={styles.label}>
                    {score < 0 ? 'BECOINS DEDUCTED' : 'BECOINS SECURED'}
                  </span>
                  <span className={`${styles.value} ${score < 0 ? 'text-red-500' : ''}`}>
                    {score < 0 ? '-' : '+'}{Math.abs(Math.min(Math.floor(score / 10), 100))}
                  </span>
                </div>
              </div>

              <div className={styles['sync-indicator']}>
                {isLoading
                  ? <div className={styles['sync-status']}>Updating BeFin Treasury... 🔄</div>
                  : <div className={`${styles['sync-status']} ${styles.success}`}>Treasury Sync Complete ✅</div>}
              </div>

              <div className={styles['victory-actions']}>
                <button className={`${styles['elite-btn']} ${styles.primary}`} onClick={() => window.location.reload()}>
                  RE-ENGAGE MISSION
                </button>
                <button className={`${styles['elite-btn']} ${styles.secondary}`} onClick={() => router.push('/dashboard')}>
                  RETURN TO BASE
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.azmBody}>
      <div className={`${styles['game-container']} ${styles['fade-in']}`}>
        <button
          className={styles['back-edge-btn']}
          onClick={() => router.push('/dashboard')}
          title="Return to Dashboard"
        >
          ✕
        </button>

        <aside className={styles['game-sidebar']}>
          <div className={`${styles['sidebar-card']} ${styles['profile-card']}`}>
            <div className={styles.avatar}>{username[0]?.toUpperCase()}</div>
            <div className={styles['profile-info']}>
              <div className={styles.username}>{username}</div>
              <div className={styles['rank-badge']}>{AGE_CONFIG[agePref].label}</div>
            </div>
          </div>

          <div className={`${styles['sidebar-card']} ${styles['wallet-card']}`}>
            <div className={styles['card-header']}>
              <span className={styles.icon}>💳</span>
              <span className={styles.title}>Wallet</span>
            </div>
            <div className={styles['wallet-stats']}>
              <div className={styles.stat}>
                <span className={styles.label}>Balance</span>
                <span className={styles.value}>{walletBalance} <small>BFC</small></span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Session</span>
                <span className={styles.value}>{score} <small>PTS</small></span>
              </div>
            </div>
          </div>

          <div className={`${styles['sidebar-card']} ${styles['leaderboard-card']} overflow-y-auto max-h-[400px]`}>
            <div className={`${styles['card-header']} sticky top-0`}>
              <span className={styles.icon}>🏆</span>
              <span className={styles.title}>Top Elite</span>
            </div>
            <div className={styles['stats-list']}>
              {leaderboard.length > 0
                ? leaderboard.map((entry, i) => (
                  <div key={i} className={styles['stats-item']}>
                    <span className={styles.rank}>#{i + 1}</span>
                    <span className={styles.name}>{entry.username}</span>
                    <span className={`${styles.score} ${entry.score >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {entry.score > 0 ? `+${entry.score}` : entry.score}
                    </span>
                  </div>
                ))
                : <div className={styles['empty-msg']}>No entries yet</div>}
            </div>
          </div>
        </aside>

        <main className={styles['game-main']}>
          <div className={styles['main-content-card']}>
            <div className={styles['game-header']}>
              <div className={styles['timer-display']}>
                <span className={styles.label}>Remaining</span>
                <span className={styles.time} style={{ color: timeLeft < 5 ? 'var(--error)' : 'inherit' }}>
                  {timeLeft}s
                </span>
              </div>
              <div className={styles['progress-section']}>
                <div className={styles['progress-text']}>Level {currentLetterIndex + 1} of {QUESTIONS_COUNT}</div>
                <div className={styles['progress-track']}>
                  <div
                    className={styles['progress-bar-elite']}
                    style={{ width: `${((currentLetterIndex + 1) / QUESTIONS_COUNT) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className={styles['game-canvas']}>
              <div className={styles['letter-ring-container']}>
                <div className={styles['letter-ring']}>{currentLetter}</div>
                <div className={styles['ring-glow']} />
              </div>

              <div className={styles['action-center']}>
                {agePref === 'KID' && (
                  <div className={styles['hint-section']}>
                    <button
                      className={styles['lifeline-btn']}
                      onClick={getHint}
                      disabled={!!hint || isLoading}
                    >
                      💡 Get Insight
                    </button>
                    {hint && <div className={`${styles['hint-box']} ${styles['fade-in']}`}>{hint}</div>}
                  </div>
                )}

                <div className={styles['input-section']}>
                  <form onSubmit={handleSubmit} className={styles['game-form']}>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={isLoading ? 'Analyzing...' : `Enter ${currentLetter} Finance Term`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                    />
                    <button className={styles['confirm-btn']} disabled={isLoading}>
                      {isLoading ? '...' : 'CONFIRM'}
                    </button>
                  </form>
                </div>

                <div className={styles['feedback-container']}>
                  {feedback.gif && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={feedback.gif} className={styles['feedback-gif']} alt="feedback" />
                  )}
                  {feedback.message && (
                    <div className={`${styles.feedback} ${styles[feedback.type]}`}>{feedback.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

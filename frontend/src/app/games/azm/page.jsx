"use client";

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { authService, walletService, gamesService } from '@/lib/api';
import { FINANCE_KEYWORDS } from './keywords';
import { FINANCE_TERMS } from './constants';
import './index.css';

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const QUESTIONS_COUNT = 10;

// Age preferences: Kid (30s, simple), Teen (20s, medium), Adult (15s, hard)
const AGE_CONFIG = {
  KID: { timer: 20, label: "Junior Explorer", desc: "For youngsters learning about money!" },
  TEEN: { timer: 20, label: "Finance Trainee", desc: "For teens building wealth habits." },
  ADULT: { timer: 20, label: "Wall Street Pro", desc: "The ultimate challenge for experts!" }
};

const SUCCESS_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/uyWTOgNGfWpG/giphy.gif", // Rich kid
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/67ThRZlYBvibLh4bAF/giphy.gif", // Money rain
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/lptjRBx24DfcaatibC/giphy.gif"  // Scrooge McDuck
];

const FAILURE_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/PyoyQRPuoZbeE/giphy.gif", // Empty wallet
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif", // Sad bank
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY2MGJleXhsZzlyMmdqNTVqNTVqNTVqNTVqNTVqNTVqNTVqNTVqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/ZGH8VtTZMmnwzsYYMf/giphy.gif" // No money
];

function App() {
  const router = useRouter();
  const [gameState, setGameState] = useState('WELCOME');
  const [username, setUsername] = useState("");
  const [agePref, setAgePref] = useState('TEEN');
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState({ message: "", type: "", gif: "" });
  const [hint, setHint] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [lifelines, setLifelines] = useState({ hint: true });
  const [walletBalance, setWalletBalance] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const currentLetter = shuffledLetters[currentLetterIndex] || "";

  useEffect(() => {
    // Fetch User Profile and Game Data
    const initData = async () => {
      try {
        const profile = await authService.getProfile();
        setUsername(profile.username);

        const balanceData = await walletService.getBalance();
        setWalletBalance(balanceData.balance);

        const games = await gamesService.getGames();
        const azmGame = games.find(g => g.slug === 'azm');
        if (azmGame) {
          const [lb, tx] = await Promise.all([
            gamesService.getLeaderboard('azm'),
            gamesService.getGameTransactions('azm')
          ]);
          setLeaderboard(lb);
          setRecentTransactions(tx);
        }
      } catch (err) {
        console.error("Initialization error:", err);
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
    return () => clearInterval(timerRef.current);
  }, [gameState, currentLetterIndex]);

  const handleTimeOut = () => {
    clearInterval(timerRef.current);
    setFeedback({
      message: "TIME EXPIRED! Analysis Terminated. ⏱️",
      type: "error",
      gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)]
    });
    setTimeout(nextChallenge, 2000);
  };

  const nextChallenge = () => {
    if (currentLetterIndex < shuffledLetters.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
      setTimeLeft(AGE_CONFIG[agePref].timer);
      setInputValue("");
      setFeedback({ message: "", type: "", gif: "" });
      setHint("");
      setHintUsed(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setGameState('WIN');
    if (score >= 0) {
      triggerCoins();
    }
    setIsLoading(true);

    try {
      const response = await walletService.awardCoins(
        'azm',
        Math.min(Math.floor(score / 10), 100),
        score
      );
      if (response && response.success) {
        console.log('Successfully synced BeCoins!');
        // Refetch leaderboard and transactions to show updated stats
        const [lb, tx, balanceData] = await Promise.all([
          gamesService.getLeaderboard('azm'),
          gamesService.getGameTransactions('azm'),
          walletService.getBalance()
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
      colors: ['#fccb0b', '#ffd700', '#00ff88']
    });
  };

  const getHint = async () => {
    if (hint || isLoading) return;
    setIsLoading(true);

    // Find keywords for current letter
    const validKeywords = FINANCE_KEYWORDS.filter(k => k.term.toUpperCase().startsWith(currentLetter.toUpperCase()));
    const randomKeyword = validKeywords.length > 0
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


  const checkIsFinanceTerm = async (word) => {
    const term = word.toUpperCase();
    const firstLetter = term[0];

    // 1. Check our manual A-Z dictionary (Highest priority)
    if (FINANCE_TERMS[firstLetter] && FINANCE_TERMS[firstLetter].some(t => t.toUpperCase() === term)) {
      return true;
    }

    // 2. Check the existing keywords list
    if (FINANCE_KEYWORDS.some(k => k.term.toUpperCase() === term)) {
      return true;
    }

    // 3. Fallback to external dictionary check
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) return false;
      const data = await response.json();
      const fullText = JSON.stringify(data).toLowerCase();
      return FINANCE_KEYWORDS.some(k => fullText.includes(k.term.toLowerCase()));
    } catch (error) {
      return false;
    }
  };

  const startGame = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setTimeLeft(AGE_CONFIG[agePref].timer);
      setGameState('PLAYING');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const term = inputValue.trim();
    setIsLoading(true);
    clearInterval(timerRef.current);

    // 1. Check if empty
    if (!term) {
      setFeedback({
        message: "No input detected! Skipping... ⏭️",
        type: "error",
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)]
      });
      setTimeout(() => {
        setIsLoading(false);
        nextChallenge();
      }, 2000);
      return;
    }

    // 2. Check if starts with correct letter
    if (term[0].toUpperCase() !== shuffledLetters[currentLetterIndex]) {
      setScore(prev => prev - 30);
      setFeedback({
        message: `Oops! Must start with ${shuffledLetters[currentLetterIndex]}! -30 Points ❌`,
        type: "error",
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)]
      });
      setTimeout(() => {
        setIsLoading(false);
        nextChallenge();
      }, 2000);
      return;
    }

    // 3. Deep validation
    const isValid = await checkIsFinanceTerm(term);

    if (isValid) {
      const points = hintUsed ? 50 : 100;
      setScore(prev => prev + points);
      setFeedback({
        message: `${hintUsed ? 'GOOD!' : 'STUNNING!'} +${points} Points 💎`,
        type: "success",
        gif: SUCCESS_GIFS[Math.floor(Math.random() * SUCCESS_GIFS.length)]
      });
    } else {
      setScore(prev => prev - 50);
      setFeedback({
        message: "Invalid Finance Term! -50 Points ❌",
        type: "error",
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)]
      });
    }

    setTimeout(() => {
      setIsLoading(false);
      nextChallenge();
    }, 2000);
  };

  if (gameState === 'WELCOME') {
    return (
      <div className="azm-body">
        <div className="game-container welcome-state fade-in">
          <aside className="game-sidebar">
            <div className="sidebar-card profile-card">
              <div className="avatar">{username[0]?.toUpperCase()}</div>
              <div className="profile-info">
                <div className="username">{username}</div>
                <div className="rank-badge">Active Player</div>
              </div>
            </div>

            <div className="sidebar-card wallet-card">
              <div className="card-header">
                <span className="icon">💳</span>
                <span className="title">Your Account</span>
              </div>
              <div className="wallet-stats">
                <div className="stat">
                  <span className="label">Current Balance</span>
                  <span className="value">{walletBalance} <small>BFC</small></span>
                </div>
              </div>
            </div>

            <div className="sidebar-card leaderboard-card">
              <div className="card-header">
                <span className="icon">🏆</span>
                <span className="title">Global Rankings</span>
              </div>
              <div className="stats-list">
                {leaderboard.length > 0 ? leaderboard.map((entry, i) => (
                  <div key={i} className="stats-item">
                    <span className="rank">#{i + 1}</span>
                    <span className="name">{entry.username}</span>
                    <span className={`${entry.score >= 0 ? 'text-green-500' : 'text-red-500'}`}>{entry.score > 0 ? `+${entry.score}` : entry.score}</span>
                  </div>
                )) : <div className="empty-msg">No entries yet</div>}
              </div>
            </div>
          </aside>

          <main className="game-main">
            <div className="main-content-card welcome-hero">
              <div className="hero-content">
                <h1 className="slide-up">A-Z of Money</h1>
                <p className="subtitle slide-up">Master the language of global finance and build your digital empire.</p>

                <div className="age-selector slide-up">
                  {Object.keys(AGE_CONFIG).map((pref) => (
                    <div
                      key={pref}
                      className={`age-option ${agePref === pref ? 'active' : ''}`}
                      onClick={() => setAgePref(pref)}
                    >
                      <div className="age-title">{AGE_CONFIG[pref].label}</div>
                      <div className="age-desc">{AGE_CONFIG[pref].desc}</div>
                    </div>
                  ))}
                </div>

                <div className="action-group slide-up">
                  <form onSubmit={startGame}>
                    <button type="submit" className="start-btn">INITIALIZE CORE MISSION</button>
                  </form>
                  <button
                    className="exit-btn"
                    onClick={() => router.push('/learning')}
                  >
                    BACK TO HUB
                  </button>
                </div>

                <div className="how-to-play-guide">
                  <h3>🎮 Operational Manual</h3>
                  <div className="guide-grid">
                    <div className="guide-step">
                      <div className="step-num">01</div>
                      <p>Enter a <strong>Finance Term</strong> starting with the assigned letter.</p>
                    </div>
                    <div className="guide-step">
                      <div className="step-num">02</div>
                      <p>Earn <strong>Elite Points</strong> for correct submissions.</p>
                    </div>
                    <div className="guide-step">
                      <div className="step-num">03</div>
                      <p>Use <strong>Insights</strong> if you're stuck on a complex term.</p>
                    </div>
                    <div className="guide-step">
                      <div className="step-num">04</div>
                      <p>Complete A-Z to sync <strong>BeCoins</strong> back to your treasury.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>📜 Recent Performance</h3>
                <div className="activity-list">
                  {recentTransactions.length > 0 ? recentTransactions.map((tx, i) => (
                    <div key={i} className="activity-item">
                      <span className="date">{new Date(tx.timestamp).toLocaleDateString()}</span>
                      <span className="desc">{tx.description}</span>
                      <span className="amount">+{tx.amount} BFC</span>
                    </div>
                  )) : <div className="empty-msg">No recent missions recorded</div>}
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
      <div className="azm-body">
        <div className="game-container win-state fade-in">
          <main className="win-content">
            <div className={`victory-card slide-up ${score < 0 ? 'failure' : ''}`}>
              <div className="victory-header">
                <div className="trophy">{score < 0 ? '🚫' : '🏆'}</div>
                <h1>{score < 0 ? 'MISSION FAILED' : 'MISSION SUCCESS'}</h1>
                <p className="subtitle">
                  {score < 0 ? 'Better luck next time' : 'Elite Financial Recognition Secured'}
                </p>
              </div>

              <div className="victory-stats">
                <div className="v-stat">
                  <span className="label">SCORE GENERATED</span>
                  <span className="value">{score}</span>
                </div>
                <div className="v-stat highlight">
                  <span className="label">
                    {score < 0 ? 'BECOINS DEDUCTED' : 'BECOINS SECURED'}
                  </span>
                  <span className={`value ${score < 0 ? 'text-red-500' : ''}`}>
                    {score < 0 ? '-' : '+'}{Math.abs(Math.min(Math.floor(score / 10), 100))}
                  </span>
                </div>
              </div>

              <div className="sync-indicator">
                {isLoading ? (
                  <div className="sync-status">Updating BeFin Treasury... 🔄</div>
                ) : (
                  <div className="sync-status success">Treasury Sync Complete ✅</div>
                )}
              </div>

              <div className="victory-actions">
                <button className="elite-btn primary" onClick={() => window.location.reload()}>RE-ENGAGE MISSION</button>
                <button
                  className="elite-btn secondary"
                  onClick={() => router.push('/dashboard')}
                >
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
    <div className="azm-body">
      <div className="game-container fade-in">
        <button
          className="back-edge-btn"
          onClick={() => router.push('/dashboard')}
          title="Return to Dashboard"
        >
          ✕
        </button>

        <aside className="game-sidebar">
          <div className="sidebar-card profile-card">
            <div className="avatar">{username[0]?.toUpperCase()}</div>
            <div className="profile-info">
              <div className="username">{username}</div>
              <div className="rank-badge">{AGE_CONFIG[agePref].label}</div>
            </div>
          </div>

          <div className="sidebar-card wallet-card">
            <div className="card-header">
              <span className="icon">💳</span>
              <span className="title">Wallet</span>
            </div>
            <div className="wallet-stats">
              <div className="stat">
                <span className="label">Balance</span>
                <span className="value">{walletBalance} <small>BFC</small></span>
              </div>
              <div className="stat">
                <span className="label">Session</span>
                <span className="value">{score} <small>PTS</small></span>
              </div>
            </div>
          </div>

          <div className="sidebar-card leaderboard-card overflow-y-auto max-h-[400px]">
            <div className="card-header sticky top-0">
              <span className="icon">🏆</span>
              <span className="title">Top Elite</span>
            </div>
            <div className="stats-list">
              {leaderboard.length > 0 ? leaderboard.map((entry, i) => (
                <div key={i} className="stats-item">
                  <span className="rank">#{i + 1}</span>
                  <span className="name">{entry.username}</span>
                  <span className={`score ${entry.score >= 0 ? 'text-green-500' : 'text-red-500'}`}>{entry.score > 0 ? `+${entry.score}` : entry.score}</span>
                </div>
              )) : <div className="empty-msg">No entries yet</div>}
            </div>
          </div>
        </aside>

        <main className="game-main">
          <div className="main-content-card">
            <div className="game-header">
              <div className="timer-display">
                <span className="label">Remaining</span>
                <span className="time" style={{ color: timeLeft < 5 ? 'var(--error)' : 'inherit' }}>
                  {timeLeft}s
                </span>
              </div>
              <div className="progress-section">
                <div className="progress-text">Level {currentLetterIndex + 1} of {QUESTIONS_COUNT}</div>
                <div className="progress-track">
                  <div className="progress-bar-elite" style={{ width: `${((currentLetterIndex + 1) / QUESTIONS_COUNT) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="game-canvas">
              <div className="letter-ring-container">
                <div className="letter-ring">{currentLetter}</div>
                <div className="ring-glow"></div>
              </div>

              <div className="action-center">
                <div className="hint-section">
                  <button className="lifeline-btn" onClick={getHint} disabled={hint || isLoading}>
                    💡 Get Insight
                  </button>
                  {hint && <div className="hint-box fade-in">{hint}</div>}
                </div>

                <div className="input-section">
                  <form onSubmit={handleSubmit} className="game-form">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={isLoading ? "Analyzing..." : `Enter ${currentLetter} Finance Term`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                    />
                    <button className="confirm-btn" disabled={isLoading}>
                      {isLoading ? "..." : "CONFIRM"}
                    </button>
                  </form>
                </div>

                <div className="feedback-container">
                  {feedback.gif && <img src={feedback.gif} className="feedback-gif" alt="feedback" />}
                  {feedback.message && <div className={`feedback ${feedback.type}`}>{feedback.message}</div>}
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

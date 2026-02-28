"use client";

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FINANCE_KEYWORDS } from './keywords';
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
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Read the shared befin_token cookie set by the Dashboard on localhost
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const token = getCookie('befin_token') || localStorage.getItem('befin_token') || localStorage.getItem('access_token');
    if (!token) {
      window.location.href = 'http://localhost:3000/login';
      return;
    }

    // 2. Fetch User Profile
    fetch('http://localhost:8000/api/users/profile/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Auth failed');
        return res.json();
      })
      .then(data => {
        setUsername(data.username);
      })
      .catch(() => {
        localStorage.removeItem('befin_token');
        window.location.href = 'http://localhost:3000/login';
      });

    const shuffled = [...ALL_LETTERS].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled.slice(0, QUESTIONS_COUNT));
  }, []);

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
    triggerCoins();
    setIsLoading(true);

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const token = getCookie('befin_token') || localStorage.getItem('befin_token') || localStorage.getItem('access_token');

    // Attempt to sync BeCoins
    try {
      const response = await fetch('http://localhost:8000/api/wallet/award/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username || undefined, // Backend will use token user if username is missing
          coins: Math.floor(score / 10),
          source: 'finance-hero-az',
          game_score: score
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Wallet sync failed:', errorData);
      } else {
        console.log('Successfully synced BeCoins!');
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
    const term = inputValue.trim();
    if (!term || isLoading) return;

    if (term[0].toUpperCase() !== shuffledLetters[currentLetterIndex]) {
      setFeedback({ message: `Oops! It must start with ${shuffledLetters[currentLetterIndex]}!`, type: "error" });
      return;
    }

    setIsLoading(true);
    const isValid = await checkIsFinanceTerm(term);
    setIsLoading(false);

    if (isValid) {
      triggerCoins();
      const points = hintUsed ? 50 : 100;
      setScore(prev => prev + points);
      setFeedback({
        message: `${hintUsed ? 'GOOD!' : 'STUNNING!'} +${points} Elite Points 💎`,
        type: "success",
        gif: SUCCESS_GIFS[Math.floor(Math.random() * SUCCESS_GIFS.length)]
      });
      setTimeout(nextChallenge, 2000);
    } else {
      setFeedback({
        message: "Invalid Transaction! ❌",
        type: "error",
        gif: FAILURE_GIFS[Math.floor(Math.random() * FAILURE_GIFS.length)]
      });
    }
  };

  if (gameState === 'WELCOME') {
    return (
      <div className="app-container">
        <div className="elite-card fade-in">
          <h1 className="slide-up">A-Z Finance Elite</h1>
          <p className="subtitle slide-up" style={{ animationDelay: '0.1s' }}>Master the language of wealth.</p>

          <div className="age-selector slide-up" style={{ animationDelay: '0.2s' }}>
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

          <div className="input-group slide-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={startGame}>
              <div style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>
                Welcome, <span style={{ color: 'var(--primary)' }}>{username || "Trader"}</span>
              </div>
              <button type="submit" className="elite-btn">Start Portfolio Ignition</button>
            </form>
            <button
              className="elite-btn secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => window.location.href = 'http://localhost:3000/dashboard'}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'WIN') {
    return (
      <div className="app-container">
        <div className="elite-card fade-in" style={{ textAlign: 'center' }}>
          <h1>PORTFOLIO COMPLETE</h1>
          <p className="subtitle">Total Value Generated: {score}</p>
          <div className="stat-item" style={{ marginTop: '1.5rem', opacity: isLoading ? 0.6 : 1 }}>
            {isLoading ? (
              <div className="sync-status">Syncing BeCoins to Wallet... 🔄</div>
            ) : (
              <div className="sync-status" style={{ color: 'var(--success)' }}>BeCoins Synced Successfully! ✅</div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
            <button className="elite-btn" onClick={() => window.location.reload()}>New Session</button>
            <button
              className="elite-btn secondary"
              onClick={() => window.location.href = 'http://localhost:3000/dashboard'}
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLetter = shuffledLetters[currentLetterIndex];

  return (
    <div className="app-container">
      <div className="elite-card">
        <button
          className="back-edge-btn"
          onClick={() => window.location.href = 'http://localhost:3000/dashboard'}
          title="Return to Dashboard"
        >
          ✕
        </button>
        <div className="user-hud slide-up">
          <div className="profile">
            <div className="avatar">{username[0]?.toUpperCase()}</div>
            <div>
              <div className="username">{username}</div>
              <div className="rank-badge">{AGE_CONFIG[agePref].label}</div>
            </div>
          </div>
          <div className="timer-ring-container">
            <div className="timer-text" style={{ color: timeLeft < 5 ? 'var(--error)' : '#fff' }}>
              {timeLeft}s
            </div>
          </div>
          <div className="coin-balance">
            {score} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>PTS</span>
          </div>
        </div>

        <div className="progress-track slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="progress-bar-elite" style={{ width: `${(currentLetterIndex / QUESTIONS_COUNT) * 100}%` }}></div>
        </div>

        <div className="letter-ring slide-up" style={{ animationDelay: '0.2s' }}>{currentLetter}</div>

        <div className="lifeline-panel slide-up" style={{ animationDelay: '0.3s' }}>
          <button className="lifeline-btn" onClick={getHint} disabled={hint || isLoading}>
            💡 Get Hint
          </button>
        </div>

        {hint && <div className="hint-box">{hint}</div>}

        <div className="input-group">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder={isLoading ? "Processing..." : `Term for ${currentLetter}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <button className="elite-btn" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Verify Term"}
            </button>
          </form>
        </div>

        <div className="feedback-container">
          {feedback.gif && <img src={feedback.gif} className="feedback-gif" alt="feedback" />}
          <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FINANCE_KEYWORDS } from './keywords';
import './index.css';

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LEADERBOARD_KEY = "finance_hero_ultimate_leaderboard";

// Age preferences: Kid (30s, simple), Teen (20s, medium), Adult (15s, hard)
const AGE_CONFIG = {
  KID: { timer: 45, label: "Junior Explorer", desc: "For youngsters learning about money!" },
  TEEN: { timer: 30, label: "Finance Trainee", desc: "For teens building wealth habits." },
  ADULT: { timer: 15, label: "Wall Street Pro", desc: "The ultimate challenge for experts!" }
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
  const [lifelines, setLifelines] = useState({ community: true, friends: true });
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) setLeaderboard(JSON.parse(saved));
    setShuffledLetters([...ALL_LETTERS].sort(() => Math.random() - 0.5));
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
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const newEntry = { name: username || "Anonymous", score, date: new Date().toLocaleDateString() };
    const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5);
    setLeaderboard(updated);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    setGameState('WIN');
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
    // In a real scenario, we'd fetch a random word starting with currentLetter
    // For now, we'll give them a partial clue or a synonym if they are stuck
    setHint(`HINT: Think about things related to ${currentLetter}... 🏦`);
    setIsLoading(false);
  };

  const useLifeline = (type) => {
    if (!lifelines[type]) return;
    setLifelines(prev => ({ ...prev, [type]: false }));
    if (type === 'community') {
      setFeedback({ message: "COMMUNITY SAYS: Try 'Bank' or 'Bonds'! 👥", type: "success" });
    } else {
      setFeedback({ message: "FRIEND SAYS: 'I think it's Cash!' 📱", type: "success" });
    }
  };

  const checkIsFinanceTerm = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) return false;
      const data = await response.json();
      const fullText = JSON.stringify(data).toLowerCase();
      return FINANCE_KEYWORDS.some(keyword => fullText.includes(keyword.toLowerCase()));
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
      setScore(prev => prev + 100);
      setFeedback({
        message: "STUNNING! +100 Elite Points 💎",
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
          <h1>FINANCE HERO</h1>
          <p className="subtitle">Ultimate Edition</p>

          <div className="age-selector">
            {Object.keys(AGE_CONFIG).map(key => (
              <div
                key={key}
                className={`age-option ${agePref === key ? 'active' : ''}`}
                onClick={() => setAgePref(key)}
              >
                <div className="age-title">{AGE_CONFIG[key].label}</div>
                <div className="age-desc">{AGE_CONFIG[key].desc}</div>
              </div>
            ))}
          </div>

          <form onSubmit={startGame} className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <button type="submit" className="elite-btn">Launch Portfolio</button>
          </form>

          <div className="leaderboard">
            <div className="leaderboard-title">Hall of Fame</div>
            {leaderboard.map((entry, i) => (
              <div key={i} className="leader-item">
                <span>{entry.name}</span>
                <span style={{ color: 'var(--gold)' }}>{entry.score} pts</span>
              </div>
            ))}
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
          <div className="game-stats">
            <div className="stat-item">
              <div className="stat-label">Age Class</div>
              <div className="stat-value">{AGE_CONFIG[agePref].label}</div>
            </div>
          </div>
          <button className="elite-btn" onClick={() => window.location.reload()}>New Session</button>
        </div>
      </div>
    );
  }

  const currentLetter = shuffledLetters[currentLetterIndex];

  return (
    <div className="app-container">
      <div className="elite-card fade-in">
        <div className="user-hud">
          <div className="profile">
            <div className="avatar">{username[0]?.toUpperCase()}</div>
            <div>
              <div className="username">{username}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>RANK: {AGE_CONFIG[agePref].label}</div>
            </div>
          </div>
          <div className="timer-ring-container">
            <div className="timer-text" style={{ color: timeLeft < 5 ? 'var(--error)' : 'var(--secondary)' }}>
              {timeLeft}s
            </div>
          </div>
          <div className="coin-balance">
            {score} PTS
          </div>
        </div>

        <div className="progress-track">
          <div className="progress-bar-elite" style={{ width: `${(currentLetterIndex / 26) * 100}%` }}></div>
        </div>

        <div className="letter-ring">{currentLetter}</div>

        <div className="lifeline-panel">
          <button className="lifeline-btn" onClick={getHint} disabled={hint || isLoading}>
            💡 Get Hint
          </button>
          <button className="lifeline-btn" onClick={() => useLifeline('community')} disabled={!lifelines.community}>
            👥 Ask Community
          </button>
          <button className="lifeline-btn" onClick={() => useLifeline('friends')} disabled={!lifelines.friends}>
            📱 Call Friend
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

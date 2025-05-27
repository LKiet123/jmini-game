import React, { useState, useEffect } from 'react';
import './MathBlitz.css';
import startSound from './assets/sounds/start.mp3';
import correctSound from './assets/sounds/correct.mp3';
import incorrectSound from './assets/sounds/incorrect.mp3';

const MathBlitz = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mathBlitzHighScore')) || 0;
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [feedback, setFeedback] = useState(null);

  // Generate random math question based on difficulty
  const generateQuestion = () => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, result;

    const ranges = {
      easy: { max: 20, multMax: 5, divMax: 5 },
      medium: { max: 50, multMax: 10, divMax: 9 },
      hard: { max: 100, multMax: 15, divMax: 12 },
    };

    const { max, multMax, divMax } = ranges[difficulty];

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * max) + 1;
        num2 = Math.floor(Math.random() * max) + 1;
        result = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * max) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        result = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * multMax) + 1;
        num2 = Math.floor(Math.random() * multMax) + 1;
        result = num1 * num2;
        break;
      case '/':
        num2 = Math.floor(Math.random() * divMax) + 1;
        result = Math.floor(Math.random() * multMax) + 1;
        num1 = num2 * result;
        break;
      default:
        break;
    }

    setQuestion(`${num1} ${operation} ${num2} = ?`);
    setCorrectAnswer(result);
  };

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(true);
    setAnswer('');
    setFeedback(null);
    generateQuestion();
    playSound('start');
  };

  // Handle answer submission
  const handleAnswer = (e) => {
    e.preventDefault();
    if (!gameStarted || gameOver) return;

    const userAnswer = parseFloat(answer);
    if (userAnswer === correctAnswer) {
      setScore(score + (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15));
      setFeedback({ type: 'correct', message: 'Correct!' });
      playSound('correct');
    } else {
      setScore(score - (difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 8));
      setFeedback({ type: 'incorrect', message: `Wrong! Answer was ${correctAnswer}` });
      playSound('incorrect');
    }
    setAnswer('');
    generateQuestion();
    setTimeout(() => setFeedback(null), 1000);
  };

  // Play sound effects
  const playSound = (type) => {
    const sounds = {
      start: new Audio(startSound),
      correct: new Audio(correctSound),
      incorrect: new Audio(incorrectSound),
    };
    sounds[type]?.play();
  };

  // Timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setGameStarted(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('mathBlitzHighScore', score);
            }
            clearInterval(timer);
            playSound('incorrect');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft, score, highScore]);

  // Handle input change
  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    if (gameStarted) {
      setAnswer('');
      generateQuestion();
    }
  };

  return (
    <div className="math-blitz-container">
      <div className="math-blitz-card">
        <h1 className="math-blitz-title">Math Blitz</h1>
        <div className="math-blitz-score">
          <p className="text-lg font-semibold">High Score: {highScore}</p>
        </div>

        {!gameStarted && !gameOver ? (
          <div className="math-blitz-controls">
            <select
              value={difficulty}
              onChange={handleDifficultyChange}
              className="math-blitz-select"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button onClick={startGame} className="math-blitz-button">
              Start Game
            </button>
          </div>
        ) : gameOver ? (
          <div className="math-blitz-game-over animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-600">Game Over!</h2>
            <p className="text-xl">Score: {score}</p>
            <p className="text-lg">High Score: {highScore}</p>
            <button onClick={startGame} className="math-blitz-button">
              Play Again
            </button>
          </div>
        ) : (
          <div className="math-blitz-game animate-fadeIn">
            <div className="math-blitz-stats">
              <p className="text-lg font-semibold">
                Time: <span className={timeLeft < 10 ? 'text-red-600' : 'text-blue-600'}>{timeLeft}s</span>
              </p>
              <p className="text-lg font-semibold">Score: {score}</p>
            </div>
            <p className="math-blitz-question">{question}</p>
            {feedback && (
              <p className={`math-blitz-feedback ${feedback.type === 'correct' ? 'text-green-600' : 'text-red-600'} animate-bounce`}>
                {feedback.message}
              </p>
            )}
            <form onSubmit={handleAnswer} className="math-blitz-form">
              <input
                type="number"
                value={answer}
                onChange={handleInputChange}
                className="math-blitz-input"
                placeholder="Enter answer"
                autoFocus
              />
              <button type="submit" className="math-blitz-button">
                Submit
              </button>
              
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathBlitz;
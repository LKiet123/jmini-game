import React, { useState, useEffect } from 'react';
// import "./games/MemoryGame/MemoryGame.css";
import './MemoryGame.css';

// Danh sách hình ảnh có thể sử dụng
const imagePairs = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
  '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞'
];

const MemoryGame = () => {
  const [level, setLevel] = useState(1); // 1: 8 thẻ, 2: 16 thẻ, 3: 32 thẻ
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Khởi tạo game dựa trên cấp độ
  const initializeGame = (selectedLevel) => {
    let pairsCount;
    switch (selectedLevel) {
      case 1: pairsCount = 4; break;
      case 2: pairsCount = 8; break;
      case 3: pairsCount = 16; break;
      default: pairsCount = 4;
    }

    // Chọn ngẫu nhiên các cặp hình ảnh
    const selectedImages = [...imagePairs].sort(() => 0.5 - Math.random()).slice(0, pairsCount);
    const cardPairs = [...selectedImages, ...selectedImages];
    
    // Tạo mảng thẻ bài
    const initialCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));

    setCards(initialCards);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
    setGameStarted(true);
  };

  // Kiểm tra khi có 2 thẻ được lật
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      if (cards[first].value === cards[second].value) {
        // Khớp nhau
        setCards(prev =>
          prev.map((card, i) =>
            i === first || i === second ? { ...card, matched: true } : card
          )
        );

        // Kiểm tra xem đã hoàn thành game chưa
        setTimeout(() => {
          if (cards.every(card => card.matched || [first, second].includes(card.id))) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        // Không khớp - lật lại sau 1 giây
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, flipped: false } : card
            )
          );
        }, 800);
      }
      
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  // Xử lý khi click vào thẻ
  const handleCardClick = (index) => {
    if (!gameStarted || gameComplete) return;
    if (flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) return;

    setCards(prev =>
      prev.map((card, i) => (i === index ? { ...card, flipped: true } : card))
    );
    setFlippedCards(prev => [...prev, index]);
  };

  // Reset game
  const resetGame = () => {
    initializeGame(level);
  };

  // Thay đổi cấp độ
  const changeLevel = (newLevel) => {
    setLevel(newLevel);
    setGameStarted(false);
  };

  // Tính toán số cột cho grid dựa trên cấp độ
  const getGridColumns = () => {
    switch (level) {
      case 1: return 4;
      case 2: return 8;
      case 3: return 8;
      default: return 4;
    }
  };

  return (
    <div className="game">
      <h1>Memory Game</h1>
      
      {!gameStarted ? (
        <div className="level-selection">
          <h2>Chọn cấp độ</h2>
          <div className="level-options">
            <button 
              className={`level-btn ${level === 1 ? 'active' : ''}`} 
              onClick={() => changeLevel(1)}
            >
              Dễ (8 thẻ)
            </button>
            <button 
              className={`level-btn ${level === 2 ? 'active' : ''}`} 
              onClick={() => changeLevel(2)}
            >
              Trung bình (16 thẻ)
            </button>
            <button 
              className={`level-btn ${level === 3 ? 'active' : ''}`} 
              onClick={() => changeLevel(3)}
            >
              Khó (32 thẻ)
            </button>
          </div>
          <button onClick={() => initializeGame(level)} className="start-btn">
            Bắt đầu
          </button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <div className="moves">Lượt chơi: {moves}</div>
            <div className="level">Cấp độ: {['Dễ', 'Trung bình', 'Khó'][level - 1]}</div>
          </div>
          
          <div 
            className={`card-grid level-${level}`} 
            style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}
          >
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-back">❤</div>
                <div className="card-front">{card.value}</div>
              </div>
            ))}
          </div>
          
          <div className="game-controls">
            <button onClick={resetGame} className="reset-btn">
              Chơi lại
            </button>
            <button 
              onClick={() => setGameStarted(false)} 
              className="change-level-btn"
            >
              Đổi cấp độ
            </button>
          </div>
          
          {gameComplete && (
            <div className="completion-message">
              <h2>Chúc mừng!</h2>
              <p>Bạn đã hoàn thành với {moves} lượt chơi!</p>
              <button onClick={resetGame} className="play-again-btn">
                Chơi lại
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryGame;
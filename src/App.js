import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TicTacToe from "./games/TicTacToe/TicTacToe";
import MemoryGame from "./games/MemoryGame/MemoryGame";
import MathBlitz from "./games/MathBlitz/MathBlitz";
import "./App.css";

function App() {
  const games = [
    {
      title: "Tic Tac Toe",
      description: "Một trò chơi kinh điển nơi người chơi lần lượt đánh dấu X hoặc O trên lưới để xếp được ba hoặc năm biểu tượng theo hàng, cột hoặc đường chéo.",
      path: "/TicTacToe",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/32/Tic_tac_toe.svg",
    },
    {
      title: "Memory Game",
      description: "Kiểm tra trí nhớ của bạn bằng cách lật các thẻ để tìm các cặp thẻ giống nhau trong một lưới.",
      path: "/MemoryGame",
      image: "https://i.pinimg.com/1200x/61/d9/30/61d930e2285665cf0a5a05fdd38d225b.jpg",
    },
    {
      title: "Math Blitz",
      description: "Trả lời các câu hỏi toán học (cộng, trừ, nhân, chia) trong 60 giây để kiếm điểm!",
      path: "/MathBlitz",
      image: "https://i.pinimg.com/1200x/cf/87/c0/cf87c0055bee794a2cc355b6dbbce8bd.jpg",
    },
  ];

  return (
    <Router>
      <div className="container my-4">
        <h1 className="text-center mb-4 fs-1 fw-bold">JMini-Game</h1>
        <div className="row">
          {games.map((game, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Link to={game.path} className="text-decoration-none">
                <div className="card game-card h-100">
                  <img src={game.image} className="card-img-top" alt={game.title} />
                  <div className="card-body">
                    <h5 className="card-title">{game.title}</h5>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Routes>
          <Route path="/" element={<p className="text-center">Chọn một mini game để chơi 🎮</p>} />
          <Route path="/TicTacToe" element={<TicTacToe />} />
          <Route path="/MemoryGame" element={<MemoryGame />} />
          <Route path="/MathBlitz" element={<MathBlitz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
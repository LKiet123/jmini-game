 import React, { useState } from "react";
// import "./games/TicTacToe/TicTacToe.css";
import "./TicTacToe.css";  

const TicTacToe = () => {

  const [boardSize, setBoardSize] = useState(3); // Kích thước bảng
  const [board, setBoard] = useState(Array(9).fill(null));  
  const [xIsNext, setXIsNext] = useState(true); 
  const [gameStarted, setGameStarted] = useState(false);  
  const [playerA, setPlayerA] = useState("X");  
  const [playerB, setPlayerB] = useState("O");  

   const winnerUser = (squares) => {
    const size = boardSize;
    const winCondition = size < 5 ? 3 : 5; // Với bảng nhỏ thì chỉ cần 3 ô liên tiếp để thắng

    // Lặp qua từng hàng của bảng chơi
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        const value = squares[row * size + col]; // Lấy giá trị của ô hiện tại
        if (!value) continue;

        let win = true;
        for (let i = 1; i < winCondition; i++) {
          // Kiểm tra các ô tiếp theo trong cùng hàng
          if (squares[row * size + col + i] !== value) {
            win = false;
            break; // Thoát khỏi vòng lặp
          }
        }
        if (win) return value; // trả về giá trị của người thắng cuộc nếu tìm thấy chuỗi chiến thắng
      }
    }

    // Kiem tra cot doc
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winCondition; row++) {
        const value = squares[row * size + col];
        if (!value) continue;

        let win = true;
        for (let i = 1; i < winCondition; i++) {
          // Neu mot o trong chuoi khong trung gia tri, khong co chien thang
          if (squares[(row + i) * size + col] !== value) {
            win = false;
            break; // Thoat vong lap neu gap o khong hop le
          }
        }

        if (win) return value; // Neu tim thay chuoi hop le, tra ve gia tri thang ("X" hoac "O")
      }
    }

    // Kiểm tra đường chéo chính
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        // Lấy giá trị tại ô xuất phát của đường chéo
        const value = squares[row * size + col];
        if (!value) continue;

        let win = true;
        for (let i = 1; i < winCondition; i++) {
          if (squares[(row + i) * size + col + i] !== value) {
            win = false;
            break;
          }
        }
        if (win) return value;
      }
    }

    // Kiểm tra đường chéo phụ
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = winCondition - 1; col < size; col++) {
        // Lấy giá trị tại ô xuất phát của đường chéo phụ
        const value = squares[row * size + col];
        if (!value) continue;

        let win = true;
        for (let i = 1; i < winCondition; i++) {
          if (squares[(row + i) * size + col - i] !== value) {
            win = false;
            break;
          }
        }
        if (win) return value;
      }
    }

    return null; // Không có người thắng
  };

  // Xử lý khi click vào ô  
  const handleClick = (i) => {
    if (!gameStarted) return; // Không làm gì nếu game chưa bắt đầu

    const squares = [...board]; // Tạo bản sao của board
    if (winnerUser(squares) || squares[i]) return; // Nếu đã thắng hoặc ô đã được chọn

    squares[i] = xIsNext ? "X" : "O"; // Gán giá trị X hoặc O
    setBoard(squares); // Cập nhật board
    setXIsNext(!xIsNext); // Đổi lượt chơi
  };

  const renderSquare = (i) => (
  <button
    className={`square ${board[i] ? (board[i] === "X" ? "x" : "o") : ""}`}
    onClick={() => handleClick(i)}
  >
    {board[i] ?? ""}
  </button>
);

  // Bắt đầu trò chơi
  const startGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null)); // Reset lại bàn cờ
    setXIsNext(true); // Reset lượt
    setGameStarted(true); // Bắt đầu game
  };

  // Chơi lại trò chơi nhưng giữ nguyên người chơi và kích thước
  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setXIsNext(true);
  };

  // Thay đổi kích thước bảng và quay lại màn thiết lập
  const changeBoardSize = (size) => {
    setBoardSize(size);
    setGameStarted(false);
  };

  // Xác định trạng thái trò chơi
  const winner = winnerUser(board);
  let status;
  if (winner) {
    status = `🎉Chúc mừng ${winner === "X" ? playerA : playerB} đã chiến thắng🏆`;
  } else if (board.every((square) => square !== null)) {
    status = "Hòa🤝! Không có người thắng";
  } else {
    status = `Lượt tiếp theo: ${xIsNext ? playerA : playerB}`;
  }

  // Tạo bàn cờ theo boardSize
  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < boardSize; i++) {
      const squaresInRow = [];
      for (let j = 0; j < boardSize; j++) {
        squaresInRow.push(renderSquare(i * boardSize + j));  
      }
      rows.push(
        <div key={i} className="board-row">
          {squaresInRow}
        </div>
      );
    }
    return rows;
  };

  // Giao diện chính
  return (
    <div className="game">
      <h1 className="game-title">Cờ Ca-ro(Tic-Tac-Toe)</h1>

      {/* Màn hình thiết lập trò chơi */}
      {!gameStarted ? (
        <div className="game-setup">
          <h2>Cài đặt</h2>
          <div className="player-names">
            <label>
              Tên người chơi A (X):
              <input
                type="text"
                value={playerA}
                onChange={(e) => setPlayerA(e.target.value)}
              />
            </label>
            <label>
              Tên người chơi B (O):
              <input
                type="text"
                value={playerB}
                onChange={(e) => setPlayerB(e.target.value)}
              />
            </label>
          </div>

          {/* Chọn kích thước bàn cờ */}
          <div className="board-size">
            <h3>Chọn size:</h3>
            <div className="size-options">
              <button
                className={boardSize === 3 ? "active" : ""}
                onClick={() => changeBoardSize(3)}
              >
                3x3
              </button>
              <button
                className={boardSize === 4 ? "active" : ""}
                onClick={() => changeBoardSize(4)}
              >
                4x4
              </button>
              <button
                className={boardSize === 5 ? "active" : ""}
                onClick={() => changeBoardSize(5)}
              >
                5x5
              </button>
              <button
                className={boardSize === 7 ? "active" : ""}
                onClick={() => changeBoardSize(7)}
              >
                7x7
              </button>
            </div>
          </div>

          {/* Nút bắt đầu */}
          <button onClick={startGame} className="start-button">
            Bắt đầu
          </button>
        </div>
      ) : (
        <>
          {/* Màn hình chơi game */}
          <div className="game-info">
            <div className="status">{status}</div>
            <div className="players">
              <span className={`player ${xIsNext ? "active" : ""}`}>
                {playerA}: X
              </span>
              <span className={`player ${!xIsNext ? "active" : ""}`}>
                {playerB}: O
              </span>
            </div>
          </div>

          {/* Bàn cờ */}
          <div className={`board board-${boardSize}`}>{renderBoard()}</div>

          {/* Nút điều khiển */}
          <div className="game-controls">
            <button onClick={resetGame} className="reset">
              Chơi lại
            </button>
            <button
              onClick={() => {
                setGameStarted(false); // Trở lại màn thiết lập
                setBoard(Array(boardSize * boardSize).fill(null));
              }}
              className="change-settings"
            >
              Trở lại
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicTacToe; 



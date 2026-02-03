import React, { useMemo, useState } from "react";
import "./App.css";

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Compute winner and winning line (if any).
 * @param {(null|'X'|'O')[]} squares
 * @returns {{winner: null|'X'|'O', line: null|number[]}}
 */
function calculateWinner(squares) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * True when the board has no empty squares.
 * @param {(null|'X'|'O')[]} squares
 */
function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Board state: 9 squares; null means empty. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** X always starts a new game. */
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isDraw = useMemo(() => !winner && isBoardFull(squares), [winner, squares]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw!";
    return `Turn: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Ignore clicks once game is over or square is occupied.
    if (winner || isDraw || squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const currentPlayer = xIsNext ? "X" : "O";

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Two-player game on the same device</p>
          </header>

          <div className="ttt-status" role="status" aria-live="polite">
            <span
              className={[
                "ttt-status-pill",
                winner
                  ? "is-winner"
                  : isDraw
                    ? "is-draw"
                    : currentPlayer === "X"
                      ? "is-x"
                      : "is-o",
              ].join(" ")}
            >
              {statusText}
            </span>
          </div>

          <div
            className="ttt-board"
            role="grid"
            aria-label="Tic Tac Toe board"
          >
            {squares.map((value, idx) => {
              const isWinningSquare = !!winningLine?.includes(idx);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-square",
                    value ? `is-${value.toLowerCase()}` : "",
                    isWinningSquare ? "is-winning" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}`}
                  disabled={!!winner || isDraw || !!value}
                >
                  <span className="ttt-square-value" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="ttt-footer">
            <button
              type="button"
              className="ttt-reset"
              onClick={resetGame}
              aria-label="Reset game"
            >
              Reset
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;

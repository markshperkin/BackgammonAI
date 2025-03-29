import { useState, useEffect } from "react";
import { startGame, rollDice, makeMove, getValidMoves, aiMove } from "./api";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState(null);
  const [dice, setDice] = useState([0, 0]);
  const [selectedChecker, setSelectedChecker] = useState(null);

  // Load game state when component mounts
  useEffect(() => {
    startGame().then(data => setGameState(data));
  }, []);

  // AI move effect: if it's Black's turn and game is not over, trigger the AI move
  useEffect(() => {
    console.log("useEffect triggered, current_player:", gameState?.current_player, "game_over:", gameState?.game_over);
    if (gameState && gameState.current_player === -1 && !gameState.game_over) {
      setTimeout(() => {
        aiMove().then(data => {
          console.log("AI move complete", data);
          setGameState(data);
        }).catch(err => console.error("AI move error:", err));
      },);
    }
  }, [gameState]);
  
  
  const handleMove = async (start, end) => {
    const data = await makeMove(start, end);
    if (data.error) {
      alert("Invalid move!");
    } else {
      setGameState(data);
      setSelectedChecker(null);
    }
  };

  const handleNewGame = async () => {
    const data = await startGame();
    setGameState(data);
    setSelectedChecker(null); // Clear any selected checker
  };

  const fetchValidMoves = async (start) => {
    const data = await getValidMoves({ start }); // assumes POST with { start }
    setValidMoves(data.valid_moves);
  };

  

  return (
    <div className="container">

      <h1>Backgammon Game</h1>
      <button onClick={handleNewGame}>Load New Game</button>
      <p>Moves Remaining: {gameState?.moves_remaining ? gameState.moves_remaining.join(", ") : "None"}</p>

      <p>Current Player: {gameState?.current_player === 1 ? "White" : "Black"}</p>


      {gameState?.current_player === 1 && gameState?.bar_white > 0 && (
  <div className="bar-selector" onClick={() => setSelectedChecker(-1)}>
    Re-enter White Checker from Bar (You have {gameState.bar_white})
  </div>
)}
{gameState?.current_player === -1 && gameState?.bar_black > 0 && (
  <div className="bar-selector" onClick={() => setSelectedChecker(24)}>
    Re-enter Black Checker from Bar (You have {gameState.bar_black})
  </div>
)}



      {/* Backgammon Board */}
      <div className="backgammon-board">
{/* Overlay confined to the board area */}
{gameState && gameState.game_over && (
  <div className="board-game-over-overlay">
    <div className="board-game-over-message">
      {gameState.game_over === 1 ? "White Wins!" : "Black Wins!"}
    </div>
  </div>
)}

        <div className="board-container">
          {/* Top Section */}
          <div className="top-section">
            {/* Top Left (Points 6-11 reversed) */}
            <div className="left-side">
              {gameState?.board?.slice(6, 12).reverse().map((point, idx) => {
                const actualIndex = 11 - idx; // Correct actual index for this cell
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    // Disable selection if it's not White's turn.
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      // Select only if it belongs to White.
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    {/* Debug Label: Display actual board index */}
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Invisible Separator */}
            <div className="middle-separator"></div>

            {/* Top Right (Points 0-5 reversed) */}
            <div className="right-side">
              {gameState?.board?.slice(0, 6).reverse().map((point, idx) => {
                const actualIndex = 5 - idx; // Correct actual index for this cell
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    // Disable selection if it's not White's turn.
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      // Select only if it belongs to White.
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

            {/* Center Vertical Bar for Jail */}
            <div className="bar">
              {gameState && (gameState.bar_black > 0 || gameState.bar_white > 0) ? (
                <>
                  {gameState.bar_black > 0 && (
                    <div className="bar-checkers">
                      {Array(gameState.bar_black)
                        .fill(null)
                        .map((_, i) => (
                          <span key={`b-${i}`} className="checker black"></span>
                        ))}
                    </div>
                  )}
                  {gameState.bar_white > 0 && (
                    <div className="bar-checkers">
                      {Array(gameState.bar_white)
                        .fill(null)
                        .map((_, i) => (
                          <span key={`w-${i}`} className="checker white"></span>
                        ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>

              {/* Borne-Off Area */}
              <div className="borne-off">
                {gameState && (
                  <>
                    {gameState.borne_off_white > 0 && (
                      <div className="borne-off-white">
                        <span className="label">White Off:</span> {gameState.borne_off_white}
                      </div>
                    )}
                    {gameState.borne_off_black > 0 && (
                      <div className="borne-off-black">
                        <span className="label">Black Off:</span> {gameState.borne_off_black}
                      </div>
                    )}
                  </>
                )}
              </div>

              {gameState && gameState.all_in_home && selectedChecker !== null && gameState.current_player === 1 && (() => {
                const bearOffMove = gameState.all_moves.find(
                  m => m[0] === selectedChecker && m[3] === "bear_off"
                );
                return bearOffMove ? (
                  <div className="borne-off-selector" onClick={() => handleMove(selectedChecker, bearOffMove[1])}>
                    Bear Off Selected White Checker
                  </div>
                ) : null;
              })()}

              {gameState && gameState.all_in_home && selectedChecker !== null && gameState.current_player === -1 && (() => {
                const bearOffMove = gameState.all_moves.find(
                  m => m[0] === selectedChecker && m[3] === "bear_off"
                );
                return bearOffMove ? (
                  <div className="borne-off-selector" onClick={() => handleMove(selectedChecker, bearOffMove[1])}>
                    Bear Off Selected Black Checker
                  </div>
                ) : null;
              })()}




          {/* Bottom Section */}
          <div className="bottom-section">
            {/* Bottom Left (Points 12-17) */}
            <div className="left-side">
              {gameState?.board?.slice(12, 18).map((point, idx) => {
                const actualIndex = idx + 12;
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    // Disable selection if it's not White's turn.
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      // Select only if it belongs to White.
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Invisible Separator */}
            <div className="middle-separator"></div>

            {/* Bottom Right (Points 18-23) */}
            <div className="right-side">
              {gameState?.board?.slice(18, 24).map((point, idx) => {
                const actualIndex = idx + 18;
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    // Disable selection if it's not White's turn.
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      // Select only if it belongs to White.
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
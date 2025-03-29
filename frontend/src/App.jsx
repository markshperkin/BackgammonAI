import { useState, useEffect } from "react";
import { startGame, rollDice, makeMove, getValidMoves } from "./api";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState(null);
  const [dice, setDice] = useState([0, 0]);
  const [selectedChecker, setSelectedChecker] = useState(null);

  // Load game state when component mounts
  useEffect(() => {
    startGame().then(data => setGameState(data));
  }, []);

  const handleRollDice = async () => {
    const data = await rollDice();
    setDice(data.dice);
    // Update the game state with the new moves_remaining from the backend.
    setGameState(prevState => ({
      ...prevState,
      moves_remaining: data.moves_remaining
    }));
  };
  
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
    handleRollDice()
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
                      if (selectedChecker === null) {
                        // Select only if it belongs to current player.
                        if (
                          (gameState.current_player > 0 && gameState.board[actualIndex] > 0) ||
                          (gameState.current_player < 0 && gameState.board[actualIndex] < 0)
                        ) {
                          setSelectedChecker(actualIndex);
                        } else {
                          alert("Select a valid checker");
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
                      // Enforce re-entry if black has checkers on the bar.
                      if (gameState.current_player === -1 && gameState.bar_black > 0) {
                        // Allow re-entry only if this cell is within black's home (indices 0–5).
                        if (actualIndex >= 0 && actualIndex <= 5) {
                          // For re-entry, use a special start value (e.g. 24) to indicate a bar move.
                          handleMove(24, actualIndex);
                          return;
                        } else {
                          alert("You must re-enter your checkers from the bar!");
                          return;
                        }
                      }
                      // Normal selection logic...
                      if (selectedChecker === null) {
                        if ((gameState.current_player > 0 && gameState.board[actualIndex] > 0) ||
                            (gameState.current_player < 0 && gameState.board[actualIndex] < 0)) {
                          setSelectedChecker(actualIndex);
                        } else {
                          alert("Select a valid checker");
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
                      if (selectedChecker === null) {
                        if (
                          (gameState.current_player > 0 && gameState.board[actualIndex] > 0) ||
                          (gameState.current_player < 0 && gameState.board[actualIndex] < 0)
                        ) {
                          setSelectedChecker(actualIndex);
                        } else {
                          alert("Select a valid checker");
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
                      // Enforce re-entry if white has checkers on the bar.
                      if (gameState.current_player === 1 && gameState.bar_white > 0) {
                        // Allow re-entry only if this cell is within white's home (indices 18–23).
                        if (actualIndex >= 18 && actualIndex <= 23) {
                          // For re-entry, use a special start value (e.g. -1) to indicate a bar move.
                          handleMove(-1, actualIndex);
                          return;
                        } else {
                          alert("You must re-enter your checkers from the bar!");
                          return;
                        }
                      }
                      // Normal cell selection logic follows...
                      if (selectedChecker === null) {
                        if ((gameState.current_player > 0 && gameState.board[actualIndex] > 0) ||
                            (gameState.current_player < 0 && gameState.board[actualIndex] < 0)) {
                          setSelectedChecker(actualIndex);
                        } else {
                          alert("Select a valid checker");
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

  // const handleCellClick = (index, offset, sliceLength, reversed) => {
  //   // Compute the actual board index:
  //   const actualIndex = reversed ? offset + sliceLength - 1 - index : offset + index;
  
  //   // If no checker is selected, check if the current cell contains one of the current player's checkers.
  //   if (selectedChecker === null) {
  //     if (gameState?.current_player > 0) {
  //       if (gameState?.board[actualIndex] > 0) {
  //         setSelectedChecker(actualIndex);
  //       } else if (gameState?.board[actualIndex] === 0) {
  //         alert("Select a checker");
  //       } else {
  //         alert("You cannot move an opponent's checker!");
  //       }
  //     } else if (gameState?.current_player < 0) {
  //       if (gameState?.board[actualIndex] < 0) {
  //         setSelectedChecker(actualIndex);
  //       } else if (gameState?.board[actualIndex] === 0) {
  //         alert("Select a checker");
  //       } else {
  //         alert("You cannot move an opponent's checker!");
  //       }
  //     }
  //   }
  //   // If this cell is already selected, unselect it.
  //   else if (selectedChecker === actualIndex) {
  //     setSelectedChecker(null);
  //   }
  //   // Otherwise, try to move from the selected checker to this cell.
  //   else {
  //     handleMove(selectedChecker, actualIndex);
  //   }
  // };

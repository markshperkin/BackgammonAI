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
    setDice([0, 0]);        // Optionally reset dice
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
      <button onClick={handleRollDice}>Roll Dice</button>
      <p>Dice: {dice[0]} - {dice[1]}</p>
      <p>Current Player: {gameState?.current_player === 1 ? "White" : "Black"}</p>

      {/* Backgammon Board */}
      <div className="backgammon-board">
        <div className="board-container">

          {/* Top Section: Top Left and Top Right with a small separator */}
          <div className="top-section">
            {/* Top Left (Points 0-5) */}
            <div className="left-side">
              {gameState?.board?.slice(6, 12).reverse().map((point, index) => (
                <div
                  key={index}
                  className={`point ${selectedChecker === index ? "selected" : ""}`}
                  
                  onClick={() => {
                    const actualIndex = 11 - index;
                    if (selectedChecker === null) {
                      if (gameState?.current_player > 0) {
                        if (gameState?.board[actualIndex] > 0) {
                          setSelectedChecker(index);
                          // fetchValidMoves(index);
                        } else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                      else if (gameState?.current_player < 0) {
                        if (gameState?.board[actualIndex] < 0)
                          setSelectedChecker(index);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                    } else if (selectedChecker === index) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                  
                >
                  {point !== 0 && <span className={`checker ${point > 0 ? "white" : "black"}`}>{Math.abs(point)}</span>}
                </div>
              ))}
            </div>

            {/* Small Invisible Separator */}
            <div className="middle-separator"></div>

            {/* Top Right (Points 6-11) */}
            <div className="right-side">
              {gameState?.board?.slice(0, 6).reverse().map((point, index) => (
                <div
                  key={index}
                  className={`point ${selectedChecker === index + 6 ? "selected" : ""}`}
                  onClick={() => {
                    const actualIndex = 5 - index;
                    if (selectedChecker === null) {
                      if (gameState?.current_player > 0) {
                        if (gameState?.board[actualIndex] > 0)
                          setSelectedChecker(index + 6);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                      else if (gameState?.current_player < 0) {
                        if (gameState?.board[actualIndex] < 0)
                          setSelectedChecker(index + 6);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                    } else if (selectedChecker === index + 6) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                  
                >
                  {point !== 0 && <span className={`checker ${point > 0 ? "white" : "black"}`}>{Math.abs(point)}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Center Vertical Bar */}
          <div className="bar"></div>

          {/* Bottom Section: Bottom Left and Bottom Right with a small separator */}
          <div className="bottom-section">
            {/* Bottom Left (Points 12-17) */}
            <div className="left-side">
              {gameState?.board?.slice(12, 18).map((point, index) => (
                <div
                  key={index + 12}
                  className={`point ${selectedChecker === index + 12 ? "selected" : ""}`}
                  onClick={() => {
                    const actualIndex = index + 12;
                    if (selectedChecker === null) {
                      if (gameState?.current_player > 0) {
                        if (gameState?.board[actualIndex] > 0)
                          setSelectedChecker(index + 12);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                      else if (gameState?.current_player < 0) {
                        if (gameState?.board[actualIndex] < 0)
                          setSelectedChecker(index + 12);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                    } else if (selectedChecker === index + 12) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                  
                >
                  {point !== 0 && <span className={`checker ${point > 0 ? "white" : "black"}`}>{Math.abs(point)}</span>}
                </div>
              ))}
            </div>

            {/* Small Invisible Separator */}
            <div className="middle-separator"></div>

            {/* Bottom Right (Points 18-23) */}
            <div className="right-side">
              {gameState?.board?.slice(18, 24).map((point, index) => (
                <div
                  key={index + 18}
                  className={`point ${selectedChecker === index + 18 ? "selected" : ""}`}
                  onClick={() => {
                    const actualIndex = index + 18;
                    if (selectedChecker === null) {
                      if (gameState?.current_player > 0) {
                        if (gameState?.board[actualIndex] > 0)
                          setSelectedChecker(index + 18);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                      else if (gameState?.current_player < 0) {
                        if (gameState?.board[actualIndex] < 0)
                          setSelectedChecker(index + 18);
                        else if (gameState.board[actualIndex] === 0)
                          alert("select a checker");
                        else
                          alert("You cannot move an opponent's checker!");
                      }
                    } else if (selectedChecker === index + 18) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                  
                >
                  {point !== 0 && <span className={`checker ${point > 0 ? "white" : "black"}`}>{Math.abs(point)}</span>}
                </div>
              ))}
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
